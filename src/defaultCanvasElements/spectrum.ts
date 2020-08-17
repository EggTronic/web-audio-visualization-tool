import CanvasElement from './index';
import {
  CanvasElementProps,
  AudioInfo
} from '../types/canvasElement';

export interface SpectrumOption {
  barWidth?: number;
  barHeight?: number;
  barSpace?: number;
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

class Spectrum extends CanvasElement {
  barSpace: number;
  barWidth: number;
  barHeight: number;
  color: string;
  progress: { on: boolean; reverse: boolean };
  speed: number;
  beat: { strength: number; frequencySource: number };
  constructor({
    xoffset = 0,
    yoffset = 0,
    opacity = 1,
    barWidth = 10,
    barHeight = 20,
    barSpace = 10,
    color = '#fff',
    progress = {
      on: false,
      reverse: false,
    },
    speed = 0,
    beat = {
      strength: 0,
      frequencySource: 1 // 1...256
    }

  }: SpectrumOption & CanvasElementProps) {
    super(xoffset, yoffset, opacity);
    this.barWidth = barWidth;
    this.barHeight = barHeight;
    this.barSpace = barSpace;
    this.color = color;
    this.progress = progress;
    this.speed = speed;
    this.beat = beat;
  }


  render(
    ctx: CanvasRenderingContext2D,
    audioInfo: AudioInfo,
    frequencyData: Uint8Array
  ) {
    let x = ctx.canvas.width / 2 + this.xoffset;
    let y = ctx.canvas.height / 2 + this.yoffset;

    let radius = 140;
    let maxBarNum = Math.floor((radius * 2 * Math.PI) / (this.barWidth + this.barSpace));
    let slicedPercent = Math.floor((maxBarNum * 25) / 100);
    let barNum = maxBarNum - slicedPercent;
    let freqJump = Math.floor(frequencyData.length / maxBarNum);

    for (let i = 0; i < barNum; i++) {
      let amplitude = audioInfo.paused ? frequencyData[i * freqJump] : frequencyData[i * freqJump] / 1;

      // rotate angle offset
      let alfa = (i * 2 * Math.PI) / maxBarNum;
      let beta = (3 * 45 - this.barWidth) * Math.PI / 180;

      let cx = 0;
      let cy = radius - (amplitude / 12 - this.barHeight);
      let w = this.barWidth;
      let h = amplitude / 6 + this.barHeight;

      ctx.save();
      ctx.translate(x + this.barSpace - 10, y + this.barSpace);
      ctx.rotate(alfa - beta);
      ctx.fillRect(cx, cy, w, h);
      ctx.restore();
    }
  }

  renderStatic(canvasCtx: CanvasElement): void {
  }
}

export default Spectrum;