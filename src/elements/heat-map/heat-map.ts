Polymer({
  is: 'heat-map',

  properties: {
    building: String,
    buildings: Array,
    floor: String,
    floorPlan: {
      type: Object,
      computed: '_getFloorPlan(building, floor, buildings)'
    }
  },

  _getFloorPlan(building: string,
                floor: string,
                buildings: Building[]) {

    for (let i = 0; i < buildings.length; i++) {
      if (buildings[i].id === building) {
        for (let j = 0; j < buildings[i].floorPlans.length; j++) {
          if (buildings[i].floorPlans[j].floor === Number(floor)) {
            return buildings[i].floorPlans[j];
          }
        }
      }
    }
  }
});
