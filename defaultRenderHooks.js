/**
 * @description
 * Render lounge style type.
 */
export const renderLounge = (avCtx) => {
  let cx = avCtx.canvas.width / 2;
  let cy = avCtx.canvas.height / 2;
  let radius = 140;
  let maxBarNum = Math.floor((radius * 2 * Math.PI) / (avCtx.barWidth + avCtx.barSpacing));
  let slicedPercent = Math.floor((maxBarNum * 25) / 100);
  let barNum = maxBarNum - slicedPercent;
  let freqJump = Math.floor(avCtx.frequencyData.length / maxBarNum);

  for (let i = 0; i < barNum; i++) {
    let amplitude = avCtx.frequencyData[i * freqJump];
    let alfa = (i * 2 * Math.PI) / maxBarNum;
    let beta = (3 * 45 - avCtx.barWidth) * Math.PI / 180;
    let x = 0;
    let y = radius - (amplitude / 12 - avCtx.barHeight);
    let w = avCtx.barWidth;
    let h = amplitude / 6 + avCtx.barHeight;

    avCtx.canvasCtx.save();
    avCtx.canvasCtx.translate(cx + avCtx.barSpacing, cy + avCtx.barSpacing);
    avCtx.canvasCtx.rotate(alfa - beta);
    avCtx.canvasCtx.fillRect(x, y, w, h);
    avCtx.canvasCtx.restore();
  }
};

/**
 * @description
 * Render the shadow of progressbar.
 */
export const renderProgressbarShadow = (avCtx) => {
  let cx = avCtx.canvas.width / 2;
  let cy = avCtx.canvas.height / 2;
  let correction = 10;

  avCtx.canvasStaticCtx.strokeStyle = avCtx.barColor;
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
  let cx = avCtx.canvas.width / 2;
  let cy = avCtx.canvas.height / 2;
  let correction = 10;
  let curDuration = avCtx.minutes * 60 + parseInt(avCtx.seconds);

  let arcPercent;
  avCtx.canvasCtx.strokeStyle = avCtx.barColor;
  avCtx.canvasCtx.lineWidth = '10';

  if (avCtx.sourceNode.buffer) {
    arcPercent = curDuration / avCtx.sourceNode.buffer.duration;
    if (arcPercent > 1) {
      arcPercent = 1;
    }
    avCtx.canvasCtx.beginPath();
    avCtx.canvasCtx.arc(cx + correction, cy, 100, 0.5 * Math.PI, 0.5 * Math.PI + arcPercent * 2 * Math.PI);
    avCtx.canvasCtx.stroke();
    avCtx.canvasCtx.closePath();
  }
};

/**
 * @description
 * Render audio author and title.
 */
export const renderText = (avCtx) => {
  let cx = avCtx.canvas.width / 2;
  let cy = avCtx.canvas.height / 2;
  let correction = 10;

  avCtx.canvasStaticCtx.textBaseline = 'top';
  avCtx.canvasStaticCtx.fillText('by ' + avCtx.author, cx + correction, cy);
  avCtx.canvasStaticCtx.font = parseInt(avCtx.font[0], 10) + 8 + 'px ' + avCtx.font[1];
  avCtx.canvasStaticCtx.textBaseline = 'bottom';
  avCtx.canvasStaticCtx.fillText(avCtx.title, cx + correction, cy);
  avCtx.canvasStaticCtx.font = avCtx.font.join(' ');
};

/**
 * @description
 * Render audio time.
 */
export const renderTime = (avCtx) => {
  let time = avCtx.minutes + ':' + avCtx.seconds;
  avCtx.canvasCtx.fillText(time, avCtx.canvas.width / 2 + 10, avCtx.canvas.height / 2 + 40);
};

/**
 * @description
 * Render background image.
 * It returns a promise - for async hook
 */
export const renderBackgroundImg = (avCtx) => {
  const loadImage = async (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => resolve(img));
      img.addEventListener("error", err => reject(err));
      img.src = src;
    });
  };

  let src = "https://www.success.com/wp-content/uploads/2017/01/What-Is-Your-Dream-1024x682.jpg";
  return loadImage(src)
    .then(img => {
      avCtx.canvasStaticCtx.globalAlpha = 0.8;
      avCtx.canvasStaticCtx.drawImage(img,0,0);
      avCtx.canvasStaticCtx.globalAlpha = 1;
    });
};

/**
 * @description
 * Render loading.
 */
export const renderLoading = (avCtx) => {
  avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
  avCtx.canvasCtx.fillText('Loading...', avCtx.canvas.width / 2 + 10, avCtx.canvas.height / 2 + 50);
}
