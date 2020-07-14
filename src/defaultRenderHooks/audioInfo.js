/**
 * @description
 * Render audio author and title.
 */
export const renderInfo = (avCtx) => {
  let cx = avCtx.canvas.width / 2;
  let cy = avCtx.canvas.height / 2;
  let correction = 0;

  avCtx.canvasStaticCtx.textBaseline = 'top';
  avCtx.canvasStaticCtx.fillStyle = avCtx.theme.barColor;
  avCtx.canvasStaticCtx.fillText('by ' + avCtx.author, cx + correction, cy);
  avCtx.canvasStaticCtx.font = parseInt(avCtx.theme.font[0], 10) + 8 + 'px ' + avCtx.theme.font[1];
  avCtx.canvasStaticCtx.textBaseline = 'bottom';
  avCtx.canvasStaticCtx.fillText(avCtx.title, cx + correction, cy);
  avCtx.canvasStaticCtx.font = avCtx.theme.font.join(' ');
};
