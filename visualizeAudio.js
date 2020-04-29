class AudioVisualizer {
    constructor(cfg) {
        this.isPlaying = false;
        this.autoplay = cfg.autoplay || false;
        this.loop = cfg.loop || false;
        this.audio = document.getElementById(cfg.audio) || {};
        this.canvas = document.getElementById(cfg.canvas) || {};
        this.canvasCtx = this.canvas.getContext('2d') || null;
        this.author = this.audio.getAttribute('data-author') || '';
        this.title = this.audio.getAttribute('data-title') || '';
        this.ctx = null;
        this.analyser = null;
        this.sourceNode = null;
        this.frequencyData = [];
        this.audioSrc = null;
        this.duration = 0;
        this.minutes = '00';
        this.seconds = '00';
        this.style = cfg.style || 'lounge';
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
        this.setContext();
        this.setAnalyser();
        this.setFrequencyData();
        this.setBufferSourceNode();
        this.setMediaSource();
        this.setCanvasStyles();
        this.bindEvents();
    }

    /**
     * @description
     * Set current audio context.
     *
     */
    setContext = () => {
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
    setAnalyser = () => {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.6;
        this.analyser.fftSize = AudioVisualizer.FFT_SIZE;
    };

    /**
     * @description
     * Set frequency data.
     *
     */
    setFrequencyData = () => {
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
    };

    /**
     * @description
     * Set source buffer and connect processor and analyser.
     *
     */
    setBufferSourceNode = () => {
        this.sourceNode = this.ctx.createBufferSource();
        this.sourceNode.loop = this.loop;
        this.sourceNode.connect(this.analyser);
        this.sourceNode.connect(this.ctx.destination);
        this.sourceNode.onended = function () {
            setTimeout(
                function () {
                    clearInterval(this.interval);
                    //this.sourceNode.disconnect();
                    this.isPlaying = false;
                    //this.setBufferSourceNode();
                }.bind(this)
                , 1500)

        }.bind(this);
    };

    /**
     * @description
     * Set current media source url.
     *
     */
    setMediaSource = () => {
        this.audioSrc = this.audio.getAttribute('src');
    };

    /**
     * @description
     * Set canvas gradient color.
     *
     */
    setCanvasStyles = () => {
        this.gradient = this.canvasCtx.createLinearGradient(0, 0, 0, 300);
        this.gradient.addColorStop(1, this.barColor);
        this.canvasCtx.fillStyle = this.gradient;
        this.canvasCtx.shadowBlur = this.shadowBlur;
        this.canvasCtx.shadowColor = this.shadowColor;
        this.canvasCtx.font = this.font.join(' ');
        this.canvasCtx.textAlign = 'center';
    };

    /**
     * @description
     * Bind click events.
     *
     */
    bindEvents = () => {
        document.addEventListener('click', (e) => {
            if (e.target === this.canvas) {
                e.stopPropagation();
                if (!this.isPlaying) {
                    return (this.ctx.state === 'suspended') ? this.playSound() : this.loadSound();
                } else {
                    return this.pauseSound();
                }
            }
        });

        if (this.autoplay) {
            this.loadSound();
        }
    };

    /**
     * @description
     * Load sound file.
     */
    loadSound = () => {
        let req = new XMLHttpRequest();
        req.open('GET', this.audioSrc, true);
        req.responseType = 'arraybuffer';
        this.canvasCtx.fillText('Loading...', this.canvas.width / 2 + 10, this.canvas.height / 2);

        req.onload = function () {
            this.ctx.decodeAudioData(req.response, this.playSound.bind(this), this.onError.bind(this));
        }.bind(this);

        req.send();
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
            this.renderFrame();
        } else {
            this.sourceNode.disconnect();
            this.setBufferSourceNode();
            this.sourceNode.buffer = buffer;
            this.sourceNode.start(0);
            this.resetTimer();
            this.startTimer();
            this.renderFrame();
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
    startTimer = () => {
        this.interval = setInterval(() => {
            if (this.isPlaying) {
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
    resetTimer = () => {
        let time = new Date(0, 0);
        this.duration = time.getTime();
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
     * Render frame on canvas.
     */
    renderFrame = () => {
        if (this.isPlaying) {
            requestAnimationFrame(this.renderFrame.bind(this));
        }

        this.analyser.getByteFrequencyData(this.frequencyData);

        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.renderTime();
        this.renderProgressbar();
        this.renderText();
        this.renderByStyleType();
    };

    renderProgressbar = () => {
        let cx = this.canvas.width / 2;
        let cy = this.canvas.height / 2;
        let correction = 10;
        let curDuration = this.minutes * 60 + parseInt(this.seconds);

        let arcPercent;
        this.canvasCtx.strokeStyle = this.barColor;
        this.canvasCtx.lineWidth = '10';

        if (this.sourceNode.buffer) {
            arcPercent = curDuration / this.sourceNode.buffer.duration;
            this.canvasCtx.beginPath();
            this.canvasCtx.arc(cx + correction, cy, 100, 0.5 * Math.PI, 0.5 * Math.PI + arcPercent * 2 * Math.PI);
            this.canvasCtx.stroke();
            this.canvasCtx.closePath();
        }

        this.canvasCtx.beginPath();
        this.canvasCtx.arc(cx + correction, cy, 100, 0.5 * Math.PI, 0.5 * Math.PI + 2 * Math.PI);
        this.canvasCtx.globalAlpha = 0.1;
        this.canvasCtx.stroke();
        this.canvasCtx.closePath();
        this.canvasCtx.globalAlpha = 1;
    };

    /**
     * @description
     * Render audio author and title.
     */
    renderText = () => {
        let cx = this.canvas.width / 2;
        let cy = this.canvas.height / 2;
        let correction = 10;

        this.canvasCtx.textBaseline = 'top';
        this.canvasCtx.fillText('by ' + this.author, cx + correction, cy);
        this.canvasCtx.font = parseInt(this.font[0], 10) + 8 + 'px ' + this.font[1];
        this.canvasCtx.textBaseline = 'bottom';
        this.canvasCtx.fillText(this.title, cx + correction, cy);
        this.canvasCtx.font = this.font.join(' ');
    };

    /**
     * @description
     * Render audio time.
     */
    renderTime = () => {
        let time = this.minutes + ':' + this.seconds;
        this.canvasCtx.fillText(time, this.canvas.width / 2 + 10, this.canvas.height / 2 + 40);
    };

    /**
     * @description
     * Render frame by style type.
     *
     * @return {Function}
     */
    renderByStyleType = () => {
        return this[AudioVisualizer.TYPE[this.style]]();
    };

    /**
     * @description
     * Render lounge style type.
     */
    renderLounge = () => {
        let cx = this.canvas.width / 2;
        let cy = this.canvas.height / 2;
        let radius = 140;
        let maxBarNum = Math.floor((radius * 2 * Math.PI) / (this.barWidth + this.barSpacing));
        let slicedPercent = Math.floor((maxBarNum * 25) / 100);
        let barNum = maxBarNum - slicedPercent;
        let freqJump = Math.floor(this.frequencyData.length / maxBarNum);

        for (let i = 0; i < barNum; i++) {
            let amplitude = this.frequencyData[i * freqJump];
            let alfa = (i * 2 * Math.PI) / maxBarNum;
            let beta = (3 * 45 - this.barWidth) * Math.PI / 180;
            let x = 0;
            let y = radius - (amplitude / 12 - this.barHeight);
            let w = this.barWidth;
            let h = amplitude / 6 + this.barHeight;

            this.canvasCtx.save();
            this.canvasCtx.translate(cx + this.barSpacing, cy + this.barSpacing);
            this.canvasCtx.rotate(alfa - beta);
            this.canvasCtx.fillRect(x, y, w, h);
            this.canvasCtx.restore();
        }
    };
}

AudioVisualizer.FFT_SIZE = 512;
AudioVisualizer.TYPE = {
    'lounge': 'renderLounge'
};

document.addEventListener('DOMContentLoaded', () => {
    'use strict';
    let audioVisualizer = new AudioVisualizer({
        autoplay: true,
        loop: false,
        audio: 'myAudio',
        canvas: 'myCanvas',
        style: 'lounge',
        barWidth: 2,
        barHeight: 5,
        barSpacing: 7,
        barColor: '#cafdff',
        shadowBlur: 20,
        shadowColor: '#ffffff',
        font: ['12px', 'Helvetica'],
        
        onInitHook: [],
        onStartHook: [],
        onPauseHook: [],
        onContinueHook: [],
        onFrameHook: [],
        onEndHook: [],
    })
    audioVisualizer.init();
}, false);