import React from 'react';
import "./style.css";

import 'ol/ol.css';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {defaults as defaultControls, ScaleLine, ZoomSlider} from 'ol/control';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style, Icon} from 'ol/style';
import {defaults as defaultInteractions, Select} from 'ol/interaction';

class GroupMap extends React.Component {
	firstPositionSet = false;

	infoStyle = {
		display: 'none'
	};

	positionStyle = new Style({
		image: new CircleStyle({
			radius: 6,
			fill: new Fill({
				color: '#3399CC'
			}),
			stroke: new Stroke({
				color: '#fff',
				width: 2
			})
		})
	});

	progressBar = {
		el: null,
		loading: 0,
		loaded: 0,
		addLoading: () => {
			if (this.progressBar.loading === 0) {
				this.progressBar.show();
			}
			++this.progressBar.loading;
			this.progressBar.update();
		},
		addLoaded: () => {
			setTimeout(() => {
				++this.progressBar.loaded;
				this.progressBar.update();
			}, 100);
		},
		update: () => {
			var width = (this.progressBar.loaded / this.progressBar.loading * 100).toFixed(1) + '%';
			this.progressBar.el.style.width = width;
			if (this.progressBar.loading === this.progressBar.loaded) {
				this.progressBar.loading = 0;
				this.progressBar.loaded = 0;
				setTimeout(() => {
					this.progressBar.hide();
				}, 500);
			}
		},
		show: () => {
			this.progressBar.el.style.display = 'block';
		},
		hide: () => {
			if (this.progressBar.loading === this.progressBar.loaded) {
				this.progressBar.el.style.display = 'none';
				this.progressBar.el.style.width = 0;
			}
		},
	};

	/*
	Zoom  | # Tiles to cover  | Tile width        | m / pixel    | ~ Scale        | Examples of
	Level | the entire world  | (° of longitudes) | (on Equator) | (on screen)    | areas to represent
	------|-------------------|-------------------|-------------------------------|-----------------
	    0 |                 1 |         360.0     |  156,412.0   | 1:500 million  | whole world
	    1 |                 4 |         180.0     |   78,206.0   | 1:250 million  |
	    2 |                16 |          90.0     |   39,103.0   | 1:150 million  | subcontinental area
	    3 |                64 |          45.0     |   19,551.0   |  1:70 million  | largest country
	    4 |               256 |          22.5     |    9,776.0   |  1:35 million  | 
	    5 |             1,024 |          11.25    |    4,888.0   |  1:15 million  | large African country
	    6 |             4,096 |           5.625   |    2,444.0   |  1:10 million  | large European country
	    7 |            16,384 |           2.813   |    1,222.0   |   1:4 million  | small country, US state
	    8 |            65,536 |           1.406   |      610.984 |   1:2 million  | 
	    9 |           262,144 |           0.703   |      305.492 |   1:1 million  | wide area, large metropolitan area
	   10 |         1,048,576 |           0.352   |      152.746 | 1:500 thousand | metropolitan area
	   11 |         4,194,304 |           0.176   |       76.373 | 1:250 thousand | city
	   12 |        16,777,216 |           0.088   |       38.187 | 1:150 thousand | town, or city district
	   13 |        67,108,864 |           0.044   |       19.093 |  1:70 thousand | village, or suburb
	   14 |       268,435,456 |           0.022   |        9.547 |  1:35 thousand | 
	   15 |     1,073,741,824 |           0.011   |        4.773 |  1:15 thousand | small road
	   16 |     4,294,967,296 |           0.005   |        2.387 |   1:8 thousand | street
	   17 |    17,179,869,184 |           0.003   |        1.193 |   1:4 thousand | block, park, addresses
	   18 |    68,719,476,736 |           0.001   |        0.596 |   1:2 thousand | some buildings, trees
	   19 |   274,877,906,944 |           0.0005  |        0.298 |   1:1 thousand | local highway and crossing details
	   20 | 1,099,511,627,776 |           0.00025 |        0.149 |   1:5 hundred  | A mid-sized building 
	*/
	defaultZoomLevel = 17;
	maxZoomLevel = 20;
	minZoomLevel = 1;

	createIconStyle = (src, img) => {
		return new Style({
			image: new Icon({
				anchor: [0.5, 0.96],
				crossOrigin: 'anonymous',
				src: src,
				img: img,
				imgSize: img ? [img.width, img.height] : undefined
			})
		});
	};

	iconStyles = {
		userDefault: this.createIconStyle('/images/map-icon.png'),
		userSelected: this.createIconStyle('/images/map-icon-selected.png'),
	}

	setTracker = e => this.geolocation.setTracking(e.target.checked);

	displayGeolocationUpdate = () => {
		document.getElementById('accuracy').innerText = this.geolocation.getAccuracy() + ' [m]';
		document.getElementById('altitude').innerText = this.geolocation.getAltitude() + ' [m]';
		document.getElementById('altitudeAccuracy').innerText = this.geolocation.getAltitudeAccuracy() + ' [m]';
		document.getElementById('heading').innerText = this.geolocation.getHeading() + ' [rad]';
		document.getElementById('speed').innerText = this.geolocation.getSpeed() + ' [m/s]';
	};

	displayGeolocationError = error => {
		var info = document.getElementById('info');
		info.innerHTML = error.message;
		info.style.display = '';
	};

	setAccuracyGeometry = () => {
		this.userAccuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());
	}

	setPosition = () => {
		const coordinates = this.geolocation.getPosition();
		if (coordinates) {
			this.userPositionFeature.setGeometry(new Point(coordinates));
			this.userIconFeature.setGeometry(new Point(coordinates));

			const animations = [{center: coordinates}];
			if (!this.firstPositionSet) {
				animations.push({zoom: this.defaultZoomLevel});
				this.firstPositionSet = true;
			}
			this.view.animate(...animations);
		}
		else {
			this.userPositionFeature.setGeometry(null);
			this.userIconFeature.setGeometry(null);
		}
	};

	updateCursor = e => this.map.getTargetElement().style.cursor = this.map.hasFeatureAtPixel(e.pixel) && this.map.getFeaturesAtPixel(e.pixel)[0].get('clickable') ? 'pointer' : '';

	componentDidMount () {
		this.firstPositionSet = false;

		this.progressBar.el = document.getElementById('map-progress');

		this.view = new View({
			center: [0, 0],
			zoom: this.minZoomLevel,
			maxZoom: this.maxZoomLevel,
			minZoom: this.minZoomLevel,
		});
		
		this.userAccuracyFeature = new Feature({
			name: 'userAccuracy',
			clickable: false,
		});
		this.userPositionFeature = new Feature({
			name: 'userPosition',
			clickable: false,
		});
		this.userIconFeature = new Feature({
			geometry: new Point([0, 0]),
			name: 'userIcon',
			clickable: true,
		});
		
		this.userPositionFeature.setStyle(this.positionStyle);
		this.userIconFeature.setStyle(this.iconStyles.userDefault);
		this.osm = new OSM();
		this.map = new Map({
			controls: defaultControls().extend([
				new ScaleLine({
					units: 'us',
					bar: true,
					steps: 4,
					text: false,
					minWidth: 140
				}),
				new ZoomSlider(),
			]),
			interactions: defaultInteractions().extend([
				new Select({
					filter: (feature, layer) => {
						console.log(feature.get('clickable'));
						return feature.get('clickable');
					},
					style: feature => this.iconStyles.userSelected,
				}),
			]),
			layers: [
				new TileLayer({
					source: this.osm,
				}),
				new VectorLayer({
					source: new VectorSource({
						features: [this.userAccuracyFeature, this.userPositionFeature, this.userIconFeature]
					})
				})
			],
			target: 'map',
			view: this.view
		});
		
		this.geolocation = new Geolocation({
			// enableHighAccuracy must be set to true to have the heading value.
			trackingOptions: {
				enableHighAccuracy: true
			},
			projection: this.view.getProjection()
		});

		document.getElementById('track').addEventListener('change', this.setTracker);
		this.osm.on('tileloadstart', this.progressBar.addLoading);
		this.osm.on('tileloadend', this.progressBar.addLoaded);
		this.osm.on('tileloaderror', this.progressBar.addLoaded);
		this.geolocation.on('change', this.displayGeolocationUpdate);
		this.geolocation.on('error', this.displayGeolocationError);
		this.geolocation.on('change:accuracyGeometry', this.setAccuracyGeometry);
		this.geolocation.on('change:position', this.setPosition);
		this.map.on('pointermove', this.updateCursor);
	}
	
	componentWillUnmount () {
		this.map.un('pointermove', this.updateCursor);
		this.geolocation.un('change:position', this.setPosition);
		this.geolocation.un('change:accuracyGeometry', this.setAccuracyGeometry);
		this.geolocation.un('error', this.displayGeolocationError);
		this.geolocation.un('change', this.displayGeolocationUpdate);
		this.osm.un('tileloaderror', this.progressBar.addLoaded);
		this.osm.un('tileloadend', this.progressBar.addLoaded);
		this.osm.un('tileloadstart', this.progressBar.addLoading);
		document.getElementById('track').removeEventListener('change', this.setTracker);
	}

	render () {
		return (
			<>
				<div id="map-wrapper">
					<div id="map" className="map"></div>
					<div id="map-progress"></div>
					<div id="info" style={this.infoStyle}></div>
				</div>
				<label htmlFor="track">
					track position
					<input id="track" type="checkbox"/>
				</label>
				<p>
					position accuracy : <code id="accuracy"></code>&nbsp;&nbsp;
					altitude : <code id="altitude"></code>&nbsp;&nbsp;
					altitude accuracy : <code id="altitudeAccuracy"></code>&nbsp;&nbsp;
					heading : <code id="heading"></code>&nbsp;&nbsp;
					speed : <code id="speed"></code>
				</p>
			</>
		);
	}
}

export default GroupMap;