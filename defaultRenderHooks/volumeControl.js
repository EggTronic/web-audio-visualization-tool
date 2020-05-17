/**
 * @description
 * Render Volume Control Button.
 */
export const renderVolumeControl = (avCtx) => {
  let incBtn = '+';
  let decBtn = '-';
  avCtx.canvasStaticCtx.font = "30px Arial";
  avCtx.canvasStaticCtx.fillText(incBtn, avCtx.canvas.width / 2 + 220, avCtx.canvas.height / 2 + 347);
  avCtx.canvasStaticCtx.fillText(decBtn, avCtx.canvas.width / 2 - 220, avCtx.canvas.height / 2 + 347);
  avCtx.canvasStaticCtx.font = avCtx.theme.font.join(' ');
}