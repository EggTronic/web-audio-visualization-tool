export default class Spectrum {
  constructor(options = {}) {
    const defaultOptions = {
      xoffset: 0,
      yoffset: 0,
      lineWidth: 10,
      barSpace: 10,
      type: {
        shape: "circle",
        radius: 140,
      },
      color: '#fff',
      opacity: 1,
    };
    this.options = Object.assign(defaultOptions, options);
  }

  _strokeSpectrum(avCtx) {
    let x = avCtx.canvas.width / 2 + this.options.xoffset;
    let y = avCtx.canvas.height / 2 + this.options.yoffset;

    let radius = 140;
    let maxBarNum = Math.floor((radius * 2 * Math.PI) / (avCtx.theme.barWidth + avCtx.theme.barSpacing));
    let slicedPercent = Math.floor((maxBarNum * 25) / 100);
    let barNum = maxBarNum - slicedPercent;
    let freqJump = Math.floor(avCtx.frequencyData.length / maxBarNum);

    for (let i = 0; i < barNum; i++) {
      let amplitude = avCtx.isPlaying ? avCtx.frequencyData[i * freqJump] : avCtx.frequencyData[i * freqJump] / portion;
      let alfa = (i * 2 * Math.PI) / maxBarNum;
      let beta = (3 * 45 - avCtx.theme.barWidth) * Math.PI / 180;
      let cx = 0;
      let cy = radius - (amplitude / 12 - avCtx.theme.barHeight);
      let w = this.options.barWidth;
      let h = amplitude / 6 + avCtx.theme.barHeight;

      avCtx.canvasCtx.save();
      avCtx.canvasCtx.translate(x + avCtx.theme.barSpacing - 10, y + avCtx.theme.barSpacing);
      avCtx.canvasCtx.rotate(alfa - beta);
      avCtx.canvasCtx.fillRect(cx, cy, w, h);
      avCtx.canvasCtx.restore();
    }
  }

  render() {
    return this._strokeSpectrum.bind(this);
  }
}