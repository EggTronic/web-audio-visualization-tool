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
    audio: 'myAudio',
    canvas: 'myCanvas',
    canvasStatic: 'myStaticCanvas',
    barWidth: 2,
    barHeight: 5,
    barSpacing: 7,
    barColor: '#cafdff',
    shadowBlur: 20, // only of static canvas for performance issue
    shadowColor: '#ffffff', // only of static canvas for performance issue
    font: ['12px', 'Helvetica'],
    fftSize: 512,
    framesPerSecond: 30, // the refresh rate for rendering canvas (not static canvas)

    onInitHook: [renderPlayButton],
    onLoadAudioHook: [renderLoading],
    onStartHook: [],
    onPauseHook: [],
    onResumeHook: [],
    onFrameHook: [renderLounge, renderProgressbar, renderTime],
    onAsyncStaticHook: [renderBackgroundImg],
    onStaticHook: [renderProgressbarShadow, renderText],
    onEventHook: [],
    onEndHook: []
  })
  audioVisualizer.init();
}, false);