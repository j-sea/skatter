import { Control } from 'ol/control';

var ViewGroupPageControl = /*@__PURE__*/(function (Control) {
  function ViewGroupPageControl(opt_options) {
    console.log(opt_options);
    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = '<i class="material-icons">arrow_back</i>';

    var element = document.createElement('div');
    element.className = 'ol-unselectable ol-control';
    element.id = 'map-view-group-page-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target
    });

    button.addEventListener('click', e => {
      options.history.push(options.newURL);
    });
  }

  if (Control) ViewGroupPageControl.__proto__ = Control;
  ViewGroupPageControl.prototype = Object.create(Control && Control.prototype);
  ViewGroupPageControl.prototype.constructor = ViewGroupPageControl;

  return ViewGroupPageControl;
}(Control));

export default ViewGroupPageControl;