Polymer({
  is: 'building-selector',

  properties: {
    links: {
      type: Array,
      value: () => {
        return [
          {
            text: 'Heat Map',
            url: 'heat-map/1'
          },
          {
            text: '3D Model',
            url: '3d-model'
          },
          {
            text: 'Analytics',
            url: 'analytics'
          }
        ];
      }
    }
  },

  closeInfoWindow() {

  },

  _createUrl(building, url) {
    return `#/${building}/${url}`;
  }
});
