export interface CanvasElementProps {
  xoffset: number;
  yoffset: number;
  opacity: number;
}

export interface AudioInfo {
  audioTracks: AudioTrackList;
  currentTime: number;
  duration: number;
  loop: boolean;
  muted: boolean;
  paused: boolean;
  seeking: boolean;
  volume: number;
  buffered: TimeRanges;
  readyState: 0 | 1 | 2 | 3 | 4;
}
