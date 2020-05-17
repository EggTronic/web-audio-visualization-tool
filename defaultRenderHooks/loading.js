/**
 * @description
 * Render loading text.
 */
export const renderLoading = (avCtx) => {
  const renderer = (avCtx) => {
    avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
    avCtx.canvasCtx.fillText('Loading...', avCtx.canvas.width / 2 + 5, avCtx.canvas.height / 2 + 50);
  }

  return new Promise((reslove, reject) => {
    renderer(avCtx);
    let interval = setInterval(function () {
      if (avCtx.audio.buffered.end(0) > 0) {
        clearInterval(interval)
        reslove();
      }
    }, 200);

  })
}

/**
 * @description
 * Clear loading text.
 */
export const clearLoading = (avCtx) => {
  avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
}