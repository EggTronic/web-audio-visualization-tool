import AudioVisualizer from './visualizeAudio.js';
import {
  renderLounge,
  renderProgressbar,
  renderProgressbarShadow,
  renderText,
  renderTime
} from './defaultRenders.js';

window.addEventListener('DOMContentLoaded', () => {
  'use strict';
  let audioVisualizer = new AudioVisualizer({
    autoplay: false,
    loop: false,
    audio: 'myAudio',
    canvas: 'myCanvas',
    canvasStatic: 'myStaticCanvas',
    barWidth: 2,
    barHeight: 5,
    barSpacing: 7,
    barColor: '#cafdff',
    shadowBlur: 20, // only of static canvas for performance issue
    shadowColor: '#ffffff',
    font: ['12px', 'Helvetica'],
    fftSize: 512,

    // onInitHook: [],
    // onStartHook: [],
    // onPauseHook: [],
    // onContinueHook: [],
    onFrameHook: [renderLounge, renderProgressbar, renderTime],
    onStaticHook: [renderProgressbarShadow, renderText],
    // onEndHook: [],
  })
  audioVisualizer.init();
}, false);