export default class AudioVisualizer {
  constructor(cfg) {
    this.beforeInitHook = cfg.beforeInitHook || [],
    this.afterInitHook = cfg.afterInitHook || [],
    this.beforeLoadAudioHook = cfg.beforeLoadAudioHook || [],
    this.afterLoadAudioHook = cfg.afterLoadAudioHook || [],
    this.beforeStartHook = cfg.beforeStartHook || [],
    this.afterStartHook = cfg.afterStartHook || [],
    this.beforePauseHook = cfg.beforePauseHook || [],
    this.afterPauseHook = cfg.afterPauseHook || [],
    this.beforeResumeHook = cfg.beforeResumeHook || [],
    this.afterResumeHook = cfg.afterResumeHook || [],
    this.onFrameHook = cfg.onFrameHook || [];
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
    }
  }

  init = () => {
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
      }
    );
  }

  /**
   * @description
   * Set current audio context.
   *
   */
  _setContext = () => {
    try {
      window.AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new window.AudioContext();
    } catch (e) {
      console.info('Web Audio API is not supported.', e);
    }
  };

  /**
   * @description
   * Set buffer analyser.
   *
   */
  _setAnalyser = () => {
    this.analyser = this.ctx.createAnalyser();
    this.analyser.smoothingTimeConstant = 0.6;
    this.analyser.fftSize = this.fftSize;
  };

  /**
   * @description
   * Set frequency data.
   *
   */
  _setFrequencyData = () => {
    this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
  };

  /**
   * @description
   * Set source buffer and connect processor and analyser.
   *
   */
  _setBufferSourceNode = () => {
    this.audio.loop = this.loop;

    this.sourceNode = this.ctx.createMediaElementSource(this.audio);
    this.sourceNode.connect(this.analyser);
    this.sourceNode.connect(this.ctx.destination);
  };

  /**
   * @description
   * Set current media source url.
   *
   */
  _setMediaSource = () => {
    this.audioSrc = this.audio.getAttribute('src');
  };

  /**
   * @description
   * Bind events.
   *
   */
  _bindEvents = () => {
    this._executeHook(this.onEventHook);
  };

  /**
   * @description
   * Execute hooks before playing sound
   */
  loadSound = () => {
    this.isLoading = true;
    this._executeAsyncHook(this.beforeLoadAudioHook).then(() => {
        this.isLoading = false;
        this._executeHook(this.afterLoadAudioHook);
        if (this.autoplay) {
          this.playSound();
        }
      }
    )
  };

  /**
   * @description
   * Play sound from the given buffer.
   *
   * @param  {Object} buffer
   */
  playSound = (buffer) => {
    if (this.audio.pause) {
      this._executeAsyncHook(this.beforeResumeHook).then(() => {
          this.isLoading = false;
          this.isPlaying = true;
          this.audio.play();
          this._renderFrame();
          this._executeHook(this.afterResumeHook);
        }
      );
    } else {
      this._executeAsyncHook(this.beforeStartHook).then(() => {
          this.loading = false;
          this.isPlaying = true;
          this.sourceNode.disconnect();
          this._setBufferSourceNode();
          // this.sourceNode.buffer = buffer;
          // this.sourceNode.start(0);
          this._resetTimer();
          this._startTimer();
          this._renderFrame();
          this._executeHook(this.afterStartHook);
        }
      );
    }
  };

  /**
   * @description
   * Pause current sound.
   */
  pauseSound = () => {
    this._executeAsyncHook(this.beforePauseHook).then(() => {
        this.audio.pause();
        this.isPlaying = false;
        this._executeHook(this.afterPauseHook);
      }
    );
  };

  /**
   * @description
   * Get volume.
   */
  getVolume = () => {
    return this.audio.volume;
  };

  /**
   * @description
   * Set volume.
   */
  setVolume = (volume) => {
    if(0 <= volume <= 1){
      this.audio.volume = volume;
    } else {
      this.audio.volume = volume < 0 ? 0 : 1
    }
    this._executeHook(this.onVolumeChangeHook);
  }

  /**
   * @description
   * Increase volume.
   */
  increaseVolume = (step) => {
    if (this.audio.volume < 1) {
      this.setVolume(this.audio.volume + step)
    }
  };

  /**
   * @description
   * Decrease volume.
   */
  decreaseVolume = (step) => {
    if (this.audio.volume > 1) {
      this.setVolume(this.audio.volume - step)
    }
  };

  /**
   * @description
   * On audio data stream error fn.
   *
   * @param  {Object} e
   */
  onError = (e) => {
    console.info('Error decoding audio file. -- ', e);
  };

  /**
   * @description
   * On audio data stream ended fn.
   * if loop is true, then audio will never be ended
   */
  _onAudioEnd = () => {
    this._executeHook(this.onEndHook);
  }

  /**
   * @description
   * Render frame on canvas.
   */
  _renderFrame = () => {
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
  };

  /**
   * @description
   * Update time.
   * Format -> mm:ss
   */
  _updateTime = () => {
    // check if audio is ended
    // if loop is true, then audio will never be ended
    if (this.audio.ended) {
      this.isPlaying = false;
    }

    // update time
    let flooredTime = Math.floor(this.audio.currentTime);
    let minutes = Math.floor(flooredTime / 60);
    let seconds = flooredTime % 60;

    this.minutes = minutes < 10 ? "0" + minutes : minutes;
    this.seconds = seconds < 10 ? "0" + seconds : seconds;
  }

  /**
   * @description
   * Render frame on canvas.
   */
  _renderStatic = () => {
    this._executePromiseAllHook(this.beforeStaticHook)
      .then(() => {
        this._executeHook(this.onStaticHook)
      })
      .catch(err => {
        this.onError(err);
      });
  };

  /**
   * @description
   * Executer for hooks
   */
  _executeHook = (hook) => {
    for (let i = 0; i < hook.length; i++) {
      hook[i](this);
    }
  }

  /**
 * @description
 * Executer for async hooks
 */
  _executeAsyncHook = (hook) => {
    if (hook.length > 0) {
      let promise = hook[0](this)
      for (let i = 1; i < hook.length; i++) {
        promise = promise.then(() => hook[i](this));
      }
      return promise;
    } else {
      return Promise.resolve();
    }
  }

  /**
   * @description
   * Executer for promiseAll hooks
   */
  _executePromiseAllHook = (hook) => {
    let promises = [];
    for (let i = 0; i < hook.length; i++) {
      promises.push(hook[i](this));
    }
    return Promise.all(promises)
  }
}

