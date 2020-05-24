/**
 * @description
 * Render Play.
 */
export const renderPlayControl = (avCtx) => {
  let text = avCtx.isPlaying ? "Pause" : avCtx.isLoading ? "Loading" : "Play";
  avCtx.canvasCtx.clearRect(avCtx.canvas.width / 2 - 20, avCtx.canvas.height / 2 + 60, 40, 20);
  avCtx.canvasCtx.fillText(text, avCtx.canvas.width / 2, avCtx.canvas.height / 2 + 60);
}

/**
 * @description
 * Bind Play Event.
 */
export const bindPlayControlEvent = (avCtx) => {
  let cx = avCtx.canvas.width / 2;
  let cy = avCtx.canvas.height / 2;
  const arcBox = new Path2D();

  arcBox.arc(cx, cy, 90, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);

  avCtx.canvas.onclick = (e) => {
    if (avCtx.canvasCtx.isPointInPath(arcBox, e.offsetX, e.offsetY)) {
      e.stopPropagation();
      if (!avCtx.isPlaying) {
        if (avCtx.isLoading) {
          return;
        }
        avCtx.audio.paused ? avCtx.playSound() : avCtx.loadSound();
      } else {
        avCtx.pauseSound();
      }
    }
  }

  let t = null;
  avCtx.canvas.addEventListener('mousemove', (e) => {
    if (t === null) {
      t = setTimeout(() => {
        if (avCtx.canvasCtx.isPointInPath(arcBox, e.offsetX, e.offsetY)) {
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