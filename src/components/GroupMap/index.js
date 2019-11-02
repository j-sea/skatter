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

	componentDidMount () {
		var view = new View({
			center: [0, 0],
			zoom: 2
		});
		
		var map = new Map({
			layers: [
				new TileLayer({
					source: new OSM()
				})
			],
			target: 'map',
			view: view
		});
		
		var geolocation = new Geolocation({
			// enableHighAccuracy must be set to true to have the heading value.
			trackingOptions: {
				enableHighAccuracy: true
			},
			projection: view.getProjection()
		});
		
		function el(id) {
			return document.getElementById(id);
		}
		
		el('track').addEventListener('change', function() {
			geolocation.setTracking(this.checked);
		});
		
		// update the HTML page when the position changes.
		geolocation.on('change', function() {
			el('accuracy').innerText = geolocation.getAccuracy() + ' [m]';
			el('altitude').innerText = geolocation.getAltitude() + ' [m]';
			el('altitudeAccuracy').innerText = geolocation.getAltitudeAccuracy() + ' [m]';
			el('heading').innerText = geolocation.getHeading() + ' [rad]';
			el('speed').innerText = geolocation.getSpeed() + ' [m/s]';
		});
		
		// handle geolocation error.
		geolocation.on('error', function(error) {
			var info = document.getElementById('info');
			info.innerHTML = error.message;
			info.style.display = '';
		});
		
		var accuracyFeature = new Feature();
		geolocation.on('change:accuracyGeometry', function() {
			accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
		});
		
		var positionFeature = new Feature();
		positionFeature.setStyle(new Style({
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
		}));
		
		geolocation.on('change:position', function() {
			var coordinates = geolocation.getPosition();
			positionFeature.setGeometry(coordinates ?
				new Point(coordinates) : null);
		});
		
		new VectorLayer({
			map: map,
			source: new VectorSource({
				features: [accuracyFeature, positionFeature]
			})
		});
	}

	render () {
		return (
			<>
				<div id="map" class="map"></div>
				<div id="info" style={this.infoStyle}></div>
				<label for="track">
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