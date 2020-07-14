/**
 * @description
 * Render lounge style type.
 */
export const renderLounge = (avCtx) => {
  const renderer = (portion, avCtx) => {
    let cx = avCtx.canvas.width / 2;
    let cy = avCtx.canvas.height / 2;
    let radius = 140;
    let maxBarNum = Math.floor((radius * 2 * Math.PI) / (avCtx.theme.barWidth + avCtx.theme.barSpacing));
    let slicedPercent = Math.floor((maxBarNum * 25) / 100);
    let barNum = maxBarNum - slicedPercent;
    let freqJump = Math.floor(avCtx.frequencyData.length / maxBarNum);
    if (portion > 1) {
      avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
    }
    for (let i = 0; i < barNum; i++) {
      let amplitude = avCtx.isPlaying ? avCtx.frequencyData[i * freqJump] : avCtx.frequencyData[i * freqJump] / portion;
      let alfa = (i * 2 * Math.PI) / maxBarNum;
      let beta = (3 * 45 - avCtx.theme.barWidth) * Math.PI / 180;
      let x = 0;
      let y = radius - (amplitude / 12 - avCtx.theme.barHeight);
      let w = avCtx.theme.barWidth;
      let h = amplitude / 6 + avCtx.theme.barHeight;

      avCtx.canvasCtx.save();
      avCtx.canvasCtx.translate(cx + avCtx.theme.barSpacing - 10, cy + avCtx.theme.barSpacing);
      avCtx.canvasCtx.rotate(alfa - beta);
      avCtx.canvasCtx.fillRect(x, y, w, h);
      avCtx.canvasCtx.restore();
    }
  }

  if (!avCtx.isPlaying) {
    for (let i = 2; i <= 100; i += 2) {
      setTimeout(
        function () {
          renderer(i, avCtx);
          avCtx._executeHook(avCtx.afterPauseHook); // mixed the render with after pause renders
        }
        , i * 5)
    }
  } else {
    avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
    renderer(1, avCtx);
    avCtx._executeHook(avCtx.afterPauseHook);
  }
};