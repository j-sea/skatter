import React from 'react';
import "./style.css";

import 'ol/ol.css';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

class GroupMap extends React.Component {
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

	setTracking = () => this.geolocation.setTracking(this.checked);
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
	updateAccuracy = () => this.accuracyFeature.setGeometry(this.geolocation.getAccuracyGeometry());
	updatePosition = () => {
		var coordinates = this.geolocation.getPosition();
		this.positionFeature.setGeometry(
			coordinates
			? new Point(coordinates)
			: null
		);
	};

	componentDidMount () {
		this.view = new View({
			center: [0, 0],
			zoom: 2
		});
		
		this.map = new Map({
			layers: [
				new TileLayer({
					source: new OSM()
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
		
		this.accuracyFeature = new Feature();
		this.positionFeature = new Feature();
		this.positionFeature.setStyle(this.positionStyle);

		document.getElementById('track').addEventListener('change', this.setTracking);
		this.geolocation.on('change', this.displayGeolocationUpdate);
		this.geolocation.on('error', this.displayGeolocationError);
		this.geolocation.on('change:accuracyGeometry', this.updateAccuracy);
		this.geolocation.on('change:position', this.updatePosition);
		
		new VectorLayer({
			map: this.map,
			source: new VectorSource({
				features: [this.accuracyFeature, this.positionFeature]
			})
		});
	}

	componentWillUnmount () {
		this.geolocation.un('change:position', this.updatePosition);
		this.geolocation.un('change:accuracyGeometry', this.updateAccuracy);
		this.geolocation.un('error', this.displayGeolocationError);
		this.geolocation.un('change', this.displayGeolocationUpdate);
		document.getElementById('track').removeEventListener('change', this.setTracking);
	}

	render () {
		return (
			<>
				<div id="map" className="map"></div>
				<div id="info" style={this.infoStyle}></div>
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