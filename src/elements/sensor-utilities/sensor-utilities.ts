Polymer({

  is: 'sensor-utilities',

  _sensorTypes: {
    temperature:{
      min: 15,
      max: 35
    },
    co2: {
      min: 350,
      max: 5000
    },
    light: {
      min: 30,
      max: 10000
    },
    pir: {
      min: 0,
      max: 30
    },
    humidity: {
      min: 30,
      max: 70
    }
  },
  _hueStart: 160,
  _hueEnd: 0,
  _opacityStart: 0.3,
  _opacityEnd: 1.0,

  computeColor(sensorName: string, value: number): string {
    let percentage = this._getPercentage(sensorName, value);
    if (percentage === null) {
      return null;
    }

    let hue = this._hueStart + percentage *
      (this._hueEnd - this._hueStart);
    let opacity = this._opacityStart + percentage *
      (this._opacityEnd - this._opacityStart);
    let {r, g, b} = d3.hsl(hue, 1, 0.6).rgb();

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },

  computeOpacity(sensorName: string, value: number): number {
    let percentage = this._getPercentage(sensorName, value);
    if (percentage === null) {
      return null;
    }

    let opacity = this._opacityStart + percentage *
      (this._opacityEnd - this._opacityStart);

    return opacity;
  },

  _getPercentage(sensorName: string, value: number): number {
    if (!sensorName || !value) {
      return null;
    }
    let sensor = this._sensorTypes[sensorName.toLowerCase()];
    if (!sensor) {
      return null;
    }

    let percentage;
    if (sensorName.toLowerCase() === 'pir') {
      percentage = value > 0 ? 1 : 0;
    } else {
      percentage = Math.min((value - sensor.min) /
        (sensor.max - sensor.min), 1);
      percentage = Math.max(percentage, 0);
    }

    return percentage;
  }
});
