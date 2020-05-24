/**
 * @description
 * Render the shadow of seek bar.
 */
export const renderSeekBarShadow = (avCtx) => {
  let width = 400;
  let height = 20;

  let cxStart = avCtx.canvasStatic.width / 2 - width / 2;
  let cyStart = 3 * avCtx.canvasStatic.height / 4 + 100;

  avCtx.canvasStaticCtx.beginPath();
  avCtx.canvasStaticCtx.globalAlpha = 0.1;
  avCtx.canvasStaticCtx.fillRect(cxStart, cyStart, width, height);
  avCtx.canvasStaticCtx.stroke();
  avCtx.canvasStaticCtx.closePath();
  avCtx.canvasStaticCtx.globalAlpha = 1;
}

/**
 * @description
 * Render seek bar.
 */
export const renderSeekBar = (avCtx) => {
  let width = 400;
  let height = 20;
  let btnWidth = 5;
  let btnHeight = 4;

  let cxStart = avCtx.canvas.width / 2 - width / 2;
  let cyStart = 3 * avCtx.canvas.height / 4 + 100;

  avCtx.canvasCtx.beginPath();
  avCtx.canvasCtx.fillRect(cxStart, cyStart, width * avCtx.audio.currentTime / avCtx.audio.duration, height);
  avCtx.canvasCtx.stroke();
  avCtx.canvasCtx.closePath();

  avCtx.canvasCtx.beginPath();
  avCtx.canvasCtx.globalAlpha = 0.3;
  avCtx.canvasCtx.fillStyle = "black";
  avCtx.canvasCtx.fillRect(cxStart + width * avCtx.audio.currentTime / avCtx.audio.duration, cyStart - btnHeight / 2, btnWidth, height + btnHeight);
  avCtx.canvasCtx.stroke();
  avCtx.canvasCtx.fillStyle = avCtx.theme.barColor;
  avCtx.canvasCtx.globalAlpha = 1;
  avCtx.canvasCtx.closePath();
}

/**
 * @description
 * bind seek bar event to mouse.
 */
export const bindSeekBarEvent = (avCtx) => {
  let width = 400;
  let height = 20;

  let cxStart = avCtx.canvasStatic.width / 2 - width / 2;
  let cyStart = 3 * avCtx.canvasStatic.height / 4 + 100;

  let barBox = new Path2D();
  barBox.rect(cxStart, cyStart, width, height);

  avCtx.canvas.addEventListener('click', (e) => {
    if (avCtx.canvasCtx.isPointInPath(barBox, e.offsetX, e.offsetY)) {
      e.stopPropagation();
      avCtx.audio.currentTime = avCtx.audio.duration * ((e.offsetX - cxStart) / width);
      if (!avCtx.isPlaying) {
        if (avCtx.isLoading) {
          return;
        }
        avCtx.playSound();
      }
    }
  });

  let t = null;
  avCtx.canvas.addEventListener('mousemove', (e) => {
    if (t === null) {
      t = setTimeout(() => {
        if (avCtx.canvasCtx.isPointInPath(barBox, e.offsetX, e.offsetY)) {
          e.stopPropagation();
          avCtx.canvas.style.cursor = "pointer";
        } else {
          avCtx.canvas.style.cursor = "";
        }
        t = null;
      }, 16);
    }
  });
}
