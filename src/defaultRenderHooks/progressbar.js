/**
 * @description
 * Render the shadow of progressbar.
 */
export const renderProgressbarShadow = (avCtx) => {
  let cx = avCtx.canvasStatic.width / 2;
  let cy = avCtx.canvasStatic.height / 2;
  let correction = 0;

  avCtx.canvasStaticCtx.strokeStyle = avCtx.theme.barColor;
  avCtx.canvasStaticCtx.lineWidth = '10';

  avCtx.canvasStaticCtx.beginPath();
  avCtx.canvasStaticCtx.arc(cx + correction, cy, 100, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
  avCtx.canvasStaticCtx.globalAlpha = 0.1;
  avCtx.canvasStaticCtx.stroke();
  avCtx.canvasStaticCtx.closePath();
  avCtx.canvasStaticCtx.globalAlpha = 1;
}

/**
 * @description
 * Render progressbar.
 */
export const renderProgressbar = (avCtx) => {
  const renderer = (avCtx) => {
    let cx = avCtx.canvas.width / 2;
    let cy = avCtx.canvas.height / 2;
    let correction = 0;

    let arcPercent;
    arcPercent = avCtx.audio.currentTime / avCtx.audio.duration;
    let drift = (arcPercent * Math.PI) % (1.5 * Math.PI) * 10

    avCtx.canvasCtx.strokeStyle = avCtx.theme.barColor;
    
    avCtx.canvasCtx.beginPath();
    avCtx.canvasCtx.lineWidth = '10';
    avCtx.canvasCtx.arc(cx + correction, cy, 95, 0.5 * Math.PI + drift * 2, 0.5 * Math.PI + arcPercent * 2 * Math.PI + drift * 2);
    avCtx.canvasCtx.stroke();
    avCtx.canvasCtx.closePath();

    avCtx.canvasCtx.beginPath();
    avCtx.canvasCtx.lineWidth = '3';
    avCtx.canvasCtx.arc(cx + correction, cy, 85, 0.5 * Math.PI - drift, 0.5 * Math.PI - arcPercent * 2 * Math.PI - drift);
    avCtx.canvasCtx.stroke();
    avCtx.canvasCtx.closePath();
  }

  renderer(avCtx);
};