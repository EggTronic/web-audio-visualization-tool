/**
 * @description
 * Render lounge style type.
 */
export const renderLounge = (avCtx) => {
  const renderer = (portion, avCtx) => {
    let cx = avCtx.canvas.width / 2;
    let cy = avCtx.canvas.height / 2;
    let radius = 140;
    let maxBarNum = Math.floor((radius * 2 * Math.PI) / (avCtx.theme.barWidth + avCtx.theme.barSpacing));
    let slicedPercent = Math.floor((maxBarNum * 25) / 100);
    let barNum = maxBarNum - slicedPercent;
    let freqJump = Math.floor(avCtx.frequencyData.length / maxBarNum);
    if (portion > 1) {
      avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
    }
    for (let i = 0; i < barNum; i++) {
      let amplitude = avCtx.isPlaying ? avCtx.frequencyData[i * freqJump] : avCtx.frequencyData[i * freqJump]/portion;
      let alfa = (i * 2 * Math.PI) / maxBarNum;
      let beta = (3 * 45 - avCtx.theme.barWidth) * Math.PI / 180;
      let x = 0;
      let y = radius - (amplitude / 12 - avCtx.theme.barHeight);
      let w = avCtx.theme.barWidth;
      let h = amplitude / 6 + avCtx.theme.barHeight;
  
      avCtx.canvasCtx.save();
      avCtx.canvasCtx.translate(cx + avCtx.theme.barSpacing, cy + avCtx.theme.barSpacing);
      avCtx.canvasCtx.rotate(alfa - beta);
      avCtx.canvasCtx.fillRect(x, y, w, h);
      avCtx.canvasCtx.restore();
    }
  }

  if (!avCtx.isPlaying) {
    for (let i = 2; i <= 100; i+=2) {
      setTimeout(
        function () {
          renderer(i, avCtx);
          avCtx._executeHook(avCtx.afterPauseHook);
        }
      , i*5)
    }
  } else {
    setTimeout(
      function () {
        avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
        renderer(1, avCtx);
        avCtx._executeHook(avCtx.afterPauseHook);
      }
    , 0)
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
  //console.log(avCtx);
  const renderer = (avCtx) => {
    let cx = avCtx.canvas.width / 2;
    let cy = avCtx.canvas.height / 2;
    let correction = 10;

    let arcPercent;
    avCtx.canvasCtx.strokeStyle = avCtx.theme.barColor;
    avCtx.canvasCtx.lineWidth = '10';

    arcPercent = avCtx.audio.currentTime / avCtx.audio.duration;
    avCtx.canvasCtx.beginPath();
    avCtx.canvasCtx.arc(cx + correction, cy, 100, 0.5 * Math.PI, 0.5 * Math.PI + arcPercent * 2 * Math.PI);
    avCtx.canvasCtx.stroke();
    avCtx.canvasCtx.closePath();
  }

  renderer(avCtx);
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
  avCtx.canvasStaticCtx.font = parseInt(avCtx.theme.font[0], 10) + 8 + 'px ' + avCtx.theme.font[1];
  avCtx.canvasStaticCtx.textBaseline = 'bottom';
  avCtx.canvasStaticCtx.fillText(avCtx.title, cx + correction, cy);
  avCtx.canvasStaticCtx.font = avCtx.theme.font.join(' ');
};

/**
 * @description
 * Render audio time.
 */
export const renderTime = (avCtx) => {
  const renderer = (avCtx) => {
    let time = avCtx.minutes + ':' + avCtx.seconds;
    avCtx.canvasCtx.fillText(time, avCtx.canvas.width / 2 + 10, avCtx.canvas.height / 2 + 40);
  }
    
  renderer(avCtx);
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
      avCtx.canvasStaticCtx.drawImage(img, 0, 0);
      avCtx.canvasStaticCtx.globalAlpha = 1;
    });
};

/**
 * @description
 * Render loading.
 */
export const renderLoading = (avCtx) => {
  const renderer = (avCtx) => {
    avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
    avCtx.canvasCtx.fillText('Loading...', avCtx.canvas.width / 2 + 10, avCtx.canvas.height / 2 + 50);
  }
  
  return new Promise((reslove, reject) => {
    renderer(avCtx)
    reslove();
  })
}

/**
 * @description
 * Render loading.
 */
export const renderPlayButton = (avCtx) => {
  avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
  avCtx.canvasCtx.fillText('Play', avCtx.canvas.width / 2 + 10, avCtx.canvas.height / 2 + 50);

  document.addEventListener('click', (e) => {
    if (e.target === avCtx.canvas) {
      e.stopPropagation();
      if (!avCtx.isPlaying) {
        if (avCtx.isLoading) {
          return;
        }
        return (avCtx.audio.paused) ? avCtx.playSound() : avCtx.loadSound();
      } else {
        return avCtx.pauseSound();
      }
    }
  });
}

/**
 * @description
 * init main canvas style
 */
export const setCanvasStyle = (avCtx) => {
  avCtx.theme.gradient = avCtx.canvasCtx.createLinearGradient(0, 0, 0, 300);
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


