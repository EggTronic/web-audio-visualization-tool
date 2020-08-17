import CanvasElement from './index';
import {
  CanvasElementProps,
  AudioInfo
} from '../types/canvasElement';

export interface RippleOption {
  size: number;
  radius: number;
  width: number;
  radiusGrow?: number;
  minInterval?: number;
  color?: string;
  initRate?: number;
  rateStep?: number;
}

class Ripple extends CanvasElement {
  size: number;
  radius: number;
  width: number;
  radiusGrow?: number;
  minInterval?: number;
  color?: string;
  rate?: number;
  rateStep?: number;
  lastripple: number;
  rippleLines: [];
  constructor({
    size,
    radius,
    width,
    radiusGrow = 1,
    minInterval = 400,
    color = '#fff',
    initRate = 4,
    rateStep = 2
  }: RippleOption & CanvasElementProps) {
    super(xoffset, yoffset, opacity);
    const defaultOptions = {
      size: 250,
      radius: 80,
      width: 11,
      radiusGrow: 1,
      minInterval: 400,
      color: '#fff',
      initRate: 4,
      rateStep: 2 // step to increase for each frame
    };

    this.size = size;
    this.radius = radius;
    this.width = width;
    this.radiusGrow = radiusGrow;
    this.minInterval = minInterval;
    this.color = color;
    this.rate = initRate;
    this.rateStep = rateStep;
    
    this.lastripple = 0;
    this.rippleLines = [];  // store array of ripple radius
    this.rippleLines.push({
      r: this.radius + this.width / 2,
      c: this.color,
      o: this.opacity,
      w: this.width
    });
  }

  _strokeRipple(avCtx) {
    // remove ripples that goes out of the container
    if (this.rippleLines[0] && this.rippleLines[0].r > this.size) {
      this.rippleLines.shift();
    }

    // create new ripple
    if (this.rate - this.lastripple >= this.options.minInterval) {
      this.rippleLines.push({
        r: this.options.radius + this.options.width / 2,
        c: this.options.color,
        o: this.options.opacity,
        w: this.options.width
      });

      // update time
      this.lastripple = this.rate;
    }

    // calculate next ripple
    this.rippleLines = this.rippleLines.map((line) => {
      line.r += this.options.radiusGrow * line.o;
      line.o = (this.options.size - line.r + 1) / (this.options.size - this.options.radius);
      line.w = this.options.width * line.o;
      line.c = this.options.color;
      return line;
    })

    this._strokeRippleLine(avCtx);

    this.rate += this.options.rateStep;
  }

  _strokeRippleLine(avCtx) {
    this.rippleLines.forEach(line => {
      let cx = avCtx.canvas.width / 2;
      let cy = avCtx.canvas.height / 2;

      avCtx.canvasCtx.beginPath();
      avCtx.canvasCtx.arc(cx, cy, line.r, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      avCtx.canvasCtx.strokeStyle = line.c;
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

export default Ripple;