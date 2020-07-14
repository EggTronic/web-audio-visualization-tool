/**
 * @description
 * init main canvas style
 */
export const setCanvasStyle = (avCtx) => {
  avCtx.theme.gradient = avCtx.canvasCtx.createLinearGradient(0, 0, 0, 300);
  // avCtx.theme.gradient.addColorStop(1, avCtx.theme.barColor);
  avCtx.theme.gradient.addColorStop(1, avCtx.theme.barColor);
  avCtx.canvasCtx.fillStyle = avCtx.theme.gradient;
  avCtx.canvasCtx.font = avCtx.theme.font.join(' ');
  avCtx.canvasCtx.textAlign = 'center';
}

/**
 * @description
 * init static canvas style
 */
export const setStaticCanvasStyle = (avCtx) => {
  avCtx.theme.gradient = avCtx.canvasStaticCtx.createLinearGradient(0, 0, 0, 300);
  avCtx.theme.gradient.addColorStop(1, avCtx.theme.barColor);
  avCtx.canvasStaticCtx.fillStyle = avCtx.theme.gradient;
  avCtx.canvasStaticCtx.shadowBlur = avCtx.theme.shadowBlur;
  avCtx.canvasStaticCtx.shadowColor = avCtx.theme.shadowColor;
  avCtx.canvasStaticCtx.font = avCtx.theme.font.join(' ');
  avCtx.canvasStaticCtx.textAlign = 'center';
}