import React from 'react';
import "./style.css";
import './node_modules/ol/ol.css';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import View from 'ol/View';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import { unByKey } from 'ol/Observable';
import { easeOut } from 'ol/easing';
import { toLonLat, fromLonLat } from 'ol/proj';
import { getVectorContext } from 'ol/render';
import { defaults as defaultControls, ScaleLine, ZoomSlider } from 'ol/control';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from 'ol/style';
import { defaults as defaultInteractions, Select } from 'ol/interaction';
import ViewGroupPageControl from './ViewGroupPageControl';
import LocationControl from './LocationControl';
import Axios from 'axios';
import APIURL from '../../utils/APIURL';

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

const createImageIconStyle = (src, img) => {
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
	interestPointDefault: createImageIconStyle('/images/map-icon.png'),
	interestPointSelected: createImageIconStyle('/images/map-icon-selected.png'),
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

const createPersonIcon = (name, description, userUUID, position, fillColor) => {
	const newFeature = new Feature({
		geometry: new Point(position),
		uuid: userUUID,
		description: description,
		name: name,
		featureType: 'person',
		clickable: true,
		selectedStyle: getCircleIconStyle(fillColor, '#f0f'),
	});
	newFeature.setStyle(getCircleIconStyle(fillColor));
	return newFeature;
};

const createInterestPointIcon = (name, description, id, position, fillColor) => {
	const newFeature = new Feature({
		geometry: new Point(position),
		id: id,
		description: description,
		name: name,
		featureType: 'interestPoint',
		clickable: true,
		selectedStyle: iconStyles.interestPointSelected,
	});
	newFeature.setStyle(iconStyles.interestPointDefault);
	return newFeature;
};

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

	setTracker = checked => this.geolocation.setTracking(checked);

	storedUserLocation = {
		longitude: null,
		latitude: null,
		accuracy: null,
		altitude: null,
		altitudeAccuracy: null,
		heading: null,
		speed: null,
	};

	displayGeolocationUpdate = () => {
		// document.getElementById('accuracy').innerText = this.geolocation.getAccuracy() + ' [m]';
		// document.getElementById('altitude').innerText = this.geolocation.getAltitude() + ' [m]';
		// document.getElementById('altitudeAccuracy').innerText = this.geolocation.getAltitudeAccuracy() + ' [m]';
		// document.getElementById('heading').innerText = this.geolocation.getHeading() + ' [rad]';
		// document.getElementById('speed').innerText = this.geolocation.getSpeed() + ' [m/s]';

		let locationDataChanged = false;

		// Store the new locaiton data
		const newPosition = this.geolocation.getPosition();
		const newLocationData = {
			longitude: newPosition[0],
			latitude: newPosition[1],
			accuracy: this.geolocation.getAccuracy() || null,
			altitude: this.geolocation.getAltitude() || null,
			altitudeAccuracy: this.geolocation.getAltitudeAccuracy() || null,
			heading: this.geolocation.getHeading() || null,
			speed: this.geolocation.getSpeed() || null,
		}

		// Check to see if there are any new changes warranting updating the database
		if ((this.storedUserLocation.longitude !== newLocationData.longitude)
			|| (this.storedUserLocation.latitude !== newLocationData.latitude)
			|| (this.storedUserLocation.accuracy !== newLocationData.accuracy)
			|| (this.storedUserLocation.altitude !== newLocationData.altitude)
			|| (this.storedUserLocation.altitudeAccuracy !== newLocationData.altitudeAccuracy)
			|| (this.storedUserLocation.heading !== newLocationData.heading)
			|| (this.storedUserLocation.speed !== newLocationData.speed)) {

			// Mark changes requiring updating the database
			locationDataChanged = true;

			// Replace the stored user location with the new location
			this.storedUserLocation = newLocationData;
		}

		if (locationDataChanged) {
			// Update the user's location
			Axios.put(APIURL('/api/user-location/' + this.props.match.params.uuid),
				newLocationData,
				{ withCredentials: true })
				.then(function () {
					console.log('Updated');
				})
				.catch(function (error) {
					console.error(error);
				});
		}
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

			if (this.followingUser) {
				const animations = [{ center: coordinates }];
				if (!this.firstPositionSet) {
					animations.push({ zoom: this.defaultZoomLevel });
					this.firstPositionSet = true;
				}
				this.view.animate(...animations);
			}
		}
		else {
			this.userPositionFeature.setGeometry(null);
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
			overlayPopup.contentElement.textContent = `${selectEvent.selected[0].get('name')} - ${selectEvent.selected[0].get('description')}`;
			overlayPopup.olData.setPosition(selectEvent.mapBrowserEvent.coordinate);
		}
		console.log(selectEvent.deselected.length, selectEvent.selected.length);
	};

	flashIconOut = e => {
		const duration = 3000;
		const feature = e.feature;
		const start = new Date().getTime();

		const listenerKey = this.featuresLayer.on('postrender', event => {
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
						width: 0.25 + opacity,
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
		const userLocation = this.geolocation.getPosition();
		if (typeof userLocation !== 'undefined') {
			// Grab all the user locations in this group not including the current user
			Axios.get(APIURL('/api/user-locations/' + this.props.match.params.uuid), { withCredentials: true })
				.then(groupUserDetails => {
					console.log(groupUserDetails.data);
					this.updateGroupUsers(groupUserDetails.data.reduce(function (accumulator, current) {
						accumulator[current.user_uuid] = {
							user_name: current.name,
							description: current.description,
							user_uuid: current.user_uuid,
							longitude: current.longitude,
							latitude: current.latitude,
							color: current.color,
						}
						return accumulator;
					}, {}));
				})
				.catch(function (error) {
					console.error(error);
				});
		}
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
							newUsersSnapshot[featureUUID].description,
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
					newUsersSnapshot[newUserUUID].description,
					newUsersSnapshot[newUserUUID].user_uuid,
					[newUsersSnapshot[newUserUUID].longitude, newUsersSnapshot[newUserUUID].latitude],
					newUsersSnapshot[newUserUUID].color
				)
			);
		}
	};

	queryGroupInterestPoints = groupUUID => {
		const userLocation = this.geolocation.getPosition();
		if (typeof userLocation !== 'undefined') {
			// Grab all the interest points in this group
			Axios.get(APIURL('/api/interest-points/' + this.props.match.params.uuid), { withCredentials: true })
				.then(interestPoints => {
					console.log(interestPoints.data);
					this.updateGroupInterestPoints(interestPoints.data.reduce(function (accumulator, current) {
						accumulator[current.id] = {
							name: current.name,
							description: current.description,
							id: current.id,
							longitude: current.longitude,
							latitude: current.latitude,
							color: current.color,
						}
						return accumulator;
					}, {}));
				})
				.catch(function (error) {
					console.error(error);
				});
		}
	};

	updateGroupInterestPoints = newInterestPointsSnapshot => {
		this.featuresSource.forEachFeature(feature => {
			if (feature.get('clickable') && feature.get('featureType') === 'interestPoint') {
				const featureID = feature.get('id');
				if (featureID in newInterestPointsSnapshot) {
					this.featuresSource.removeFeature(feature);
					this.featuresSource.addFeature(
						createInterestPointIcon(
							newInterestPointsSnapshot[featureID].name,
							newInterestPointsSnapshot[featureID].description,
							newInterestPointsSnapshot[featureID].id,
							[newInterestPointsSnapshot[featureID].longitude, newInterestPointsSnapshot[featureID].latitude],
							newInterestPointsSnapshot[featureID].color
						)
					);

					// Remove the updated feature from the new snapshot
					delete newInterestPointsSnapshot[featureID];
				}
				else {
					// Remove the feature from the current snapshot
					this.featuresSource.removeFeature(feature);
				}
			}
		});

		// Now add all the remaining new snapshot interest points
		for (const featureID in newInterestPointsSnapshot) {
			this.featuresSource.addFeature(
				createInterestPointIcon(
					newInterestPointsSnapshot[featureID].name,
					newInterestPointsSnapshot[featureID].description,
					newInterestPointsSnapshot[featureID].id,
					[newInterestPointsSnapshot[featureID].longitude, newInterestPointsSnapshot[featureID].latitude],
					newInterestPointsSnapshot[featureID].color
				)
			);
		}
	};

	componentDidMount() {
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

		this.locationControl = new LocationControl({ setTracker: this.setTracker, group_uuid: this.props.match.params.uuid });

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
				new ViewGroupPageControl({ history: this.props.history, newURL: '/view-group/' + this.props.match.params.uuid }),
				this.locationControl,
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

		Axios.get(APIURL('/api/user-locating-enabled/' + this.props.match.params.uuid), { withCredentials: true })
			.then(groupUserDetail => {
				this.locationControl.setTracker(groupUserDetail.data.locatingEnabled);
			})
			.catch(function (error) {
				console.error(error);
			})

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

	componentWillUnmount() {
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

	render() {
		return (
			<div>
				<div id="map-wrapper">
					<div id="map" className="map"></div>
					<div id="map-progress"></div>
					<div id="info" style={this.infoStyle}></div>
					<div id="map-popup">
						<a id="map-popup-closer" href="#close">✖</a>
						<div id="map-popup-content"></div>
					</div>
				</div>
			</div>
		);
	}
}

export default GroupMap;