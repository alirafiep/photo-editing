export type StudioMode = 'home' | 'photo' | 'video' | 'projects';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  isGuest: boolean;
  createdAt: number;
}

// ------------------- PHOTO EDITOR TYPES ------------------- //
export type ToolType =
  | 'move'
  | 'select'
  | 'crop'
  | 'lasso'
  | 'brush'
  | 'eraser'
  | 'text'
  | 'shape'
  | 'gradient'
  | 'eyedropper'
  | 'hand'
  | 'zoom'
  | 'blur';

export type LayerType = 'image' | 'paint' | 'text' | 'shape';

export type BlendMode =
  | 'source-over'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion';

export interface LayerAdjustments {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  exposure: number; // -100 to 100
  temperature: number; // -100 to 100
  tint: number; // -100 to 100
  highlights: number; // -100 to 100
  shadows: number; // -100 to 100
  sharpness: number; // 0 to 100
  blur: number; // 0 to 50
  vignette: number; // 0 to 100
  sepia: number; // 0 to 100
  grayscale: number; // 0 to 100
  invert: number; // 0 to 100
}

export type BlurToolType =
  | 'gaussian'
  | 'motion'
  | 'background'
  | 'lens'
  | 'radial'
  | 'zoom'
  | 'tilt-shift'
  | 'selective'
  | 'face-bg'
  | 'brush';

export interface BlurSettings {
  toolType: BlurToolType;
  intensity: number; // 1 to 100
  radius: number; // 1 to 50
  angle?: number; // 0 to 360 for motion blur
  brushSize: number; // 10 to 200
  brushHardness: number; // 0 to 100
  opacity: number; // 0 to 100
  isEraserRestore: boolean; // if true, brush restores original sharp pixels
  preserveSubject: boolean;
}

export interface TextConfig {
  text: string;
  fontFamily: string;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  align: 'left' | 'center' | 'right';
  color: string;
  letterSpacing: number;
  lineHeight: number;
  strokeColor: string;
  strokeWidth: number;
  shadowColor: string;
  shadowBlur: number;
}

export type ShapeType =
  | 'rectangle'
  | 'rounded-rect'
  | 'circle'
  | 'star'
  | 'polygon'
  | 'line'
  | 'arrow';

export interface ShapeConfig {
  shapeType: ShapeType;
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  cornerRadius: number;
  sides?: number;
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number;
  blendMode: BlendMode;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  flipH: boolean;
  flipV: boolean;
  dataUrl?: string;
  textConfig?: TextConfig;
  shapeConfig?: ShapeConfig;
  adjustments: LayerAdjustments;
  filter: string | null;
}

export interface SelectionArea {
  mode: 'rect' | 'ellipse' | 'lasso';
  x: number;
  y: number;
  width: number;
  height: number;
  points?: { x: number; y: number }[];
  active: boolean;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
  aspect: 'free' | '1:1' | '16:9' | '4:3' | '9:16';
}

export interface ToolSettings {
  brush: {
    size: number;
    hardness: number;
    opacity: number;
    flow: number;
    style: 'round' | 'soft' | 'chalk' | 'square' | 'star';
  };
  eraser: {
    size: number;
    hardness: number;
    opacity: number;
  };
  text: TextConfig;
  shape: ShapeConfig;
  selection: {
    mode: 'rect' | 'ellipse';
    feather: number;
  };
  crop: {
    aspect: 'free' | '1:1' | '16:9' | '4:3' | '9:16';
  };
  gradient: {
    type: 'linear' | 'radial';
    preset: 'sunrise' | 'cyber' | 'neon' | 'twilight' | 'monochrome' | 'sunset';
  };
  eyedropper: {
    sampleSize: 1 | 3 | 5;
  };
  blur: BlurSettings;
}

export interface HistoryItem {
  id: string;
  description: string;
  layers: Layer[];
  selectedLayerId: string | null;
  width: number;
  height: number;
  timestamp: number;
}

export interface PhotoProject {
  id: string;
  type: 'photo';
  name: string;
  width: number;
  height: number;
  dpi: number;
  presetName?: string;
  layers: Layer[];
  selectedLayerId: string | null;
  thumbnail?: string;
  userId?: string;
  createdAt: number;
  updatedAt: number;
  zoom?: number;
  panX?: number;
  panY?: number;
}

// ------------------- VIDEO EDITOR TYPES ------------------- //
export type TransitionType =
  | 'none'
  | 'fade'
  | 'dissolve'
  | 'zoom'
  | 'slide'
  | 'push'
  | 'spin'
  | 'blur'
  | 'wipe'
  | 'glitch';

export type VideoAnimationType =
  | 'none'
  | 'fadeIn'
  | 'fadeOut'
  | 'zoomIn'
  | 'zoomOut'
  | 'slideIn'
  | 'slideOut'
  | 'bounce'
  | 'rotate'
  | 'shake'
  | 'popIn'
  | 'dropIn'
  | 'pulse';

export type VideoEffectType =
  | 'none'
  | 'cinematic'
  | 'glitch'
  | 'glow'
  | 'motionBlur'
  | 'bw'
  | 'vintage'
  | 'cyberpunk'
  | 'vhs'
  | 'rgbSplit'
  | 'lightLeak'
  | 'vignette'
  | 'filmGrain';

export type VideoFilterType =
  | 'none'
  | 'cinematic'
  | 'vintage'
  | 'warm'
  | 'cool'
  | 'portrait'
  | 'bw'
  | 'cyber';

export interface KeyframeItem {
  id: string;
  time: number; // in seconds relative to clip start
  posX: number;
  posY: number;
  scale: number;
  opacity: number;
  rotation: number;
}

export interface VideoClip {
  id: string;
  name: string;
  src: string; // Video URL or blob URL
  type: 'video' | 'image';
  trackIndex: number; // 0 for main video, 1 for overlay/PIP
  startOnTimeline: number; // start time in seconds
  duration: number; // duration in seconds
  trimStart: number; // trim offset from start
  trimEnd: number; // trim offset from end
  speed: number; // 0.25x, 0.5x, 1x, 1.5x, 2x, 4x
  reverse?: boolean;
  isFrozen?: boolean;
  volume: number; // 0 to 2
  opacity: number; // 0 to 1
  posX: number; // offset X px
  posY: number; // offset Y px
  scale: number; // 0.1 to 3.0 (default 1.0)
  rotation: number; // 0 to 360 deg
  blendMode: BlendMode;
  flipH: boolean;
  flipV: boolean;
  transition: TransitionType;
  transitionDuration: number; // e.g. 0.5s
  animation: VideoAnimationType;
  effect: VideoEffectType;
  filter?: VideoFilterType;
  noiseReduction?: boolean;
  keyframes?: KeyframeItem[];
  colorGrade: {
    brightness: number; // -100 to 100
    contrast: number; // -100 to 100
    saturation: number; // -100 to 100
    temperature?: number;
    tint?: number;
  };
}

export interface AudioClip {
  id: string;
  name: string;
  src: string;
  trackIndex: number; // Audio track 0 (music), 1 (voice/sfx)
  startOnTimeline: number;
  duration: number;
  trimStart: number;
  volume: number; // 0 to 2
  speed?: number; // 0.5x to 2x
  muted: boolean;
  fadeIn: number; // in seconds
  fadeOut: number; // in seconds
  noiseReduction?: boolean;
}

export interface SubtitleItem {
  id: string;
  text: string;
  startTime: number; // seconds
  endTime: number; // seconds
  fontFamily: string;
  fontSize: number;
  color: string;
  backgroundColor?: string;
  animation?: 'none' | 'pop' | 'typewriter' | 'glow';
  positionY?: number; // % from top
  strokeColor?: string;
  strokeWidth?: number;
}

export interface TextOverlayItem {
  id: string;
  text: string;
  startOnTimeline: number;
  duration: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  posX: number;
  posY: number;
  scale: number;
  rotation: number;
  animation?: 'none' | 'pop' | 'typewriter' | 'glow' | 'slide' | 'fade';
  stylePreset?: string;
}

export interface StickerItem {
  id: string;
  name: string;
  content: string; // Emoji character or image URL
  isImage: boolean;
  startOnTimeline: number;
  duration: number;
  posX: number; // % 0-100
  posY: number; // % 0-100
  scale: number;
  rotation: number;
  animation?: 'none' | 'bounce' | 'pulse' | 'spin' | 'shake';
}

export interface VideoProject {
  id: string;
  type: 'video';
  name: string;
  width: number;
  height: number;
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5' | '4:3' | 'custom';
  resolution: '720p' | '1080p' | '2k' | '4k';
  fps: 24 | 30 | 60;
  duration: number; // Total timeline duration
  backgroundColor: string; // default pure black #000000
  videoClips: VideoClip[];
  audioClips: AudioClip[];
  subtitles: SubtitleItem[];
  stickers: StickerItem[];
  textOverlays: TextOverlayItem[];
  thumbnail?: string;
  userId?: string;
  createdAt: number;
  updatedAt: number;
}

export type Project = PhotoProject | VideoProject;

export const DEFAULT_ADJUSTMENTS: LayerAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  exposure: 0,
  temperature: 0,
  tint: 0,
  highlights: 0,
  shadows: 0,
  sharpness: 0,
  blur: 0,
  vignette: 0,
  sepia: 0,
  grayscale: 0,
  invert: 0,
};

export const DEFAULT_TEXT_CONFIG: TextConfig = {
  text: 'Double click to edit',
  fontFamily: 'Plus Jakarta Sans',
  fontSize: 48,
  bold: false,
  italic: false,
  align: 'center',
  color: '#ffffff',
  letterSpacing: 0,
  lineHeight: 1.2,
  strokeColor: '#000000',
  strokeWidth: 0,
  shadowColor: 'rgba(0,0,0,0.5)',
  shadowBlur: 4,
};

export const DEFAULT_SHAPE_CONFIG: ShapeConfig = {
  shapeType: 'rectangle',
  fillColor: '#1685ff',
  strokeColor: '#ffffff',
  strokeWidth: 2,
  cornerRadius: 8,
  sides: 5,
};

export const DEFAULT_BLUR_SETTINGS: BlurSettings = {
  toolType: 'gaussian',
  intensity: 30,
  radius: 12,
  brushSize: 60,
  brushHardness: 50,
  opacity: 100,
  isEraserRestore: false,
  preserveSubject: false,
};
