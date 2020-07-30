import AudioVisualizer from "./AudioVisualizer/index";

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
  renderSeekBar,
  renderSeekBarShadow,
  bindSeekBarEvent,
  renderPlayControl,
  bindPlayControlEvent,
  renderVolumeBar,
  bindVolumeBarEvent
} from './defaultRenderHooks/index.js';

import {
  Ripple,
  Ring
} from './defaultCanvasElements/index.js';

const defaultInitHooks = {
  setCanvasStyle, 
  setStaticCanvasStyle
}

const defaultRenderHooks = {
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
}

const defaultElements = {
  Ripple,
  Ring
}

const AV = {
  AudioVisualizer,
  defaultInitHooks,
  defaultRenderHooks,
  defaultElements
}
export default AV;