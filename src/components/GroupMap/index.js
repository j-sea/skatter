import React from 'react';
import "./style.css";

import 'ol/ol.css';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import {unByKey} from 'ol/Observable';
import {easeOut} from 'ol/easing';
import {toLonLat, fromLonLat} from 'ol/proj';
import {getVectorContext} from 'ol/render';
import {defaults as defaultControls, ScaleLine, ZoomSlider} from 'ol/control';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style, Icon} from 'ol/style';
import {defaults as defaultInteractions, Select} from 'ol/interaction';

const progressBar = {
	htmlElement: null,
	loading: 0,
	loaded: 0,
	reset: () => {
		progressBar.htmlElement = document.getElementById('map-progress');
		progressBar.loading = progressBar.loaded = 0;
	},
	addLoading: () => {
		if (progressBar.loading === 0) {
			progressBar.show();
		}
		++progressBar.loading;
		progressBar.update();
	},
	addLoaded: () => {
		setTimeout(() => {
			++progressBar.loaded;
			progressBar.update();
		}, 100);
	},
	update: () => {
		var width = (progressBar.loaded / progressBar.loading * 100).toFixed(1) + '%';
		progressBar.htmlElement.style.width = width;
		if (progressBar.loading === progressBar.loaded) {
			progressBar.loading = 0;
			progressBar.loaded = 0;
			setTimeout(() => {
				progressBar.hide();
			}, 500);
		}
	},
	show: () => {
		progressBar.htmlElement.style.display = 'block';
	},
	hide: () => {
		if (progressBar.loading === progressBar.loaded) {
			progressBar.htmlElement.style.display = 'none';
			progressBar.htmlElement.style.width = 0;
		}
	},
};

const overlayPopup = {
	olData: null,
	contentElement: null,
	closerElement: null,
	reset: () => {
		overlayPopup.contentElement = document.getElementById('map-popup-content');
		overlayPopup.closerElement = document.getElementById('map-popup-closer');
		overlayPopup.olData = new Overlay({
			element: document.getElementById('map-popup'),
			autoPan: true,
			autoPanAnimation: {
				duration: 250,
			},
		});
	},
	attachClick: () => {
		overlayPopup.closerElement.addEventListener('click', overlayPopup.clickClose);
	},
	detachClick: () => {
		overlayPopup.closerElement.removeEventListener('click', overlayPopup.clickClose);
	},
	clickClose: e => {
		overlayPopup.olData.setPosition(undefined);
		overlayPopup.closerElement.blur();
		return false;
	},
}

const createIconStyle = (src, img) => {
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
const iconStyles = {
	userDefault: createIconStyle('/images/map-icon.png'),
	userSelected: createIconStyle('/images/map-icon-selected.png'),
};

const circleIconStyles = {};
const getCircleIconStyle = (fillColor, strokeColor) => {
	fillColor = typeof fillColor !== 'undefined' ? fillColor : '#3399CC';
	strokeColor = typeof strokeColor !== 'undefined' ? strokeColor : '#fff';

	if (!circleIconStyles.hasOwnProperty(fillColor + strokeColor)) {
		circleIconStyles[fillColor + strokeColor] = new Style({
			image: new CircleStyle({
				radius: 6,
				fill: new Fill({
					color: fillColor,
				}),
				stroke: new Stroke({
					color: strokeColor,
					width: 2
				})
			})
		});
	}

	return circleIconStyles[fillColor + strokeColor];
};

const createPersonIcon = (name, userUUID, position, fillColor) => {
	const newFeature = new Feature({
		geometry: new Point(position),
		uuid: userUUID,
		name: name,
		featureType: 'person',
		clickable: true,
		selectedStyle: getCircleIconStyle(fillColor, '#f0f'),
	});
	newFeature.setStyle(getCircleIconStyle(fillColor));
	return newFeature;
}

class GroupMap extends React.Component {
	infoStyle = {
		display: 'none'
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

	setAccuracyGeometry = () => this.userAccuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());

	setPosition = () => {
		const coordinates = this.geolocation.getPosition();
		if (coordinates) {
			this.userPositionFeature.setGeometry(new Point(coordinates));
			this.userIconFeature.setGeometry(new Point(coordinates));
			if (this.featuresSource.getFeatureById('userIcon') === null) {
				this.featuresSource.addFeature(this.userIconFeature);
			}

			if (this.followingUser) {
				const animations = [{center: coordinates}];
				if (!this.firstPositionSet) {
					animations.push({zoom: this.defaultZoomLevel});
					this.firstPositionSet = true;
				}
				this.view.animate(...animations);
			}
		}
		else {
			this.userPositionFeature.setGeometry(null);
			this.userIconFeature.setGeometry(null);
		}
	};

	updateCursor = e => {
		if (this.map.hasFeatureAtPixel(e.pixel) && this.map.getFeaturesAtPixel(e.pixel)[0].get('clickable')) {
			this.map.getTargetElement().style.cursor = 'pointer';
		}
		else {
			this.map.getTargetElement().style.cursor = '';
		}
	};

	selectIcon = selectEvent => {
		if (selectEvent.selected.length === 0) {
			overlayPopup.clickClose();
		}
		else {
			overlayPopup.contentElement.textContent = selectEvent.selected[0].get('name');
			overlayPopup.olData.setPosition(selectEvent.mapBrowserEvent.coordinate);
		}
		console.log(selectEvent.deselected.length, selectEvent.selected.length);
	};

	flashIconOut = e => {
		const duration = 3000;
		const feature = e.feature;
		const start = new Date().getTime();
	
		const listenerKey = this.tileLayer.on('postrender', event => {
			const vectorContext = getVectorContext(event);
			const frameState = event.frameState;
			const flashGeom = feature.getGeometry().clone();
			const elapsed = frameState.time - start;
			const elapsedRatio = elapsed / duration;
			// radius will be 5 at start and 30 at end.
			const radius = easeOut(elapsedRatio) * 25 + 5;
			const opacity = easeOut(1 - elapsedRatio);
	
			const style = new Style({
				image: new CircleStyle({
					radius: radius,
					stroke: new Stroke({
						color: 'rgba(255, 0, 0, ' + opacity + ')',
						width: opacity,
					})
				})
			});
	
			vectorContext.setStyle(style);
			vectorContext.drawGeometry(flashGeom);
			if (elapsed > duration) {
				unByKey(listenerKey);
				return;
			}
			// tell OpenLayers to continue postrender animation
			this.map.render();
		});
	};

	queryGroupUsers = groupUUID => {
		// if (this.featuresSource.getFeatures().length === 3) {
			const userLocation = this.geolocation.getPosition();
			if (typeof userLocation !== 'undefined') {
				this.updateGroupUsers({
					'a': { user_name: 'Joe', user_uuid: 'a', longitude: userLocation[0] + Math.random() * 400 - 200, latitude: userLocation[1] + Math.random() * 400 - 200, color: '#00f'},
					'b': { user_name: 'Samantha', user_uuid: 'b', longitude: userLocation[0] + Math.random() * 400 - 200, latitude: userLocation[1] + Math.random() * 400 - 200, color: '#f00'},
					'c': { user_name: 'Barbara', user_uuid: 'c', longitude: userLocation[0] + Math.random() * 400 - 200, latitude: userLocation[1] + Math.random() * 400 - 200, color: '#0ff'},
					'd': { user_name: 'Jeb', user_uuid: 'd', longitude: userLocation[0] + Math.random() * 400 - 200, latitude: userLocation[1] + Math.random() * 400 - 200, color: '#ff0'},
					'e': { user_name: 'Marley', user_uuid: 'e', longitude: userLocation[0] + Math.random() * 400 - 200, latitude: userLocation[1] + Math.random() * 400 - 200, color: '#c48'},
				});
			}
		// }
	};

	updateGroupUsers = newUsersSnapshot => {
		this.featuresSource.forEachFeature(feature => {
			if (feature.get('clickable') && feature.get('featureType') === 'person') {
				const featureUUID = feature.get('uuid');
				if (featureUUID in newUsersSnapshot) {
					this.featuresSource.removeFeature(feature);
					this.featuresSource.addFeature(
						createPersonIcon(
							newUsersSnapshot[featureUUID].user_name,
							newUsersSnapshot[featureUUID].user_uuid,
							[newUsersSnapshot[featureUUID].longitude, newUsersSnapshot[featureUUID].latitude],
							newUsersSnapshot[featureUUID].color
						)
					);

					// Remove the updated feature from the new snapshot
					delete newUsersSnapshot[featureUUID];
				}
				else {
					// Remove the feature from the current snapshot
					this.featuresSource.removeFeature(feature);
				}
			}
		});

		// Now add all the remaining new snapshot users
		for (const newUserUUID in newUsersSnapshot) {
			this.featuresSource.addFeature(
				createPersonIcon(
					newUsersSnapshot[newUserUUID].user_name,
					newUsersSnapshot[newUserUUID].user_uuid,
					[newUsersSnapshot[newUserUUID].longitude, newUsersSnapshot[newUserUUID].latitude],
					newUsersSnapshot[newUserUUID].color
				)
			);
		}
	};

	currentInterestPointsSnapshot = [];
	queryGroupInterestPoints = groupUUID => {

	};

	updateGroupInterestPoints = newInterestPointsSnapshot => {

	};

	componentDidMount () {
		progressBar.reset();
		overlayPopup.reset();

		this.firstPositionSet = false;
		this.followingUser = true;

		this.updateInterval = setInterval(() => {
			this.queryGroupUsers('groupUUID');
			this.queryGroupInterestPoints('groupUUID');
		}, 10000);

		this.view = new View({
			center: [0, 0],
			zoom: this.minZoomLevel,
			maxZoom: this.maxZoomLevel,
			minZoom: this.minZoomLevel,
		});
		
		this.userAccuracyFeature = new Feature({
			name: 'userAccuracy',
			featureType: 'accuracy',
			clickable: false,
		});
		this.userPositionFeature = new Feature({
			name: 'userPosition',
			featureType: 'person',
			clickable: false,
		});
		this.userIconFeature = new Feature({
			geometry: new Point([0, 0]),
			name: 'UW Continuing Education Building',
			featureType: 'interestPoint',
			clickable: true,
			selectedStyle: iconStyles.userSelected,
		});
		this.userIconFeature.setId('userIcon');
		this.userAccuracyFeature.setStyle(new Style({
			stroke: new Stroke({
				color: '#ffffff',
				width: 1.25,
			}),
			fill: new Fill({
				color: '#ffffff80',
			})
		}));
		this.userPositionFeature.setStyle(getCircleIconStyle());
		this.userIconFeature.setStyle(iconStyles.userDefault);
		this.selectInteraction = new Select({
			filter: feature => feature.get('clickable'),
			style: feature => feature.get('selectedStyle'),
		});

		this.featuresSource = new VectorSource({
			features: [this.userAccuracyFeature, this.userPositionFeature]
		});
		this.featuresLayer = new VectorLayer({
			source: this.featuresSource,
		});
		this.osm = new OSM();
		this.tileLayer = new TileLayer({
			source: this.osm,
		});

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
				this.selectInteraction,
			]),
			layers: [
				this.tileLayer,
				this.featuresLayer,
			],
			overlays: [overlayPopup.olData],
			target: 'map',
			view: this.view,
		});

		this.geolocation = new Geolocation({
			// enableHighAccuracy must be set to true to have the heading value.
			trackingOptions: {
				enableHighAccuracy: true
			},
			projection: this.view.getProjection()
		});

		document.getElementById('track').addEventListener('change', this.setTracker);
		this.osm.on('tileloadstart', progressBar.addLoading);
		this.osm.on('tileloadend', progressBar.addLoaded);
		this.osm.on('tileloaderror', progressBar.addLoaded);
		this.geolocation.on('change', this.displayGeolocationUpdate);
		this.geolocation.on('error', this.displayGeolocationError);
		this.geolocation.on('change:accuracyGeometry', this.setAccuracyGeometry);
		this.geolocation.on('change:position', this.setPosition);
		this.selectInteraction.on('select', this.selectIcon);
		overlayPopup.attachClick();
		this.featuresSource.on('addfeature', this.flashIconOut)
		this.map.on('pointermove', this.updateCursor);
	}
	
	componentWillUnmount () {
		this.map.un('pointermove', this.updateCursor);
		this.featuresSource.un('addfeature', this.flashIconOut)
		overlayPopup.detachClick();
		this.selectInteraction.un('select', this.selectIcon);
		this.geolocation.un('change:position', this.setPosition);
		this.geolocation.un('change:accuracyGeometry', this.setAccuracyGeometry);
		this.geolocation.un('error', this.displayGeolocationError);
		this.geolocation.un('change', this.displayGeolocationUpdate);
		this.osm.un('tileloaderror', progressBar.addLoaded);
		this.osm.un('tileloadend', progressBar.addLoaded);
		this.osm.un('tileloadstart', progressBar.addLoading);
		clearInterval(this.updateInterval);
	}

	render () {
		return (
			<>
				<div id="map-wrapper">
					<div id="map" className="map"></div>
					<div id="map-progress"></div>
					<div id="info" style={this.infoStyle}></div>
					<div id="map-popup">
						<a id="map-popup-closer" href="#close">✖</a>
						<div id="map-popup-content"></div>
					</div>
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