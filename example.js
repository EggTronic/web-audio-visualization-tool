import AudioVisualizer from './visualizeAudio.js';
import {
  renderLounge,
  renderProgressbar,
  renderProgressbarShadow,
  renderText,
  renderTime,
  renderLoading,
  renderBackgroundImg,
  renderPlayButton
} from './defaultRenderHooks.js';

window.addEventListener('DOMContentLoaded', () => {
  'use strict';
  let audioVisualizer = new AudioVisualizer({
    autoplay: false,
    loop: true,
    fftSize: 512,
    // framesPerSecond: 60, // the refresh rate for rendering canvas (not static canvas)

    audio: 'myAudio',
    canvas: 'myCanvas',
    canvasStatic: 'myStaticCanvas',
    yourCanvases: [],

    barWidth: 2,
    barHeight: 5,
    barSpacing: 7,
    barColor: '#cafdff',
    shadowBlur: 20, // only of static canvas for performance issue
    shadowColor: '#ffffff', // only of static canvas for performance issue
    font: ['12px', 'Helvetica'],

    beforeInitHook: [], // each cb should return promises
    afterInitHook: [renderPlayButton],

    beforeLoadAudioHook: [renderLoading], // each cb should return promises
    afterLoadAudioHook: [],

    beforeStartHook: [],
    afterStartHook: [],

    beforePauseHook: [], // each cb should return promises
    afterPauseHook: [renderProgressbar, renderTime],

    beforeResumeHook: [], // each cb should return promises
    afterResumeHook: [],

    beforeStaticHook: [renderBackgroundImg], // each cb should return promises
    onStaticHook: [renderProgressbarShadow, renderText],

    onFrameHook: [renderLounge, renderProgressbar, renderTime],
    onEventHook: [],
    onEndHook: []
  })
  audioVisualizer.init();
}, false);