Polymer({
  is: 'floor-plan',

  properties: {
    data: Object
  },

  ready() {
    this.$.floorPlan.onload = (a, b) => {
      console.log(a);
      console.log(b);
    }
  }
});
