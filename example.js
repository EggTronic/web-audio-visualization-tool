import AudioVisualizer from './visualizeAudio.js';
import {
  renderLounge,
  renderProgressbar,
  renderProgressbarShadow,
  renderSeekBarShadow,
  renderSeekBar,
  renderText,
  renderTime,
  renderLoading,
  renderBackgroundImg,
  renderPlayButton,
  bindPlayEvent,
  bindSeekBarEvent,
  setCanvasStyle,
  clearLoading,
  setStaticCanvasStyle
} from './defaultRenderHooks.js';

window.addEventListener('DOMContentLoaded', () => {
  'use strict';
  let audioVisualizer = new AudioVisualizer({
    autoplay: false,
    loop: true,
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
    afterLoadAudioHook: [clearLoading, renderPlayButton],

    beforeStartHook: [],
    afterStartHook: [],

    beforePauseHook: [],
    afterPauseHook: [renderProgressbar, renderTime, renderSeekBar, renderPlayButton],

    beforeResumeHook: [],
    afterResumeHook: [],

    // hook for static canvas
    beforeStaticHook: [renderBackgroundImg],
    onStaticHook: [renderProgressbarShadow, renderText, renderSeekBarShadow],

    // hooks that will be excuted for each frame
    // used for the main canvas
    onFrameHook: [renderLounge, renderProgressbar, renderTime, renderSeekBar],

    // you may bind your events here
    onEventHook: [bindPlayEvent, bindSeekBarEvent],

    // you may release some resourse here 
    // if loop is ture this hook will not be excuted
    onEndHook: []
  })
  audioVisualizer.init();
}, false);