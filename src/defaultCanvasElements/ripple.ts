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
    xoffset = 0,
    yoffset = 0,
    opacity = 1,
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

  _strokeRipple(ctx: CanvasRenderingContext2D) {
    // remove ripples that goes out of the container
    if (this.rippleLines[0] && this.rippleLines[0].r > this.size) {
      this.rippleLines.shift();
    }

    // create new ripple
    if (this.rate - this.lastripple >= this.minInterval) {
      this.rippleLines.push({
        r: this.radius + this.width / 2,
        c: this.color,
        o: this.opacity,
        w: this.width
      });

      // update time
      this.lastripple = this.rate;
    }

    // calculate next ripple
    this.rippleLines = this.rippleLines.map((line) => {
      line.r += this.radiusGrow * line.o;
      line.o = (this.size - line.r + 1) / (this.size - this.radius);
      line.w = this.width * line.o;
      line.c = this.color;
      return line;
    })
  }

  _strokeRippleLine(ctx: CanvasRenderingContext2D) {
    this.rippleLines.forEach(line => {
      let cx = ctx.canvas.width / 2;
      let cy = ctx.canvas.height / 2;

      ctx.beginPath();
      ctx.arc(cx, cy, line.r, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      ctx.strokeStyle = line.c;
      ctx.lineWidth = line.w;
      ctx.globalAlpha = line.o;
      ctx.stroke();
      ctx.closePath();
      ctx.globalAlpha = 1;
    })
  }

  render(
    ctx: CanvasRenderingContext2D,
    audioInfo: AudioInfo,
    frequencyData: Uint8Array
  ) {
    this._strokeRipple(ctx);
    this._strokeRippleLine(ctx);
    this.rate += this.rateStep;
  }
}

export default Ripple;