export default class Ripple {
  constructor(options = {}) {
    const defaultOptions = {
      size: 250,
      radius: 80,
      radiusGrow: 1,
      interval: [500, 1500],
      width: 11,
      color: '#fff',
      opacity: 0.7
    };

    this.options = Object.assign(defaultOptions, options);
    this.rate = 4.2;  // frame per seconds
    this.lastripple = 0;
    this.minInterval = 400;
    this.rippleLines = [];  // store array of ripple radius
    this.rippleLines.push({
      r: this.options.radius + this.options.width / 2,
      color: this.options.color,
      o: this.options.opacity,
      w: this.options.width
    });
  }

  _strokeRipple(avCtx) {
    // remove ripples that goes out of the container
    if (this.rippleLines[0] && this.rippleLines[0].r > this.options.size) {
      this.rippleLines.shift();
    }

    // create new ripple
    if (this.rate - this.lastripple >= this.minInterval) {
      this.rippleLines.push({
        r: this.options.radius + this.options.width / 2,
        color: this.options.color,
        o: this.options.opacity,
        w: this.options.width
      });

      // update time
      this.lastripple = this.rate;
    }

    // calculate next ripple
    this.rippleLines = this.rippleLines.map((line, index) => {
      line.r += this.options.radiusGrow * line.o;
      line.o = (this.options.size - line.r + 1)/(this.options.size - this.options.radius);
      line.w = this.options.width * line.o;
      return line;
    })

    this._strokeRippleLine(avCtx);

    // this will be replaced to based on BPM
    this.rate += 2.2; 
  }

  _strokeRippleLine(avCtx) {
    this.rippleLines.forEach(line => {
      let cx = avCtx.canvas.width / 2;
      let cy = avCtx.canvas.height / 2;

      avCtx.canvasCtx.beginPath();
      avCtx.canvasCtx.arc(cx, cy, line.r, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      avCtx.canvasCtx.strokeStyle = line.color;
      avCtx.canvasCtx.lineWidth = line.w;
      avCtx.canvasCtx.globalAlpha = line.o;
      avCtx.canvasCtx.stroke();
      avCtx.canvasCtx.closePath();
      avCtx.canvasCtx.globalAlpha = 1;
    })
  }

  render() {
    return this._strokeRipple.bind(this);
  }
}