export default class ProgressCircle {
  constructor(options = {}) {
    const defaultOptions = {
      xoffset: 0,
      yoffset: 0,
      radius: 80,
      width: 11,
      color: '#fff',
      opacity: 0.7,
      shadowColor: '#fff',
      shadowOpacity: 0.3
    };
    this.options = Object.assign(defaultOptions, options);
  }

  _strokeCircleShadow(avCtx) {
    let cx = avCtx.canvasStatic.width / 2;
    let cy = avCtx.canvasStatic.height / 2;

    avCtx.canvasStaticCtx.strokeStyle = avCtx.theme.barColor;
    avCtx.canvasStaticCtx.lineWidth = '10';

    avCtx.canvasStaticCtx.beginPath();
    avCtx.canvasStaticCtx.arc(cx, cy, 100, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
    avCtx.canvasStaticCtx.globalAlpha = 0.1;
    avCtx.canvasStaticCtx.stroke();
    avCtx.canvasStaticCtx.closePath();
    avCtx.canvasStaticCtx.globalAlpha = 1;
  }

  _strokeCircleLine(avCtx) {
    let cx = avCtx.canvas.width / 2;
    let cy = avCtx.canvas.height / 2;

    let arcPercent = avCtx.audio.currentTime / avCtx.audio.duration;
    let drift = (arcPercent * Math.PI) % (1.5 * Math.PI) * 10

    avCtx.canvasCtx.strokeStyle = avCtx.theme.barColor;
    
    avCtx.canvasCtx.beginPath();
    avCtx.canvasCtx.lineWidth = '3';
    avCtx.canvasCtx.arc(cx, cy, 85, 0.5 * Math.PI - drift, 0.5 * Math.PI - arcPercent * 2 * Math.PI - drift);
    avCtx.canvasCtx.stroke();
    avCtx.canvasCtx.closePath();
  }

  _strokeCircle(avCtx) {
    this._strokeCircleShadow(avCtx);
    this._strokeCircleLine(avCtx);
  }

  render() {
    return this._strokeCircle.bind(this);
  }
}