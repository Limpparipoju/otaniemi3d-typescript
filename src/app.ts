(function () {
//Bower components location
const bower = 'bower_components';

/**
 * Conditionally loads webcomponents polyfill if needed.
 * Credit: Glen Maddern (geelen on GitHub)
 */
var webComponentsSupported = (
  'registerElement' in document &&
  'import' in document.createElement('link') &&
  'content' in document.createElement('template')
);

if (!webComponentsSupported) {
  let wcPoly = document.createElement('script');
  wcPoly.async = true;
  wcPoly.src = `${bower}/webcomponentsjs/webcomponents-lite.min.js`;
  wcPoly.onload = lazyLoadPolymerAndElements;
  document.head.appendChild(wcPoly);
} else {
  lazyLoadPolymerAndElements();
}

function lazyLoadPolymerAndElements() {
  window.Polymer = window.Polymer || {};
  window.Polymer.dom = 'shadow';

  let elements = [
    `${bower}/polymer/polymer.html`,

    //https://github.com/PolymerElements/iron-icon/issues/19
    `${bower}/iron-icons/iron-icons.html`,

    //We only need app-router elements for our index page.
    //App-router then dynamically loads necessary elements depending
    //on the current route.
    `${bower}/app-router/app-router.html`
  ];

  elements.forEach((elementURL) => {
    let elImport = document.createElement('link');
    elImport.rel = 'import';
    elImport.href = elementURL;
    elImport.async = 'true';

    document.head.appendChild(elImport);
  });
}
})();

(function polyfills() {
  if (!Array.prototype.find) {
    Array.prototype.find = function(predicate) {
      if (this === null) {
        throw new TypeError('Array.prototype.find called on null or undefined');
      }
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }
      var list = Object(this);
      var length = list.length >>> 0;
      var thisArg = arguments[1];
      var value;

      for (var i = 0; i < length; i++) {
        value = list[i];
        if (predicate.call(thisArg, value, i, list)) {
          return value;
        }
      }
      return undefined;
    };
  }
})();
