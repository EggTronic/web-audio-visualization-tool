(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.AudioVisualizeTool = factory());
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  class AudioVisualizer {
    constructor(cfg) {
      _defineProperty(this, "init", () => {
        this._executeAsyncHook(this.beforeInitHook).then(() => {
          this._setContext();

          this._setAnalyser();

          this._setFrequencyData();

          this._setBufferSourceNode();

          this._setMediaSource();

          this._bindEvents();

          this._renderStatic();

          this._executeHook(this.afterInitHook);

          this.loadSound();
        });
      });

      _defineProperty(this, "_setContext", () => {
        try {
          window.AudioContext = window.AudioContext || window.webkitAudioContext;
          this.ctx = new window.AudioContext();
        } catch (e) {
          console.info('Web Audio API is not supported.', e);
        }
      });

      _defineProperty(this, "_setAnalyser", () => {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.6;
        this.analyser.fftSize = this.fftSize;
      });

      _defineProperty(this, "_setFrequencyData", () => {
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
      });

      _defineProperty(this, "_setBufferSourceNode", () => {
        this.audio.loop = this.loop;
        this.sourceNode = this.ctx.createMediaElementSource(this.audio);
        this.sourceNode.connect(this.analyser);
        this.sourceNode.connect(this.ctx.destination);
      });

      _defineProperty(this, "_setMediaSource", () => {
        this.audioSrc = this.audio.getAttribute('src');
      });

      _defineProperty(this, "_bindEvents", () => {
        this._executeHook(this.onEventHook);
      });

      _defineProperty(this, "loadSound", () => {
        this.isLoading = true;

        this._executeAsyncHook(this.beforeLoadAudioHook).then(() => {
          this.isLoading = false;

          this._executeHook(this.afterLoadAudioHook);

          if (this.autoplay) {
            this.playSound();
          }
        });
      });

      _defineProperty(this, "playSound", () => {
        if (this.audio.pause) {
          this._executeAsyncHook(this.beforeResumeHook).then(() => {
            this.isLoading = false;
            this.isPlaying = true;
            this.audio.play();

            this._renderFrame();

            this._executeHook(this.afterResumeHook);
          });
        } else {
          this._executeAsyncHook(this.beforeStartHook).then(() => {
            this.loading = false;
            this.isPlaying = true;
            this.sourceNode.disconnect();

            this._setBufferSourceNode();

            this._resetTimer();

            this._startTimer();

            this._renderFrame();

            this._executeHook(this.afterStartHook);
          });
        }
      });

      _defineProperty(this, "pauseSound", () => {
        this._executeAsyncHook(this.beforePauseHook).then(() => {
          this.audio.pause();
          this.isPlaying = false;

          this._executeHook(this.afterPauseHook);
        });
      });

      _defineProperty(this, "getVolume", () => {
        return this.audio.volume;
      });

      _defineProperty(this, "setVolume", volume => {
        if (0 <= volume <= 1) {
          this.audio.volume = volume;
        } else {
          this.audio.volume = volume < 0 ? 0 : 1;
        }

        this._executeHook(this.onVolumeChangeHook);
      });

      _defineProperty(this, "increaseVolume", step => {
        if (this.audio.volume < 1) {
          this.setVolume(this.audio.volume + step);
        }
      });

      _defineProperty(this, "decreaseVolume", step => {
        if (this.audio.volume > 1) {
          this.setVolume(this.audio.volume - step);
        }
      });

      _defineProperty(this, "onError", e => {
        console.info('Error decoding audio file. -- ', e);
      });

      _defineProperty(this, "_onAudioEnd", () => {
        this._executeHook(this.onEndHook);
      });

      _defineProperty(this, "_renderFrame", () => {
        if (this.isPlaying) {
          // check if there is a specified fps
          if (this.framesPerSecond) {
            // use setTimeout to simulate certain fps rate
            setTimeout(() => {
              requestAnimationFrame(this._renderFrame);
            }, 1000 / this.framesPerSecond);
          } else {
            // render at default fps (depends on device)
            requestAnimationFrame(this._renderFrame);
          }
        }

        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this._updateTime();

        this.analyser.getByteFrequencyData(this.frequencyData);

        this._executeHook(this.onFrameHook);
      });

      _defineProperty(this, "_updateTime", () => {
        // check if audio is ended
        // if loop is true, then audio will never be ended
        if (this.audio.ended) {
          this.isPlaying = false;
        } // update time


        let flooredTime = Math.floor(this.audio.currentTime);
        let minutes = Math.floor(flooredTime / 60);
        let seconds = flooredTime % 60;
        this.minutes = minutes < 10 ? "0" + minutes : minutes;
        this.seconds = seconds < 10 ? "0" + seconds : seconds;
      });

      _defineProperty(this, "_renderStatic", () => {
        this._executePromiseAllHook(this.beforeStaticHook).then(() => {
          this._executeHook(this.onStaticHook);
        }).catch(err => {
          this.onError(err);
        });
      });

      _defineProperty(this, "_executeHook", hook => {
        for (let i = 0; i < hook.length; i++) {
          hook[i](this);
        }
      });

      _defineProperty(this, "_executeAsyncHook", hook => {
        if (hook.length > 0) {
          let promise = hook[0](this);

          for (let i = 1; i < hook.length; i++) {
            promise = promise.then(() => hook[i](this));
          }

          return promise;
        } else {
          return Promise.resolve();
        }
      });

      _defineProperty(this, "_executePromiseAllHook", hook => {
        let promises = [];

        for (let i = 0; i < hook.length; i++) {
          promises.push(hook[i](this));
        }

        return Promise.all(promises);
      });

      this.beforeInitHook = cfg.beforeInitHook || [], this.afterInitHook = cfg.afterInitHook || [], this.beforeLoadAudioHook = cfg.beforeLoadAudioHook || [], this.afterLoadAudioHook = cfg.afterLoadAudioHook || [], this.beforeStartHook = cfg.beforeStartHook || [], this.afterStartHook = cfg.afterStartHook || [], this.beforePauseHook = cfg.beforePauseHook || [], this.afterPauseHook = cfg.afterPauseHook || [], this.beforeResumeHook = cfg.beforeResumeHook || [], this.afterResumeHook = cfg.afterResumeHook || [], this.onFrameHook = cfg.onFrameHook || [];
      this.beforeStaticHook = cfg.beforeStaticHook || [];
      this.onStaticHook = cfg.onStaticHook || [];
      this.onEventHook = cfg.onEventHook || [];
      this.onEndHook = cfg.onEndHook || [];
      this.onVolumeChangeHook = cfg.onVolumeChangeHook || [];
      this.isPlaying = false;
      this.isLoading = false;
      this.autoplay = cfg.autoplay || false;
      this.loop = cfg.loop || false;
      this.audio = document.getElementById(cfg.audio) || {};
      if (this.audio.volume) this.audio.volume = cfg.initVolume;
      this.canvas = document.getElementById(cfg.canvas) || {};
      this.canvasStatic = document.getElementById(cfg.canvasStatic) || {};
      this.canvasCtx = this.canvas.getContext('2d') || null;
      this.canvasStaticCtx = this.canvasStatic.getContext('2d') || null;
      this.customCanvases = cfg.customCanvases || [];
      this.author = this.audio.getAttribute('data-author') || '';
      this.title = this.audio.getAttribute('data-title') || '';
      this.ctx = null;
      this.analyser = null;
      this.fftSize = cfg.fftSize || 512;
      this.framesPerSecond = cfg.framesPerSecond || null;
      this.sourceNode = null;
      this.frequencyData = [];
      this.minutes = "00";
      this.seconds = "00";
      this.theme = cfg.theme || {
        barWidth: 2,
        barHeight: 5,
        barSpacing: 7,
        barColor: '#cafdff',
        shadowBlur: 20,
        shadowColor: '#ffffff',
        font: ['12px', 'Helvetica'],
        gradient: null,
        interval: null
      };
    }

  }

  /**
   * @description
   * init main canvas style
   */
  const setCanvasStyle = avCtx => {
    avCtx.theme.gradient = avCtx.canvasCtx.createLinearGradient(0, 0, 0, 300); // avCtx.theme.gradient.addColorStop(1, avCtx.theme.barColor);

    avCtx.theme.gradient.addColorStop(1, avCtx.theme.barColor);
    avCtx.canvasCtx.fillStyle = avCtx.theme.gradient;
    avCtx.canvasCtx.font = avCtx.theme.font.join(' ');
    avCtx.canvasCtx.textAlign = 'center';
  };
  /**
   * @description
   * init static canvas style
   */

  const setStaticCanvasStyle = avCtx => {
    avCtx.theme.gradient = avCtx.canvasStaticCtx.createLinearGradient(0, 0, 0, 300);
    avCtx.theme.gradient.addColorStop(1, avCtx.theme.barColor);
    avCtx.canvasStaticCtx.fillStyle = avCtx.theme.gradient;
    avCtx.canvasStaticCtx.shadowBlur = avCtx.theme.shadowBlur;
    avCtx.canvasStaticCtx.shadowColor = avCtx.theme.shadowColor;
    avCtx.canvasStaticCtx.font = avCtx.theme.font.join(' ');
    avCtx.canvasStaticCtx.textAlign = 'center';
  };

  /**
   * @description
   * Render audio time.
   */
  const renderTime = avCtx => {
    const renderer = avCtx => {
      let time = avCtx.minutes + ':' + avCtx.seconds;
      avCtx.canvasCtx.fillText(time, avCtx.canvas.width / 2, avCtx.canvas.height / 2 + 40);
    };

    renderer(avCtx);
  };

  /**
   * @description
   * Render audio author and title.
   */
  const renderInfo = avCtx => {
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

  /**
   * @description
   * Render loading text.
   */
  const renderLoading = avCtx => {
    const renderer = avCtx => {
      avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
      avCtx.canvasCtx.fillText('Loading...', avCtx.canvas.width / 2 + 5, avCtx.canvas.height / 2 + 50);
    };

    return new Promise((reslove, reject) => {
      renderer(avCtx);
      let interval = setInterval(function () {
        let timeRanges = avCtx.audio.buffered;

        if (timeRanges && timeRanges.length > 0) {
          clearInterval(interval);
          reslove();
        }
      }, 200);
    });
  };
  /**
   * @description
   * Clear loading text.
   */

  const clearLoading = avCtx => {
    avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
  };

  /**
   * @description
   * Render background image.
   * It returns a promise - for async hook
   */
  const renderBackgroundImg = avCtx => {
    const loadImages = srcs => {
      let promises = [];
      srcs.forEach(src => {
        promises.push(new Promise((resolve, reject) => {
          const img = new Image();
          img.addEventListener("load", () => resolve(img));
          img.addEventListener("error", err => reject(err));
          img.src = src;
        }));
      });
      return promises;
    };

    let srcs = ["https://i.ibb.co/3WHwzQY/ring.png", "https://i.ibb.co/Kzfkqd6/wing.png", "https://i.ibb.co/wMgscY1/volume.png"]; // options for each image
    // [alpha, x, y, width, height]

    let options = [[0.9, 500, 140, 200, 200], [0.6, 0, 360, 1200, 300], [1, 470, 730, 20, 20]];
    return Promise.all(loadImages(srcs)).then(imgs => {
      let cx = avCtx.canvas.width / 2;
      let cy = avCtx.canvas.height / 2;
      avCtx.canvasStaticCtx.beginPath();
      avCtx.canvasStaticCtx.globalAlpha = 0.12;
      avCtx.canvasStaticCtx.fillStyle = "black";
      avCtx.canvasStaticCtx.arc(cx, cy, 380, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      avCtx.canvasStaticCtx.fill();
      avCtx.canvasStaticCtx.closePath();
      avCtx.canvasStaticCtx.beginPath();
      avCtx.canvasStaticCtx.globalAlpha = 0.05;
      avCtx.canvasStaticCtx.fillStyle = "red";
      avCtx.canvasStaticCtx.arc(cx, cy, 280, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      avCtx.canvasStaticCtx.fill();
      avCtx.canvasStaticCtx.closePath();
      avCtx.canvasStaticCtx.beginPath();
      avCtx.canvasStaticCtx.globalAlpha = 0.4;
      avCtx.canvasStaticCtx.fillStyle = "black";
      avCtx.canvasStaticCtx.arc(cx, cy, 90, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
      avCtx.canvasStaticCtx.fill();
      avCtx.canvasStaticCtx.closePath();
      avCtx.canvasStaticCtx.globalAlpha = 1;
      imgs.forEach((img, index) => {
        avCtx.canvasStaticCtx.globalAlpha = options[index][0];
        avCtx.canvasStaticCtx.drawImage(img, options[index][1], options[index][2], options[index][3], options[index][4]);
      });
    }).catch(err => {
      throw Error("failed to load image: " + err);
    });
  };

  /**
   * @description
   * Render lounge style type.
   */
  const renderLounge = avCtx => {
    const renderer = (portion, avCtx) => {
      let cx = avCtx.canvas.width / 2;
      let cy = avCtx.canvas.height / 2;
      let radius = 140;
      let maxBarNum = Math.floor(radius * 2 * Math.PI / (avCtx.theme.barWidth + avCtx.theme.barSpacing));
      let slicedPercent = Math.floor(maxBarNum * 25 / 100);
      let barNum = maxBarNum - slicedPercent;
      let freqJump = Math.floor(avCtx.frequencyData.length / maxBarNum);

      if (portion > 1) {
        avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
      }

      for (let i = 0; i < barNum; i++) {
        let amplitude = avCtx.isPlaying ? avCtx.frequencyData[i * freqJump] : avCtx.frequencyData[i * freqJump] / portion;
        let alfa = i * 2 * Math.PI / maxBarNum;
        let beta = (3 * 45 - avCtx.theme.barWidth) * Math.PI / 180;
        let x = 0;
        let y = radius - (amplitude / 12 - avCtx.theme.barHeight);
        let w = avCtx.theme.barWidth;
        let h = amplitude / 6 + avCtx.theme.barHeight;
        avCtx.canvasCtx.save();
        avCtx.canvasCtx.translate(cx + avCtx.theme.barSpacing - 10, cy + avCtx.theme.barSpacing);
        avCtx.canvasCtx.rotate(alfa - beta);
        avCtx.canvasCtx.fillRect(x, y, w, h);
        avCtx.canvasCtx.restore();
      }
    };

    if (!avCtx.isPlaying) {
      for (let i = 2; i <= 100; i += 2) {
        setTimeout(function () {
          renderer(i, avCtx);

          avCtx._executeHook(avCtx.afterPauseHook); // mixed the render with after pause renders

        }, i * 5);
      }
    } else {
      avCtx.canvasCtx.clearRect(0, 0, avCtx.canvas.width, avCtx.canvas.height);
      renderer(1, avCtx);

      avCtx._executeHook(avCtx.afterPauseHook);
    }
  };

  /**
   * @description
   * Render the shadow of seek bar.
   */
  const renderSeekBarShadow = avCtx => {
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
  };
  /**
   * @description
   * Render seek bar.
   */

  const renderSeekBar = avCtx => {
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
  };
  /**
   * @description
   * bind seek bar event to mouse.
   */

  const bindSeekBarEvent = avCtx => {
    let width = 400;
    let height = 20;
    let cxStart = avCtx.canvasStatic.width / 2 - width / 2;
    let cyStart = 3 * avCtx.canvasStatic.height / 4 + 100;
    let barBox = new Path2D();
    barBox.rect(cxStart, cyStart, width, height);
    avCtx.canvas.addEventListener('click', e => {
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
    avCtx.canvas.addEventListener('mousemove', e => {
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
  };

  /**
   * @description
   * Render Play.
   */
  const renderPlayControl = avCtx => {
    let text = avCtx.isPlaying ? "Pause" : avCtx.isLoading ? "Loading" : "Play";
    avCtx.canvasCtx.clearRect(avCtx.canvas.width / 2 - 20, avCtx.canvas.height / 2 + 60, 40, 20);
    avCtx.canvasCtx.fillText(text, avCtx.canvas.width / 2, avCtx.canvas.height / 2 + 60);
  };
  /**
   * @description
   * Bind Play Event.
   */

  const bindPlayControlEvent = avCtx => {
    let cx = avCtx.canvas.width / 2;
    let cy = avCtx.canvas.height / 2;
    const arcBox = new Path2D();
    arcBox.arc(cx, cy, 90, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);

    avCtx.canvas.onclick = e => {
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
    };

    let t = null;
    avCtx.canvas.addEventListener('mousemove', e => {
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
  };

  /**
   * @description
   * Render Volume Control Button.
   */
  const renderVolumeBar = avCtx => {
    let width = 200;
    let height = 10;
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
    avCtx.canvasStaticCtx.fillRect(cxStart, cyStart, width * avCtx.audio.volume / 1, height);
    avCtx.canvasStaticCtx.stroke();
    avCtx.canvasStaticCtx.fillStyle = avCtx.theme.barColor;
    avCtx.canvasStaticCtx.closePath();
    avCtx.canvasStaticCtx.globalAlpha = 1;
    avCtx.canvasStaticCtx.shadowBlur = avCtx.theme.shadowBlur;
  };
  /**
   * @description
   * bind volume bar event to mouse.
   */

  const bindVolumeBarEvent = avCtx => {
    avCtx.canvas.addEventListener('click', e => {
      let width = 200;
      let height = 10;
      let cxStart = avCtx.canvasStatic.width / 2 - width / 2;
      let cyStart = 3 * avCtx.canvasStatic.height / 4 + 135;
      let barBox = new Path2D();
      barBox.rect(cxStart, cyStart, width, height);

      if (avCtx.canvasCtx.isPointInPath(barBox, e.offsetX, e.offsetY)) {
        e.stopPropagation();
        avCtx.setVolume(1 * ((e.offsetX - cxStart) / width));
      }
    });
  };

  class Ripple {
    constructor(options = {}) {
      const defaultOptions = {
        size: 250,
        radius: 80,
        radiusGrow: 1,
        minInterval: 400,
        width: 11,
        color: '#fff',
        opacity: 0.7,
        initRate: 4,
        rateStep: 2 // step to increase for each frame

      };
      this.options = Object.assign(defaultOptions, options);
      this.rate = this.options.initRate;
      this.lastripple = 0;
      this.rippleLines = []; // store array of ripple radius

      this.rippleLines.push({
        r: this.options.radius + this.options.width / 2,
        color: this.options.color,
        o: this.options.opacity,
        w: this.options.width
      });
    }

    _strokeRipple(avCtx) {
      // remove ripples that goes out of the container
      if (this.rippleLines[0] && this.rippleLines[0].r > this.options.size) {
        this.rippleLines.shift();
      } // create new ripple


      if (this.rate - this.lastripple >= this.options.minInterval) {
        this.rippleLines.push({
          r: this.options.radius + this.options.width / 2,
          c: this.options.color,
          o: this.options.opacity,
          w: this.options.width
        }); // update time

        this.lastripple = this.rate;
      } // calculate next ripple


      this.rippleLines = this.rippleLines.map(line => {
        line.r += this.options.radiusGrow * line.o;
        line.o = (this.options.size - line.r + 1) / (this.options.size - this.options.radius);
        line.w = this.options.width * line.o;
        line.c = this.options.color;
        return line;
      });

      this._strokeRippleLine(avCtx);

      this.rate += this.options.rateStep;
    }

    _strokeRippleLine(avCtx) {
      this.rippleLines.forEach(line => {
        let cx = avCtx.canvas.width / 2;
        let cy = avCtx.canvas.height / 2;
        avCtx.canvasCtx.beginPath();
        avCtx.canvasCtx.arc(cx, cy, line.r, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
        avCtx.canvasCtx.strokeStyle = line.c;
        avCtx.canvasCtx.lineWidth = line.w;
        avCtx.canvasCtx.globalAlpha = line.o;
        avCtx.canvasCtx.stroke();
        avCtx.canvasCtx.closePath();
        avCtx.canvasCtx.globalAlpha = 1;
      });
    }

    render() {
      return this._strokeRipple.bind(this);
    }

  }

  class Ring {
    constructor(options = {}) {
      const defaultOptions = {
        xoffset: 0,
        yoffset: 0,
        radius: 80,
        width: 10,
        color: '#fff',
        opacity: 1,
        progress: {
          on: false,
          reverse: false
        },
        speed: 0,
        beat: {
          strength: 0,
          frequencySource: 9 // 1...256

        }
      };
      this.options = Object.assign(defaultOptions, options);
    }

    _strokeCircleLine(avCtx) {
      let x = avCtx.canvas.width / 2 + this.options.xoffset;
      let y = avCtx.canvas.height / 2 + this.options.yoffset;
      let arcPercent = avCtx.audio.currentTime / avCtx.audio.duration;
      let drift = arcPercent * Math.PI % (1.5 * Math.PI) * this.options.speed;
      let radius = this.options.radius + avCtx.frequencyData[this.options.beat.frequencySource] / 256 * this.options.beat.strength;
      let start = this.options.progress.on ? this.options.progress.reverse ? 0.5 * Math.PI + -drift : 0.5 * Math.PI + drift : 0.5 * Math.PI;
      let end = this.options.progress.on ? this.options.progress.reverse ? 0.5 * Math.PI - drift - (1 - arcPercent) * 2 * Math.PI : 0.5 * Math.PI + drift - arcPercent * 2 * Math.PI : 2.5 * Math.PI;
      avCtx.canvasCtx.strokeStyle = this.options.color;
      avCtx.canvasCtx.beginPath();
      avCtx.canvasCtx.lineWidth = this.options.width;
      avCtx.canvasCtx.arc(x, y, radius, start, end);
      avCtx.canvasCtx.globalAlpha = this.options.opacity;
      avCtx.canvasCtx.stroke();
      avCtx.canvasCtx.closePath();
      avCtx.canvasCtx.globalAlpha = 1;
    }

    _strokeCircle(avCtx) {
      this._strokeCircleLine(avCtx);
    }

    render() {
      return this._strokeCircle.bind(this);
    }

  }

  const defaultInitHooks = {
    setCanvasStyle,
    setStaticCanvasStyle
  };
  const defaultRenderHooks = {
    renderTime,
    renderInfo,
    renderLoading,
    clearLoading,
    renderBackgroundImg,
    renderLounge,
    renderSeekBar,
    renderSeekBarShadow,
    bindSeekBarEvent,
    renderPlayControl,
    bindPlayControlEvent,
    renderVolumeBar,
    bindVolumeBarEvent
  };
  const defaultElements = {
    Ripple,
    Ring
  };
  const AV = {
    AudioVisualizer,
    defaultInitHooks,
    defaultRenderHooks,
    defaultElements
  };

  return AV;

})));
