/**
 * @description
 * Render audio time.
 */
export const renderTime = (avCtx) => {
  const renderer = (avCtx) => {
    let time = avCtx.minutes + ':' + avCtx.seconds;
    avCtx.canvasCtx.fillText(time, avCtx.canvas.width / 2, avCtx.canvas.height / 2 + 40);
  }

  renderer(avCtx);
};
