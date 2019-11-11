import {Control} from 'ol/control';
import Axios from 'axios';
import APIURL from '../../utils/APIURL';

var LocationControl = /*@__PURE__*/(function (Control) {
  function LocationControl(opt_options) {
		console.log(opt_options);
		var options = opt_options || {};

		var trackingMode = 'gps_off'; // gps_fixed, gps_not_fixed
		const trackingModeIcon = () => `<i class="material-icons">${trackingMode}</i>`;

    var button = document.createElement('button');
    button.innerHTML = trackingModeIcon();

    var element = document.createElement('div');
		element.className = 'ol-unselectable ol-control';
		element.id = 'map-location-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target
    });

		LocationControl.prototype.setTracker = (enabled) => {
			if (enabled) {
				trackingMode = 'gps_fixed';
			}
			else {
				trackingMode = 'gps_off';
			}
			button.innerHTML = trackingModeIcon();
			options.setTracker(enabled);
		};

    button.addEventListener('click', e => {
			switch (trackingMode) {
				case 'gps_off':
					trackingMode = 'gps_fixed'; break;
				// case 'gps_fixed':
				// 	trackingMode = 'gps_not_fixed'; break;
				default:
					trackingMode = 'gps_off';
			}
			button.innerHTML = trackingModeIcon();
			options.setTracker(trackingMode === 'gps_fixed');

			// Update the user's preference for this group map
			Axios.put(APIURL('/api/user-locating-enabled/' + options.group_uuid),
				{ locatingEnabled: (trackingMode === 'gps_fixed') },
				{ withCredentials: true })
			.then(() => {
				console.log('Locating preference updated');
			})
			.catch(function (error) {
				console.error(error);
			})
		});
  }

  if ( Control ) LocationControl.__proto__ = Control;
  LocationControl.prototype = Object.create( Control && Control.prototype );
	LocationControl.prototype.constructor = LocationControl;

  return LocationControl;
}(Control));

export default LocationControl;