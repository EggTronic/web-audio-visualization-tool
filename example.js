import AudioVisualizer from './visualizeAudio.js';
import {
  setCanvasStyle, 
  setStaticCanvasStyle
} from './defaultInitHooks/index.js';
import {
  renderTime,
  renderInfo,
  renderLoading,
  clearLoading,
  renderBackgroundImg,
  renderLounge,
  renderProgressbar,
  renderProgressbarShadow,
  renderSeekBar,
  renderSeekBarShadow,
  bindSeekBarEvent,
  renderPlayControl,
  bindPlayControlEvent,
  renderVolumeBar,
  bindVolumeBarEvent,
} from './defaultRenderHooks/index.js';
import Ripple from './defaultCanvasElements/ripple.js';

window.addEventListener('DOMContentLoaded', () => {
  'use strict';
  let ripple = new Ripple();
  let audioVisualizer = new AudioVisualizer({
    autoplay: false,
    loop: true,
    initVolume: 0.5, // 0 to 1;
    fftSize: 512, // the frequency sample size for audio analyzer
    framesPerSecond: 60, // the refresh rate for rendering canvas (not static canvas)

    audio: 'myAudio',
    canvas: 'myCanvas', // main canvas for rendering frames
    canvasStatic: 'myStaticCanvas', // static canvas
    customCanvases: [], // you can add your own canvases

    // customize your theme
    theme: {
      barWidth: 2,
      barHeight: 5,
      barSpacing: 7,
      barColor: '#ffffff',
      shadowBlur: 20, // avoid this attribute for rendering frames, it can reduce the performance
      shadowColor: '#ffffff',
      font: ['12px', 'Helvetica'],
    },

    // hooks contain callbacks just before/after differency lifecycle stage
    // cb in before hooks should return promises
    beforeInitHook: [],
    afterInitHook: [setCanvasStyle, setStaticCanvasStyle],

    beforeLoadAudioHook: [renderLoading],
    afterLoadAudioHook: [clearLoading, renderPlayControl],

    beforeStartHook: [],
    afterStartHook: [],

    beforePauseHook: [],
    afterPauseHook: [renderProgressbar, renderTime, renderSeekBar, renderPlayControl],

    beforeResumeHook: [],
    afterResumeHook: [],

    // you can react to volume change here
    onVolumeChangeHook: [renderVolumeBar],

    // hook for static canvas
    beforeStaticHook: [renderBackgroundImg],
    onStaticHook: [renderProgressbarShadow, renderInfo, renderSeekBarShadow, renderVolumeBar],

    // hooks that will be excuted for each frame
    // used for the main canvas
    onFrameHook: [renderLounge, renderProgressbar, renderTime, renderSeekBar, ripple.render()],

    // you may bind your events here
    onEventHook: [bindPlayControlEvent, bindSeekBarEvent, bindVolumeBarEvent],

    // you may release some resourse here 
    // if loop is ture this hook will not be excuted
    onEndHook: [],
  })
  audioVisualizer.init();
}, false);