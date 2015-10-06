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
  var wcPoly = document.createElement('script');
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

  var elements = [
    //https://github.com/PolymerElements/iron-icon/issues/19
    `${bower}/iron-icons/iron-icons.html`,
    /*
    //Polymer elements
    `${bower}/paper-drawer-panel/paper-drawer-panel.html`,
    `${bower}/paper-scroll-header-panel/paper-scroll-header-panel.html`,
    `${bower}/paper-toolbar/paper-toolbar.html`,
    `${bower}/paper-icon-button/paper-icon-button.html`,
    `${bower}/iron-flex-layout/iron-flex-layout.html`,
    */
    //Custom elements
    `${bower}/app-router/app-router.html`,
    /*
    //My elements
    '/elements/manga-list/manga-list.html',
    '/elements/manga-card/manga-card.html',
    '/elements/manga-info/manga-info.html'
    */
  ];

  elements.forEach(function(elementURL) {
    var elImport = document.createElement('link');
    elImport.rel = 'import';
    elImport.href = elementURL;
    elImport.async = 'true';

    document.head.appendChild(elImport);
  });
}

})();
