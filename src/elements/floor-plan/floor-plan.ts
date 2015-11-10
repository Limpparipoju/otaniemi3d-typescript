Polymer({
  is: 'floor-plan',

  properties: {
    data: Object,
    building: String
  },

  observers: [
    '_init(data, building)'
  ],

  _init(data: FloorPlan, building: string): void {
    this._getFloorPlan(data)
    .then(this._appendFloorPlan.bind(this))
    .then(this._fetchSensorData.bind(this))
    .then(this._bindSensorsToRooms.bind(this))
    .then(this._updateRoomColors.bind(this))
    .catch((error) => console.log('Error:', error));
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
    floorPlan.sensorData = [];
    floorPlan.translate = [0,0];
    floorPlan.scale = 1;

    let svg: any = d3.select(floorPlan.svg);

    Polymer.dom(this.root).appendChild(svg.node());

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

  _fetchSensorData(floorPlan: FloorPlan): Promise<FloorPlan> {
    let request: any = document.createElement('omi-message');
    let rooms = floorPlan.rooms.map((room) => {
      return `
        <Object>
          <id>${room.id}</id>
        </Object>`;
    });

    return request.send('read', `
      <Object>
        <id>${this.building}</id>
        ${rooms.join('\n')}
      </Object>`
    ).then((data) => {
      floorPlan.sensorData = data[0].childObjects;
      return floorPlan;
    });
  },

  _bindSensorsToRooms(floorPlan: FloorPlan): FloorPlan {
    d3.select(floorPlan.svg)
      .selectAll('[data-room-id]')
      .datum(function() {
        let datum = d3.select(this).datum();

        if (datum) {
          return datum;
        }

        let id = d3.select(this).attr('data-room-id');
        let room = floorPlan.sensorData.filter((object) => object.id === id);

        if (room.length) {
          return room[0];
        } else {
          return {
            id: id,
            infoItems: [],
            childObjects: []
          };
        }
      });

    return floorPlan;
  },

  _updateRoomColors(floorPlan: FloorPlan): void {
    d3.select(floorPlan.svg)
      .selectAll('[data-room-id]')
      .style('fill', (datum: OmiObject) => {
        let sensor = datum.infoItems[0];
        if (sensor) {
          return this.$.utilities
            .computeColor(sensor.name, sensor.values[0].value);
        } else {
          return null;
        }
      })
      .style('fill-opacity', (datum) => {
        let sensor = datum.infoItems[0];
        if (sensor) {
          return this.$.utilities
            .computeOpacity(sensor.name, sensor.values[0].value);
        } else {
          return null;
        }
      });
  }
});
