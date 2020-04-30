export default class AudioVisualizer {
  constructor(cfg) {
    this.onInitHook = cfg.onInitHook || [],
      this.onLoadAudioHook = cfg.onLoadAudioHook || [],
      this.onStartHook = cfg.onStartHook || [],
      this.onPauseHook = cfg.onPauseHook || [],
      this.onResumeHook = cfg.onResumeHook || [],
      this.onFrameHook = cfg.onFrameHook || [];
    this.onAsyncStaticHook = cfg.onAsyncStaticHook || [];
    this.onStaticHook = cfg.onStaticHook || [];
    this.onEventHook = cfg.onEventHook || [];
    this.onEndHook = cfg.onEndHook || [];

    this.isPlaying = false;
    this.autoplay = cfg.autoplay || false;
    this.loop = cfg.loop || false;
    this.audio = document.getElementById(cfg.audio) || {};
    this.canvas = document.getElementById(cfg.canvas) || {};
    this.canvasStatic = document.getElementById(cfg.canvasStatic) || {};
    this.canvasCtx = this.canvas.getContext('2d') || null;
    this.canvasStaticCtx = this.canvasStatic.getContext('2d') || null;
    this.author = this.audio.getAttribute('data-author') || '';
    this.title = this.audio.getAttribute('data-title') || '';
    this.ctx = null;
    this.analyser = null;
    this.fftSize = cfg.fftSize || 512;
    this.framesPerSecond = cfg.framesPerSecond || 30;
    this.sourceNode = null;
    this.frequencyData = [];
    this.minutes = "00";
    this.seconds = "00";
    this.barWidth = cfg.barWidth || 2;
    this.barHeight = cfg.barHeight || 2;
    this.barSpacing = cfg.barSpacing || 5;
    this.barColor = cfg.barColor || '#ffffff';
    this.shadowBlur = cfg.shadowBlur || 10;
    this.shadowColor = cfg.shadowColor || '#ffffff';
    this.font = cfg.font || ['12px', 'Helvetica'];
    this.gradient = null;
    this.interval = null;
  }

  init = () => {
    this._setContext();
    this._setAnalyser();
    this._setFrequencyData();
    this._setBufferSourceNode();
    this._setMediaSource();
    this._setCanvasStyles();
    this._setStaticCanvasStyles();
    this._bindEvents();
    this._renderStatic();
    this._executeHook(this.onInitHook);

    if (this.autoplay) {
      this.loadSound();
    }
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
   * Set canvas gradient color.
   *
   */
  _setCanvasStyles = () => {
    this.gradient = this.canvasCtx.createLinearGradient(0, 0, 0, 300);
    this.gradient.addColorStop(1, this.barColor);
    this.canvasCtx.fillStyle = this.gradient;
    this.canvasCtx.font = this.font.join(' ');
    this.canvasCtx.textAlign = 'center';
  };

  /**
   * @description
   * Set static canvas gradient color.
   *
   */
  _setStaticCanvasStyles = () => {
    this.gradient = this.canvasStaticCtx.createLinearGradient(0, 0, 0, 300);
    this.gradient.addColorStop(1, this.barColor);
    this.canvasStaticCtx.fillStyle = this.gradient;
    this.canvasStaticCtx.shadowBlur = this.shadowBlur;
    this.canvasStaticCtx.shadowColor = this.shadowColor;
    this.canvasStaticCtx.font = this.font.join(' ');
    this.canvasStaticCtx.textAlign = 'center';
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
    setTimeout(
      function(){
        this._executeHook(this.onLoadAudioHook);
      }.bind(this)
    , 0);
    this.playSound.bind(this);
  };

  /**
   * @description
   * Play sound from the given buffer.
   *
   * @param  {Object} buffer
   */
  playSound = (buffer) => {
    this.isPlaying = true;
    if (this.audio.pause) {
      this.audio.play();
      this._renderFrame();
      this._executeHook(this.onResumeHook);
    } else {
      this.sourceNode.disconnect();
      this._setBufferSourceNode();
      this.sourceNode.buffer = buffer;
      this.sourceNode.start(0);
      this._resetTimer();
      this._startTimer();
      this._renderFrame();
      this._executeHook(this.onStartHook);
    }
  };

  /**
   * @description
   * Pause current sound.
   */
  pauseSound = () => {
    this.audio.pause();
    this.isPlaying = false;
    this._executeHook(this.onPauseHook);
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
      setTimeout(function () {
        requestAnimationFrame(this._renderFrame.bind(this));
      }.bind(this), 1000 / this.framesPerSecond);
      // requestAnimationFrame(this._renderFrame.bind(this));
    }

    this._updateTime();
    this.analyser.getByteFrequencyData(this.frequencyData);
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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
    this._executePromiseAllHook(this.onAsyncStaticHook)
      .then(function () {
        this._executeHook(this.onStaticHook)
      }.bind(this))
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
    let promise = hook[0](this)
    for (let i = 1; i < hook.length; i++) {
      promise = promise.then(() => hook[i](this));
    }
    return promise;
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

