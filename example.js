window.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const AudioVisualizer = AudioVisualizeTool.AudioVisualizer;

  const {
    Ripple,
    Ring
  } = AudioVisualizeTool.defaultElements;

  const {
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
  } = AudioVisualizeTool.defaultRenderHooks;

  const {
    setCanvasStyle,
    setStaticCanvasStyle
  } = AudioVisualizeTool.defaultInitHooks;

  let ripple = new Ripple();
  let outerRing = new Ring({
    radius: 95,
    progress: {
      on: true,
      reverse: true
    },
    speed: -10
  });
  let innerRing = new Ring({
    radius: 85,
    width: 3,
    progress: {
      on: true,
      reverse: false
    },
    speed: -10
  });
  let beatRing = new Ring({
    radius: 105,
    color: "#000",
    opacity: 0.1,
    beat: {
      strength: 10,
      frequencySource: 9
    }
  });

  let audioVisualizer = new AudioVisualizer({
    autoplay: false,
    loop: true,
    initVolume: 0.5, // 0 to 1;

    // the frequency sample size for audio analyzer
    // Must be a power of 2 between 25 and 215, like 32, 64, 128, 256, 512, 1024, 2048,
    // Defaults to 512.
    fftSize: 512, 

    // the refresh rate for rendering canvas (not static canvas)
    framesPerSecond: 60, 

    audio: 'myAudio',
    
    canvas: 'myCanvas', // main canvas for rendering frames
    canvasStatic: 'myStaticCanvas', // static canvas
    customCanvases: [], // you can add your own canvases

    // deprecated
    theme: {
      barWidth: 2,
      barHeight: 5,
      barSpacing: 7,
      barColor: '#ffffff',
      shadowBlur: 20, // avoid this attribute for rendering frames, it can reduce the performance
      shadowColor: '#444',
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
    afterPauseHook: [outerRing.render(), innerRing.render(), beatRing.render(), renderTime, renderSeekBar, renderPlayControl],

    beforeResumeHook: [],
    afterResumeHook: [],

    // you can react to volume change here
    onVolumeChangeHook: [renderVolumeBar],

    // hook for static canvas
    beforeStaticHook: [renderBackgroundImg],
    onStaticHook: [renderInfo, renderSeekBarShadow, renderVolumeBar],

    // hooks that will be excuted for each frame
    // used for the main canvas
    onFrameHook: [renderLounge, outerRing.render(), innerRing.render(), beatRing.render(), renderTime, renderSeekBar, ripple.render()],

    // you may bind your events here
    onEventHook: [bindPlayControlEvent, bindSeekBarEvent, bindVolumeBarEvent],

    // you may release some resourse here 
    // if loop is ture this hook will not be excuted
    onEndHook: [],
  })
  audioVisualizer.init();
}, false);