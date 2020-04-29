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
    this.sourceNode = null;
    this.frequencyData = [];
    this.audioSrc = null;
    this.duration = 0;
    this.minutes = '00';
    this.seconds = '00';
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
    this.canvasCtx.fillText('Play', this.canvas.width / 2 + 10, this.canvas.height / 2 + 50);
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
    this.sourceNode = this.ctx.createBufferSource();
    this.sourceNode.loop = this.loop;
    this.sourceNode.connect(this.analyser);
    this.sourceNode.connect(this.ctx.destination);
    this.sourceNode.onended = function () {
      setTimeout(
        function () {
          console.log(this)
          clearInterval(this.interval);
          //this.sourceNode.disconnect();
          this.isPlaying = false;
          //this.setBufferSourceNode();
        }.bind(this)
        , 1500)

        this._executeHook(this.onEndHook);
    }.bind(this);
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
    // this.canvasCtx.shadowBlur = this.shadowBlur;
    // this.canvasCtx.shadowColor = this.shadowColor;
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
   * Bind click events.
   *
   */
  _bindEvents = () => {
    document.addEventListener('click', (e) => {
      if (e.target === this.canvas) {
        e.stopPropagation();
        if (!this.isPlaying) {
          return (this.ctx.state === "suspended") ? this.playSound() : this.loadSound();
        } else {
          return this.pauseSound();
        }
      }
    }); 

    this._executeHook(this.onEventHook);
  };

  /**
   * @description
   * Load sound file.
   */
  loadSound = () => {
    let req = new XMLHttpRequest();
    req.open('GET', this.audioSrc, true);
    req.responseType = 'arraybuffer';
    req.onload = function () {
      this.ctx.decodeAudioData(req.response, this.playSound.bind(this), this._onError.bind(this));
    }.bind(this);
    req.send();

    this._executeHook(this.onLoadAudioHook);
  };

  /**
   * @description
   * Play sound from the given buffer.
   *
   * @param  {Object} buffer
   */
  playSound = (buffer) => {
    this.isPlaying = true;
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
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
    this.ctx.suspend();
    this.isPlaying = false;
  };

  /**
   * @description
   * Start playing timer.
   */
  _startTimer = () => {
    this.interval = setInterval(() => {
      if (this.isPlaying && this.ctx.state === "running") {
        let now = new Date(this.duration);
        let min = now.getHours();
        let sec = now.getMinutes();
        this.minutes = (min < 10) ? '0' + min : min;
        this.seconds = (sec < 10) ? '0' + sec : sec;
        this.duration = now.setMinutes(sec + 1);
      }
    }, 1000);
  };

  /**
   * @description
   * Reset time counter.
   */
  _resetTimer = () => {
    let time = new Date(0, 0);
    this.duration = time.getTime();
    this.minutes = '00';
    this.seconds = '00';
  };

  /**
   * @description
   * On audio data stream error fn.
   *
   * @param  {Object} e
   */
  _onError = (e) => {
    console.info('Error decoding audio file. -- ', e);
  };

  /**
   * @description
   * Render frame on canvas.
   */
  _renderFrame = () => {
    if (this.isPlaying) {
      requestAnimationFrame(this._renderFrame.bind(this));
    }

    this.analyser.getByteFrequencyData(this.frequencyData);
    this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this._executeHook(this.onFrameHook)
  };

  /**
   * @description
   * Render frame on canvas.
   */
  _renderStatic = () => {
    this._executeAsyncHook(this.onAsyncStaticHook)
      .then(function() {
        this._executeHook(this.onStaticHook)
      }.bind(this))
      .catch(err => {
        console.log(err);
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
    let promises = [];
    for (let i = 0; i < hook.length; i++) {
      promises.push(hook[i](this));
    }
    return Promise.all(promises)
  }
}

