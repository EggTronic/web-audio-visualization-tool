import {AudioInfo} from '../types/canvasElement';

class CanvasElement {
  xoffset: number;
  yoffset: number;
  opacity: number;
  constructor(xoffset: number, yoffset: number, opacity: number) {
    this.xoffset = xoffset;
    this.yoffset = yoffset;
    this.opacity = opacity;
  }

  render(
    canvasCtx: CanvasRenderingContext2D, 
    audioInfo: AudioInfo, 
    frequencyData: Uint8Array
  ): void {}

  renderStatic(canvasCtx: CanvasElement): void {}
}

export default CanvasElement;
