Polymer({
  is: 'floor-plan',

  properties: {
    building: Object,
    floor: Number,
    floorPlan: {
      type: Object,
      computed: '_getFloorPlan(building, floor)'
    }
  },

  _getFloorPlan(building: Building, floor: number): Promise<FloorPlan> {
    let floorPlan: FloorPlan;

    for (let i = 0; i < building.floorPlans.length; i++) {
      if (building.floorPlans[i].floor === floor) {
        floorPlan = building.floorPlans[i];
        break;
      }
    }

    return new Promise((resolve, reject) => {
      d3.xml(`assets/buildings/${this.building.id}/${floorPlan.url}`,
        'image/svg+xml', (xml: Document) => {
          if (xml) {
            floorPlan.svg = xml.documentElement;
            resolve(floorPlan);
          } else {
            reject('Error: Could not fetch floorplan');
          }
        })
    });
  }
});
