export default class ProgressCircle {
  constructor(options = {}) {
    const defaultOptions = {
      xoffset: 0,
      yoffset: 0,
      radius: 80,
      width: 10,
      color: '#fff',
      opacity: 1,
      reverse: false,
    };
    this.options = Object.assign(defaultOptions, options);
  }

  _strokeCircleLine(avCtx) {
    let cx = avCtx.canvas.width / 2;
    let cy = avCtx.canvas.height / 2;

    let arcPercent = avCtx.audio.currentTime / avCtx.audio.duration;
    let drift = (arcPercent * Math.PI) % (1.5 * Math.PI) * 10

    avCtx.canvasCtx.strokeStyle = this.options.color;
    
    avCtx.canvasCtx.beginPath();
    avCtx.canvasCtx.lineWidth = '3';
    avCtx.canvasCtx.arc(cx + this.options.xoffset, cy + this.options.yoffset, 85, 0.5 * Math.PI - drift, 0.5 * Math.PI - arcPercent * 2 * Math.PI - drift);
    avCtx.canvasCtx.globalAlpha = this.options.opacity;
    avCtx.canvasCtx.stroke();
    avCtx.canvasCtx.closePath();
    avCtx.canvasCtx.globalAlpha = 1;
  }

  _strokeCircle(avCtx) {
    this._strokeCircleLine(avCtx);
  }

  render() {
    return this._strokeCircle.bind(this);
  }
}