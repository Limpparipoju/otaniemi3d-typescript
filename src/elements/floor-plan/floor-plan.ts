Polymer({
  is: 'floor-plan',

  properties: {
    data: {
      type: Object,
      value: () => {return {}}
    },
    buildingId: {
      type: String,
      value: ''
    }
  },

  observers: [
    '_fetchSensorData(data, buildingId)'
  ],

  ready() {

  },

  _getFloorPlan(floorPlan: FloorPlan): Promise<FloorPlan> {
    return new Promise((resolve, reject) => {
      if (floorPlan.svg) {
        resolve(floorPlan);
      } else {
        d3.xml(floorPlan.url, 'image/svg+xml', (xml) => {
          if (xml) {
            floorPlan.svg = xml.documentElement;
            resolve(floorPlan);
          } else {
            reject('Could not fetch the floorplan.');
          }
        });
      }
    });
  },

  _appendFloorPlan(floorPlan: FloorPlan): FloorPlan {
    floorPlan.rooms = [];
    floorPlan.sensorData = [];
    floorPlan.translate = [0,0];
    floorPlan.scale = 1;

    let svg = d3.select(floorPlan.svg)
      .select('svg');

    //Configure dragging and zooming behavior.
    let zoomListener = d3.behavior.zoom()
      .scaleExtent([0.5, 10])
      .scale(floorPlan.scale)
      .translate(floorPlan.translate)
      .on('zoom', () => {
        let event: any = d3.event;
        svg.select('g').attr('transform',
          `translate(${event.translate})scale(${event.scale})`);
        floorPlan.scale = event.scale;
        floorPlan.translate = event.translate;
      });

    svg.call(zoomListener);

    return floorPlan;
  },

  _fetchSensorData() {
    let request: any = document.createElement('omi-message');
    let rooms = this.data.rooms.map((room) => {
      return `
        <Object>
          <id>${room.id}</id>
        </Object>`;
    });

    request.send('read', `
      <Object>
        <id>${this.buildingId}</id>
        ${rooms.join('\n')}
      </Object>`
    );
  }
});
