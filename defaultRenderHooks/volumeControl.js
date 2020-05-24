/**
 * @description
 * Render Volume Control Button.
 */

export const renderVolumeBar = (avCtx) => {
  let width = 200
  let height = 10

  let cxStart = avCtx.canvasStatic.width / 2 - width / 2;
  let cyStart = 3 * avCtx.canvasStatic.height / 4 + 135;

  avCtx.canvasStaticCtx.clearRect(cxStart, cyStart, width, height);

  avCtx.canvasStaticCtx.shadowBlur = 0;
  avCtx.canvasStaticCtx.beginPath();
  avCtx.canvasStaticCtx.globalAlpha = 0.1;
  avCtx.canvasStaticCtx.fillRect(cxStart, cyStart, width, height);
  avCtx.canvasStaticCtx.stroke();
  avCtx.canvasStaticCtx.closePath();
  avCtx.canvasStaticCtx.globalAlpha = 1;

  avCtx.canvasStaticCtx.beginPath();
  avCtx.canvasStaticCtx.fillRect(cxStart, cyStart, width * avCtx.audio.volume/1, height);
  avCtx.canvasStaticCtx.stroke();
  avCtx.canvasStaticCtx.fillStyle = avCtx.theme.barColor
  avCtx.canvasStaticCtx.closePath();
  avCtx.canvasStaticCtx.globalAlpha = 1;
  avCtx.canvasStaticCtx.shadowBlur = avCtx.theme.shadowBlur;
}

/**
 * @description
 * bind volume bar event to mouse.
 */
export const bindVolumeBarEvent = (avCtx) => {
  avCtx.canvas.addEventListener('click', (e) => {
    let width = 200
    let height = 10

    let cxStart = avCtx.canvasStatic.width / 2 - width / 2;
    let cyStart = 3 * avCtx.canvasStatic.height / 4 + 135;

    let barBox = new Path2D();
    barBox.rect(cxStart, cyStart, width, height)

    if (avCtx.canvasCtx.isPointInPath(barBox, e.offsetX, e.offsetY)) {
      e.stopPropagation();
      avCtx.setVolume(1 * ((e.offsetX - cxStart) / width));
    }
  });
}
