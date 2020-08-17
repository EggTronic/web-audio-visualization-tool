import CanvasElement from './index';
import {
  CanvasElementProps,
  AudioInfo
} from '../types/canvasElement';

export interface RingOption {
  radius: number;
  width: number;
  color?: string;
  progress?: {
    on: boolean;
    reverse: boolean;
  };
  speed?: number;
  beat?: {
    strength: number;
    frequencySource: number; // 1...256
  }
}

class Ring extends CanvasElement {
  radius: number;
  width: number;
  color: string;
  progress: {
    on: boolean;
    reverse: boolean;
  };
  speed: number;
  beat: {
    strength: number;
    frequencySource: number;
  }
  constructor({
    xoffset = 0,
    yoffset = 0,
    opacity = 1,
    radius = 80,
    width = 10,
    color = '#fff',
    progress = {
      on: false,
      reverse: false,
    },
    speed = 0,
    beat = {
      strength: 0,
      frequencySource: 9
    } }: RingOption & CanvasElementProps
  ) {
    super(xoffset, yoffset, opacity);
    this.radius = radius;
    this.width = width;
    this.color = color;
    this.progress = progress;
    this.speed = speed;
    this.beat = beat;
  }

  render(
    ctx: CanvasRenderingContext2D,
    audioInfo: AudioInfo,
    frequencyData: Uint8Array
  ): void {
    let x = ctx.canvas.width / 2 + this.xoffset;
    let y = ctx.canvas.height / 2 + this.yoffset;

    let arcPercent = audioInfo.currentTime / audioInfo.duration;
    let drift = (arcPercent * Math.PI) % (1.5 * Math.PI) * this.speed;
    let radius = this.radius
      + (frequencyData[this.beat.frequencySource] / 256)
      * this.beat.strength;

    let start = this.progress.on
      ? this.progress.reverse
        ? 0.5 * Math.PI + (- drift)
        : 0.5 * Math.PI + drift
      : 0.5 * Math.PI;
    let end = this.progress.on
      ? this.progress.reverse
        ? 0.5 * Math.PI - drift - (1 - arcPercent) * 2 * Math.PI
        : 0.5 * Math.PI + drift - arcPercent * 2 * Math.PI
      : 2.5 * Math.PI;
    ctx.strokeStyle = this.color;
    ctx.beginPath();
    ctx.lineWidth = this.width;
    ctx.arc(
      x,
      y,
      radius,
      start,
      end
    );
    ctx.globalAlpha = this.opacity;
    ctx.stroke();
    ctx.closePath();
    ctx.globalAlpha = 1;
  }

  renderStatic(canvasCtx: CanvasElement): void {
  }
}

export default Ring;