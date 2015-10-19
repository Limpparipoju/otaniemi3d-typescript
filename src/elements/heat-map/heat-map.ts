Polymer({
  is: 'heat-map',

  properties: {
    building: String,
    floor: String,
    floorPlan: Object
  },

  _getBuilding(building: string, buildings: Building[]): Building {
    for (let i = 0; i < buildings.length; i++) {
      if (buildings[i].id === building) {
        return buildings[i];
      }
    }
    return null;
  },

  _getFloor(floor: string): number {
    return Number(floor);
  }
});
