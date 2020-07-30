export default class Ring {
  constructor(options = {}) {
    const defaultOptions = {
      xoffset: 0,
      yoffset: 0,
      radius: 80,
      width: 10,
      color: '#fff',
      opacity: 1,
      progress: {
        on: false,
        reverse: false,
      },
      speed: 0,
      beat: {
        strength: 0,
        frequencySource: 9 // 1...256
      }
    };
    this.options = Object.assign(defaultOptions, options);
  }

  _strokeCircleLine(avCtx) {
    let x = avCtx.canvas.width / 2 + this.options.xoffset;
    let y = avCtx.canvas.height / 2 + this.options.yoffset;

    let arcPercent = avCtx.audio.currentTime / avCtx.audio.duration;
    let drift = (arcPercent * Math.PI) % (1.5 * Math.PI) * this.options.speed;
    let radius = this.options.radius
      + (avCtx.frequencyData[this.options.beat.frequencySource] / 256)
      * this.options.beat.strength;

    let start = this.options.progress.on
      ? this.options.progress.reverse
        ? 0.5 * Math.PI + (- drift) 
        : 0.5 * Math.PI + drift
      : 0.5 * Math.PI;
    let end = this.options.progress.on
      ? this.options.progress.reverse
          ? 0.5 * Math.PI - drift - (1 - arcPercent) * 2 * Math.PI
          : 0.5 * Math.PI + drift - arcPercent * 2 * Math.PI
      : 2.5 * Math.PI;
    avCtx.canvasCtx.strokeStyle = this.options.color;
    avCtx.canvasCtx.beginPath();
    avCtx.canvasCtx.lineWidth = this.options.width;
    avCtx.canvasCtx.arc(
      x,
      y,
      radius,
      start,
      end
    );
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