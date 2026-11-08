import {
  VideoClip,
  AudioClip,
  SubtitleItem,
  TextOverlayItem,
  StickerItem,
  VideoProject,
  KeyframeItem,
  TransitionType,
  VideoAnimationType,
  VideoEffectType,
  VideoFilterType,
} from '../types/editor';

// ----------------- SAMPLE MEDIA LIBRARY ----------------- //
export interface SampleMedia {
  id: string;
  title: string;
  type: 'video' | 'audio' | 'image';
  src: string;
  duration: number; // seconds
  thumbnail: string;
  category?: string;
}

export const SAMPLE_MEDIA_LIBRARY: SampleMedia[] = [
  {
    id: 'sample_vid_cyberpunk',
    title: 'Neon Cyberpunk Walk',
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 15,
    thumbnail: '/src/assets/images/sample_cyberpunk_city_1794099852386.jpg',
    category: 'City',
  },
  {
    id: 'sample_vid_nature',
    title: 'Mountain Alpine View',
    type: 'video',
    src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 10,
    thumbnail: '/src/assets/images/sample_mountain_landscape_1794099854545.jpg',
    category: 'Nature',
  },
  {
    id: 'sample_img_portrait',
    title: 'Studio Portrait Model',
    type: 'image',
    src: '/src/assets/images/sample_portrait_model_1794099853081.jpg',
    duration: 5,
    thumbnail: '/src/assets/images/sample_portrait_model_1794099853081.jpg',
    category: 'Portrait',
  },
  {
    id: 'sample_img_sneaker',
    title: 'Designer Sneaker',
    type: 'image',
    src: '/src/assets/images/sample_product_sneaker_1794099853226.jpg',
    duration: 5,
    thumbnail: '/src/assets/images/sample_product_sneaker_1794099853226.jpg',
    category: 'Product',
  },
];

// ----------------- MUSIC & SOUND EFFECTS LIBRARY ----------------- //
export interface AudioTrackItem {
  id: string;
  title: string;
  artist: string;
  category: 'Ambient' | 'Cinematic' | 'Upbeat' | 'Lo-Fi' | 'Electronic';
  src: string;
  duration: number;
}

export const MUSIC_LIBRARY: AudioTrackItem[] = [
  {
    id: 'mus_ambient_1',
    title: 'Deep Forest Bonfire',
    artist: 'SNAP Soundworks',
    category: 'Ambient',
    src: 'https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg',
    duration: 25,
  },
  {
    id: 'mus_cinematic_1',
    title: 'Interstellar Odyssey',
    artist: 'Cyber Orchestra',
    category: 'Cinematic',
    src: 'https://actions.google.com/sounds/v1/science_fiction/alien_spaceship_hum.ogg',
    duration: 20,
  },
  {
    id: 'mus_lofi_1',
    title: 'Midnight Coffee Lofi',
    artist: 'Lo-Fi Chill Beat',
    category: 'Lo-Fi',
    src: 'https://actions.google.com/sounds/v1/weather/light_rain_on_roof.ogg',
    duration: 18,
  },
  {
    id: 'mus_upbeat_1',
    title: 'Summer Drive Synthwave',
    artist: 'Pulsewave',
    category: 'Upbeat',
    src: 'https://actions.google.com/sounds/v1/vehicles/sports_car_accelerate.ogg',
    duration: 12,
  },
  {
    id: 'mus_electronic_1',
    title: 'Cyberpunk Bass Pulse',
    artist: 'Neon Surge',
    category: 'Electronic',
    src: 'https://actions.google.com/sounds/v1/foley/laser_burst.ogg',
    duration: 15,
  },
];

export interface SoundEffectItem {
  id: string;
  title: string;
  category: 'Woosh' | 'Glitch' | 'Impact' | 'UI' | 'Bell';
  src: string;
  duration: number;
}

export const SOUND_EFFECTS_LIBRARY: SoundEffectItem[] = [
  {
    id: 'sfx_woosh_1',
    title: 'Air Fast Swoosh',
    category: 'Woosh',
    src: 'https://actions.google.com/sounds/v1/foley/swoosh_transition.ogg',
    duration: 1.5,
  },
  {
    id: 'sfx_impact_1',
    title: 'Cinematic Sub Thud',
    category: 'Impact',
    src: 'https://actions.google.com/sounds/v1/foley/body_fall.ogg',
    duration: 2.0,
  },
  {
    id: 'sfx_glitch_1',
    title: 'Digital Glitch Burst',
    category: 'Glitch',
    src: 'https://actions.google.com/sounds/v1/science_fiction/force_field_hum.ogg',
    duration: 2.2,
  },
  {
    id: 'sfx_ui_pop',
    title: 'Bubble UI Pop',
    category: 'UI',
    src: 'https://actions.google.com/sounds/v1/cartoon/pop.ogg',
    duration: 0.8,
  },
  {
    id: 'sfx_camera_click',
    title: 'Camera Shutter Click',
    category: 'UI',
    src: 'https://actions.google.com/sounds/v1/household/light_switch.ogg',
    duration: 1.0,
  },
  {
    id: 'sfx_bell_chime',
    title: 'Notification Bell',
    category: 'Bell',
    src: 'https://actions.google.com/sounds/v1/household/doorbell_chime.ogg',
    duration: 2.5,
  },
];

// ----------------- STICKERS & EMOJIS LIBRARY ----------------- //
export interface StickerPreset {
  id: string;
  name: string;
  content: string; // emoji or SVG/URL
  category: 'Emoji' | 'Social' | 'Badges' | 'Effects';
  isImage: boolean;
}

export const STICKERS_LIBRARY: StickerPreset[] = [
  // Emojis
  { id: 'stk_fire', name: 'Fire Flame', content: '🔥', category: 'Emoji', isImage: false },
  { id: 'stk_heart', name: 'Glowing Heart', content: '❤️', category: 'Emoji', isImage: false },
  { id: 'stk_sparkle', name: 'Magic Sparkles', content: '✨', category: 'Emoji', isImage: false },
  { id: 'stk_rocket', name: 'Rocket Launch', content: '🚀', category: 'Emoji', isImage: false },
  { id: 'stk_hundred', name: '100 Percent', content: '💯', category: 'Emoji', isImage: false },
  { id: 'stk_clap', name: 'Applaud', content: '👏', category: 'Emoji', isImage: false },
  { id: 'stk_cinema', name: 'Movie Clapper', content: '🎬', category: 'Emoji', isImage: false },
  { id: 'stk_boom', name: 'Collision Boom', content: '💥', category: 'Emoji', isImage: false },
  { id: 'stk_star', name: 'Golden Star', content: '⭐', category: 'Emoji', isImage: false },
  { id: 'stk_party', name: 'Celebration', content: '🎉', category: 'Emoji', isImage: false },
  { id: 'stk_bolt', name: 'High Voltage', content: '⚡', category: 'Emoji', isImage: false },
  { id: 'stk_crown', name: 'Royal Crown', content: '👑', category: 'Emoji', isImage: false },
  { id: 'stk_diamond', name: 'Gem Diamond', content: '💎', category: 'Emoji', isImage: false },
  { id: 'stk_target', name: 'Bullseye Target', content: '🎯', category: 'Emoji', isImage: false },
  // Social Badges
  { id: 'stk_sub', name: 'SUBSCRIBE', content: '🔴 SUBSCRIBE', category: 'Social', isImage: false },
  { id: 'stk_like', name: 'LIKE & SHARE', content: '👍 LIKE', category: 'Social', isImage: false },
  { id: 'stk_bell', name: 'NOTIFY BELL', content: '🔔 RING BELL', category: 'Social', isImage: false },
  { id: 'stk_new', name: 'NEW VIDEO', content: '⚡ NEW VIDEO', category: 'Badges', isImage: false },
  { id: 'stk_live', name: 'LIVE STREAM', content: '🔴 LIVE', category: 'Badges', isImage: false },
];

// ----------------- TEXT TEMPLATES LIBRARY ----------------- //
export interface TextTemplatePreset {
  id: string;
  name: string;
  category: 'Trending' | 'Titles' | 'Social' | 'Minimal';
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  strokeColor?: string;
  strokeWidth?: number;
  shadowColor?: string;
  shadowBlur?: number;
  animation?: 'none' | 'pop' | 'typewriter' | 'glow' | 'slide' | 'fade';
}

export const TEXT_TEMPLATES_LIBRARY: TextTemplatePreset[] = [
  {
    id: 'tt_trending_bold',
    name: 'Trending Impact Bold',
    category: 'Trending',
    text: 'CRAZY EDIT',
    fontFamily: 'Montserrat',
    fontSize: 64,
    color: '#ffffff',
    strokeColor: '#000000',
    strokeWidth: 6,
    shadowColor: 'rgba(22, 133, 255, 0.8)',
    shadowBlur: 16,
    animation: 'pop',
  },
  {
    id: 'tt_neon_glow',
    name: 'Cyber Neon Glow',
    category: 'Trending',
    text: 'CYBER VIBES',
    fontFamily: 'JetBrains Mono',
    fontSize: 54,
    color: '#00f3ff',
    strokeColor: '#0051ff',
    strokeWidth: 2,
    shadowColor: '#00f3ff',
    shadowBlur: 20,
    animation: 'glow',
  },
  {
    id: 'tt_cinematic_title',
    name: 'Cinematic Movie Title',
    category: 'Titles',
    text: 'CHAPTER ONE: THE BEGINNING',
    fontFamily: 'Playfair Display',
    fontSize: 48,
    color: '#f5f5f5',
    shadowColor: 'rgba(0, 0, 0, 0.9)',
    shadowBlur: 12,
    animation: 'fade',
  },
  {
    id: 'tt_social_lower_third',
    name: 'Social Creator Tag',
    category: 'Social',
    text: '@creator · Subscribe for more',
    fontFamily: 'Plus Jakarta Sans',
    fontSize: 32,
    color: '#ffffff',
    strokeColor: 'rgba(0,0,0,0.5)',
    strokeWidth: 2,
    animation: 'slide',
  },
  {
    id: 'tt_minimal_clean',
    name: 'Minimal Editorial Subtitle',
    category: 'Minimal',
    text: 'Effortless creative storytelling',
    fontFamily: 'Montserrat',
    fontSize: 36,
    color: '#e0e0e0',
    animation: 'typewriter',
  },
];

// ----------------- VIDEO EFFECTS LIST ----------------- //
export interface EffectDefinition {
  id: VideoEffectType;
  name: string;
  description: string;
  color: string;
}

export const VIDEO_EFFECTS_LIST: EffectDefinition[] = [
  { id: 'cinematic', name: 'Cinematic 35mm', description: 'Rich contrast & saturated color grade', color: '#1685ff' },
  { id: 'glitch', name: 'Digital Glitch', description: 'Color aberration and horizontal noise', color: '#ec4899' },
  { id: 'glow', name: 'Dreamy Glow', description: 'Soft radiant bloom highlights', color: '#a855f7' },
  { id: 'motionBlur', name: 'Motion Blur', description: 'Dynamic directional blur streaks', color: '#3b82f6' },
  { id: 'vhs', name: 'Vintage 90s VHS', description: 'CRT scanlines, tape flutter and grain', color: '#eab308' },
  { id: 'rgbSplit', name: 'RGB Prism Split', description: 'Color fringing chromatic aberration', color: '#06b6d4' },
  { id: 'cyberpunk', name: 'Cyberpunk Neon', description: 'Electric cyan and violet color grading', color: '#8b5cf6' },
  { id: 'bw', name: 'Noir Black & White', description: 'High contrast monochrome cinema', color: '#71717a' },
  { id: 'lightLeak', name: 'Warm Light Leak', description: 'Golden sun flares on the canvas edge', color: '#f97316' },
  { id: 'vignette', name: 'Dramatic Vignette', description: 'Soft dark borders focusing the center', color: '#64748b' },
  { id: 'filmGrain', name: '16mm Film Grain', description: 'Textured analog cinema grain', color: '#78716c' },
];

// ----------------- VIDEO FILTERS LIST ----------------- //
export interface FilterDefinition {
  id: VideoFilterType;
  name: string;
  cssFilter: string;
}

export const VIDEO_FILTERS_LIST: FilterDefinition[] = [
  { id: 'none', name: 'Original', cssFilter: 'none' },
  { id: 'cinematic', name: 'Cinematic Teal', cssFilter: 'contrast(120%) saturate(115%) hue-rotate(-10deg)' },
  { id: 'vintage', name: 'Vintage 70s', cssFilter: 'sepia(35%) contrast(110%) brightness(105%)' },
  { id: 'warm', name: 'Golden Sunset', cssFilter: 'sepia(20%) saturate(135%) brightness(105%)' },
  { id: 'cool', name: 'Nordic Chill', cssFilter: 'hue-rotate(190deg) saturate(90%) contrast(115%)' },
  { id: 'portrait', name: 'Soft Portrait', cssFilter: 'brightness(108%) contrast(105%) saturate(110%)' },
  { id: 'bw', name: 'High Contrast B&W', cssFilter: 'grayscale(100%) contrast(145%)' },
  { id: 'cyber', name: 'Cyber Matrix', cssFilter: 'hue-rotate(140deg) saturate(180%) contrast(130%)' },
];

// ----------------- TRANSITIONS LIST ----------------- //
export const TRANSITIONS_LIST: { id: TransitionType; name: string }[] = [
  { id: 'none', name: 'None (Cut)' },
  { id: 'fade', name: 'Fade Through Black' },
  { id: 'dissolve', name: 'Cross Dissolve' },
  { id: 'zoom', name: 'Zoom In Transition' },
  { id: 'slide', name: 'Slide Left' },
  { id: 'push', name: 'Push Right' },
  { id: 'spin', name: 'Spin Rotate' },
  { id: 'blur', name: 'Lens Blur Transition' },
  { id: 'wipe', name: 'Linear Wipe' },
  { id: 'glitch', name: 'Glitch Transition' },
];

// ----------------- ANIMATIONS LIST ----------------- //
export const ANIMATIONS_LIST: { id: VideoAnimationType; name: string; category: 'In' | 'Out' | 'Combo' }[] = [
  { id: 'none', name: 'None', category: 'In' },
  { id: 'fadeIn', name: 'Fade In', category: 'In' },
  { id: 'zoomIn', name: 'Zoom In', category: 'In' },
  { id: 'slideIn', name: 'Slide Up In', category: 'In' },
  { id: 'popIn', name: 'Pop In (Elastic)', category: 'In' },
  { id: 'dropIn', name: 'Drop Down', category: 'In' },
  { id: 'fadeOut', name: 'Fade Out', category: 'Out' },
  { id: 'zoomOut', name: 'Zoom Out', category: 'Out' },
  { id: 'slideOut', name: 'Slide Down Out', category: 'Out' },
  { id: 'bounce', name: 'Bounce Repeat', category: 'Combo' },
  { id: 'rotate', name: 'Continuous Spin', category: 'Combo' },
  { id: 'shake', name: 'Camera Shake', category: 'Combo' },
  { id: 'pulse', name: 'Heartbeat Pulse', category: 'Combo' },
];

// ----------------- RESOLUTION DIMENSION CALCULATOR ----------------- //
export function getResolutionDimensions(
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5' | '4:3' | 'custom',
  resolution: '720p' | '1080p' | '2k' | '4k' = '1080p',
  customW?: number,
  customH?: number
): { width: number; height: number } {
  if (aspectRatio === 'custom' && customW && customH) {
    return { width: customW, height: customH };
  }

  const baseMap: Record<string, number> = {
    '720p': 720,
    '1080p': 1080,
    '2k': 1440,
    '4k': 2160,
  };
  const base = baseMap[resolution] || 1080;

  switch (aspectRatio) {
    case '16:9':
      return { width: Math.round((base * 16) / 9), height: base };
    case '9:16':
      return { width: base, height: Math.round((base * 16) / 9) };
    case '1:1':
      return { width: base, height: base };
    case '4:5':
      return { width: base, height: Math.round((base * 5) / 4) };
    case '4:3':
      return { width: Math.round((base * 4) / 3), height: base };
    default:
      return { width: 1920, height: 1080 };
  }
}

// ----------------- PROJECT CREATORS ----------------- //

/**
 * Creates a brand new black canvas video project with an empty timeline.
 * Requirement 4: Whenever a user clicks NEW PROJECT:
 * - Open a completely black canvas.
 * - Default canvas background must be pure black (#000000).
 * - Do not automatically insert a sample image or video.
 * - Display a black preview screen.
 * - Keep the timeline empty until the user imports media.
 */
export function createNewBlankVideoProject(
  name: string = 'Untitled Video Project',
  aspectRatio: '16:9' | '9:16' | '1:1' | '4:5' | '4:3' | 'custom' = '16:9',
  resolution: '720p' | '1080p' | '2k' | '4k' = '1080p',
  fps: 24 | 30 | 60 = 30
): VideoProject {
  const { width, height } = getResolutionDimensions(aspectRatio, resolution);

  return {
    id: 'vid_' + Math.random().toString(36).substring(2, 9),
    type: 'video',
    name,
    width,
    height,
    aspectRatio,
    resolution,
    fps,
    duration: 30, // 30s timeline canvas ready for imported clips
    backgroundColor: '#000000', // Pure black canvas
    videoClips: [], // Empty timeline
    audioClips: [], // Empty audio
    subtitles: [], // Empty captions
    stickers: [], // Empty stickers
    textOverlays: [], // Empty text
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

/**
 * Default starter video project (pure black canvas with empty timeline as required)
 */
export function createDefaultVideoProject(name: string = 'New Video Project'): VideoProject {
  return createNewBlankVideoProject(name, '16:9', '1080p', 30);
}

/**
 * Optional sample demo project with preloaded sample media for users who want to preview features.
 */
export function createSampleDemoVideoProject(): VideoProject {
  const blank = createNewBlankVideoProject('SNAPEDIT Showcase', '16:9', '1080p', 30);
  const clipId1 = 'clip_' + Math.random().toString(36).substring(2, 8);
  const clipId2 = 'clip_' + Math.random().toString(36).substring(2, 8);
  const audioId = 'aud_' + Math.random().toString(36).substring(2, 8);

  return {
    ...blank,
    duration: 15,
    videoClips: [
      {
        id: clipId1,
        name: 'Cyberpunk Metropolis',
        src: SAMPLE_MEDIA_LIBRARY[0].src,
        type: 'video',
        trackIndex: 0,
        startOnTimeline: 0,
        duration: 8,
        trimStart: 0,
        trimEnd: 0,
        speed: 1,
        volume: 1,
        opacity: 1,
        posX: 0,
        posY: 0,
        scale: 1,
        rotation: 0,
        blendMode: 'source-over',
        flipH: false,
        flipV: false,
        transition: 'fade',
        transitionDuration: 0.5,
        animation: 'fadeIn',
        effect: 'cinematic',
        filter: 'cinematic',
        colorGrade: { brightness: 0, contrast: 10, saturation: 15 },
      },
      {
        id: clipId2,
        name: 'Alpine Lake Landscape',
        src: SAMPLE_MEDIA_LIBRARY[1].src,
        type: 'video',
        trackIndex: 0,
        startOnTimeline: 8,
        duration: 7,
        trimStart: 0,
        trimEnd: 0,
        speed: 1,
        volume: 0.8,
        opacity: 1,
        posX: 0,
        posY: 0,
        scale: 1,
        rotation: 0,
        blendMode: 'source-over',
        flipH: false,
        flipV: false,
        transition: 'zoom',
        transitionDuration: 0.5,
        animation: 'zoomIn',
        effect: 'glow',
        filter: 'warm',
        colorGrade: { brightness: 5, contrast: 5, saturation: 10 },
      },
    ],
    audioClips: [
      {
        id: audioId,
        name: 'Deep Forest Bonfire Beat',
        src: MUSIC_LIBRARY[0].src,
        trackIndex: 0,
        startOnTimeline: 0,
        duration: 15,
        trimStart: 0,
        volume: 0.7,
        muted: false,
        fadeIn: 1,
        fadeOut: 1.5,
      },
    ],
    subtitles: [
      {
        id: 'sub_1',
        text: 'SNAPEDIT – Professional Desktop Video Studio',
        startTime: 1,
        endTime: 5,
        fontFamily: 'Montserrat',
        fontSize: 42,
        color: '#ffffff',
        backgroundColor: 'rgba(0,0,0,0.7)',
        animation: 'pop',
        positionY: 82,
      },
    ],
    stickers: [
      {
        id: 'stk_demo',
        name: 'Fire Badge',
        content: '🔥',
        isImage: false,
        startOnTimeline: 2,
        duration: 4,
        posX: 85,
        posY: 20,
        scale: 1.5,
        rotation: 10,
        animation: 'bounce',
      },
    ],
    textOverlays: [
      {
        id: 'txt_demo',
        text: 'CREATE WITHOUT LIMITS',
        startOnTimeline: 0.5,
        duration: 4.5,
        fontFamily: 'Montserrat',
        fontSize: 52,
        color: '#1685ff',
        strokeColor: '#000000',
        strokeWidth: 4,
        posX: 0,
        posY: -180,
        scale: 1,
        rotation: 0,
        animation: 'pop',
      },
    ],
  };
}

// ----------------- SUBTITLE SRT PARSER & EXPORTER ----------------- //
function formatSrtTime(seconds: number): string {
  const pad = (n: number, z = 2) => ('00' + n).slice(-z);
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);
  return `${pad(hrs)}:${pad(mins)}:${pad(secs)},${pad(ms, 3)}`;
}

export function exportSubtitlesToSrt(subtitles: SubtitleItem[]): string {
  const sorted = [...subtitles].sort((a, b) => a.startTime - b.startTime);
  return sorted
    .map((sub, i) => {
      const idx = i + 1;
      const timing = `${formatSrtTime(sub.startTime)} --> ${formatSrtTime(sub.endTime)}`;
      return `${idx}\n${timing}\n${sub.text}\n`;
    })
    .join('\n');
}

export function parseSrtFile(srtContent: string): SubtitleItem[] {
  const items: SubtitleItem[] = [];
  const blocks = srtContent.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.split('\n');
    if (lines.length >= 3) {
      const timeMatch = lines[1].match(
        /(\d{2}):(\d{2}):(\d{2})[,.](\d{3})\s*-->\s*(\d{2}):(\d{2}):(\d{2})[,.](\d{3})/
      );
      if (timeMatch) {
        const startSec =
          parseInt(timeMatch[1]) * 3600 +
          parseInt(timeMatch[2]) * 60 +
          parseInt(timeMatch[3]) +
          parseInt(timeMatch[4]) / 1000;
        const endSec =
          parseInt(timeMatch[5]) * 3600 +
          parseInt(timeMatch[6]) * 60 +
          parseInt(timeMatch[7]) +
          parseInt(timeMatch[8]) / 1000;
        const text = lines.slice(2).join(' ');

        items.push({
          id: 'sub_' + Math.random().toString(36).substring(2, 7),
          text,
          startTime: startSec,
          endTime: endSec,
          fontFamily: 'Montserrat',
          fontSize: 36,
          color: '#ffffff',
          positionY: 82,
        });
      }
    }
  }
  return items;
}

// ----------------- KEYFRAME INTERPOLATION HELPER ----------------- //
function interpolateKeyframes(
  clip: VideoClip,
  relativeTime: number
): { x: number; y: number; scale: number; opacity: number; rotation: number } {
  const base = {
    x: clip.posX || 0,
    y: clip.posY || 0,
    scale: clip.scale || 1,
    opacity: clip.opacity ?? 1,
    rotation: clip.rotation || 0,
  };

  if (!clip.keyframes || clip.keyframes.length === 0) {
    return base;
  }

  const sorted = [...clip.keyframes].sort((a, b) => a.time - b.time);
  if (relativeTime <= sorted[0].time) {
    return {
      x: sorted[0].posX,
      y: sorted[0].posY,
      scale: sorted[0].scale,
      opacity: sorted[0].opacity,
      rotation: sorted[0].rotation,
    };
  }

  if (relativeTime >= sorted[sorted.length - 1].time) {
    const last = sorted[sorted.length - 1];
    return {
      x: last.posX,
      y: last.posY,
      scale: last.scale,
      opacity: last.opacity,
      rotation: last.rotation,
    };
  }

  // Find surrounding keyframes
  for (let i = 0; i < sorted.length - 1; i++) {
    const kf1 = sorted[i];
    const kf2 = sorted[i + 1];
    if (relativeTime >= kf1.time && relativeTime <= kf2.time) {
      const t = (relativeTime - kf1.time) / (kf2.time - kf1.time || 1);
      return {
        x: kf1.posX + (kf2.posX - kf1.posX) * t,
        y: kf1.posY + (kf2.posY - kf1.posY) * t,
        scale: kf1.scale + (kf2.scale - kf1.scale) * t,
        opacity: kf1.opacity + (kf2.opacity - kf1.opacity) * t,
        rotation: kf1.rotation + (kf2.rotation - kf1.rotation) * t,
      };
    }
  }

  return base;
}

// ----------------- RENDER VIDEO FRAME ON CANVAS ----------------- //
export function renderVideoFrame(
  ctx: CanvasRenderingContext2D,
  project: VideoProject,
  currentTime: number,
  videoElementsMap: Map<string, HTMLVideoElement>,
  imageElementsMap: Map<string, HTMLImageElement>
): void {
  const { width, height } = project;

  // 1. Pure Black or Custom Background Fill (Requirement 4)
  ctx.fillStyle = project.backgroundColor || '#000000';
  ctx.fillRect(0, 0, width, height);

  // If project has no clips, render elegant center guidelines / black canvas marker
  if (project.videoClips.length === 0 && (!project.textOverlays || project.textOverlays.length === 0)) {
    ctx.strokeStyle = '#222222';
    ctx.setLineDash([8, 8]);
    ctx.strokeRect(40, 40, width - 80, height - 80);
    ctx.setLineDash([]);
    return;
  }

  // 2. Render Video Tracks in track order (Track 0 main, Track 1 PIP overlay, etc.)
  const activeClips = project.videoClips.filter(
    (c) => currentTime >= c.startOnTimeline && currentTime <= c.startOnTimeline + c.duration
  );
  activeClips.sort((a, b) => a.trackIndex - b.trackIndex);

  for (const clip of activeClips) {
    const elapsed = currentTime - clip.startOnTimeline;
    const clipOffset = elapsed * (clip.speed || 1) + (clip.trimStart || 0);

    ctx.save();

    // Keyframe Interpolation
    const kf = interpolateKeyframes(clip, elapsed);
    ctx.globalAlpha = Math.max(0, Math.min(1, kf.opacity));
    ctx.globalCompositeOperation = clip.blendMode || 'source-over';

    // Filters and Color Grading
    const filterParts: string[] = [];
    if (clip.colorGrade.brightness !== 0) {
      filterParts.push(`brightness(${100 + clip.colorGrade.brightness}%)`);
    }
    if (clip.colorGrade.contrast !== 0) {
      filterParts.push(`contrast(${100 + clip.colorGrade.contrast}%)`);
    }
    if (clip.colorGrade.saturation !== 0) {
      filterParts.push(`saturate(${100 + clip.colorGrade.saturation}%)`);
    }

    // Preset Filter CSS
    if (clip.filter && clip.filter !== 'none') {
      const foundFilter = VIDEO_FILTERS_LIST.find((f) => f.id === clip.filter);
      if (foundFilter && foundFilter.cssFilter !== 'none') {
        filterParts.push(foundFilter.cssFilter);
      }
    }

    // Video Effects
    if (clip.effect === 'cinematic') {
      filterParts.push('contrast(125%) saturate(120%)');
    } else if (clip.effect === 'bw') {
      filterParts.push('grayscale(100%) contrast(140%)');
    } else if (clip.effect === 'cyberpunk') {
      filterParts.push('hue-rotate(180deg) saturate(160%)');
    } else if (clip.effect === 'glow') {
      filterParts.push('brightness(115%) contrast(115%) drop-shadow(0 0 15px rgba(22,133,255,0.6))');
    } else if (clip.effect === 'motionBlur') {
      filterParts.push('blur(3px)');
    } else if (clip.effect === 'vhs') {
      filterParts.push('contrast(120%) saturate(130%) sepia(20%)');
    }

    if (filterParts.length > 0) {
      ctx.filter = filterParts.join(' ');
    }

    // Animation & Transition calculations
    let animScale = kf.scale;
    let animTranslateX = kf.x;
    let animTranslateY = kf.y;
    let animRotation = kf.rotation;

    const animDur = 0.5;
    if (elapsed < animDur) {
      const t = elapsed / animDur;
      if (clip.animation === 'fadeIn') {
        ctx.globalAlpha *= t;
      } else if (clip.animation === 'zoomIn') {
        animScale *= 0.7 + 0.3 * t;
      } else if (clip.animation === 'slideIn') {
        animTranslateY += (1 - t) * (height * 0.4);
      } else if (clip.animation === 'popIn') {
        const elastic = Math.sin(t * Math.PI * 1.5) * (1 - t) * 0.4;
        animScale *= 1 + elastic;
      } else if (clip.animation === 'bounce') {
        animScale *= 1 + Math.sin(t * Math.PI) * 0.2;
      }
    }

    // Out Animation
    const remainingTime = clip.duration - elapsed;
    if (remainingTime < animDur) {
      const t = remainingTime / animDur;
      if (clip.animation === 'fadeOut') {
        ctx.globalAlpha *= t;
      } else if (clip.animation === 'zoomOut') {
        animScale *= 0.5 + 0.5 * t;
      } else if (clip.animation === 'slideOut') {
        animTranslateY += (1 - t) * (height * 0.4);
      }
    }

    // Transitions
    const transDur = clip.transitionDuration || 0.5;
    if (elapsed < transDur && clip.transition !== 'none') {
      const transT = elapsed / transDur;
      if (clip.transition === 'fade') {
        ctx.globalAlpha *= transT;
      } else if (clip.transition === 'zoom') {
        animScale *= 1.4 - 0.4 * transT;
      } else if (clip.transition === 'slide') {
        animTranslateX += (1 - transT) * width;
      } else if (clip.transition === 'push') {
        animTranslateX -= (1 - transT) * width;
      } else if (clip.transition === 'spin') {
        animRotation += (1 - transT) * 180;
      }
    }

    // Canvas Transformation Center
    ctx.translate(width / 2 + animTranslateX, height / 2 + animTranslateY);
    if (animRotation !== 0) ctx.rotate((animRotation * Math.PI) / 180);
    if (clip.flipH || clip.flipV) ctx.scale(clip.flipH ? -1 : 1, clip.flipV ? -1 : 1);
    if (animScale !== 1) ctx.scale(animScale, animScale);
    ctx.translate(-width / 2, -height / 2);

    // Draw Media
    if (clip.type === 'video') {
      const vEl = videoElementsMap.get(clip.id);
      if (vEl && vEl.readyState >= 2) {
        if (Math.abs(vEl.currentTime - clipOffset) > 0.35) {
          vEl.currentTime = clipOffset;
        }
        ctx.drawImage(vEl, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#141414';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#1685ff';
        ctx.font = 'bold 36px Montserrat, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(clip.name, width / 2, height / 2);
      }
    } else {
      // Image Clip or Freeze Frame
      const imgEl = imageElementsMap.get(clip.id);
      if (imgEl && imgEl.complete) {
        ctx.drawImage(imgEl, 0, 0, width, height);
      } else {
        ctx.fillStyle = '#1e1e1e';
        ctx.fillRect(0, 0, width, height);
      }
    }

    // VHS Scanline overlay effect simulation
    if (clip.effect === 'vhs') {
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      for (let y = 0; y < height; y += 4) {
        ctx.fillRect(0, y, width, 1.5);
      }
    }

    ctx.restore();
  }

  // 3. Render Stickers Track
  if (project.stickers) {
    const activeStickers = project.stickers.filter(
      (s) => currentTime >= s.startOnTimeline && currentTime <= s.startOnTimeline + s.duration
    );
    for (const stk of activeStickers) {
      ctx.save();
      const posX = (width * stk.posX) / 100;
      const posY = (height * stk.posY) / 100;
      const elapsed = currentTime - stk.startOnTimeline;

      ctx.translate(posX, posY);
      if (stk.rotation !== 0) ctx.rotate((stk.rotation * Math.PI) / 180);

      let scale = stk.scale || 1;
      if (stk.animation === 'bounce') {
        scale *= 1 + Math.sin(elapsed * 4) * 0.15;
      } else if (stk.animation === 'pulse') {
        scale *= 1 + Math.sin(elapsed * 6) * 0.1;
      } else if (stk.animation === 'spin') {
        ctx.rotate(elapsed * 2);
      }

      ctx.scale(scale, scale);

      if (stk.isImage) {
        const img = new Image();
        img.src = stk.content;
        if (img.complete) {
          ctx.drawImage(img, -64, -64, 128, 128);
        }
      } else {
        ctx.font = '64px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 10;
        ctx.fillText(stk.content, 0, 0);
      }
      ctx.restore();
    }
  }

  // 4. Render Text Overlays Track
  if (project.textOverlays) {
    const activeTexts = project.textOverlays.filter(
      (t) => currentTime >= t.startOnTimeline && currentTime <= t.startOnTimeline + t.duration
    );
    for (const txt of activeTexts) {
      ctx.save();
      const posX = width / 2 + (txt.posX || 0);
      const posY = height / 2 + (txt.posY || 0);
      const elapsed = currentTime - txt.startOnTimeline;

      ctx.translate(posX, posY);
      if (txt.rotation) ctx.rotate((txt.rotation * Math.PI) / 180);

      let textScale = txt.scale || 1;
      if (txt.animation === 'pop') {
        const t = Math.min(1, elapsed / 0.4);
        textScale *= 0.5 + 0.5 * Math.sin(t * (Math.PI / 2));
      } else if (txt.animation === 'glow') {
        ctx.shadowColor = txt.shadowColor || txt.color;
        ctx.shadowBlur = 15 + Math.sin(elapsed * 4) * 8;
      }
      ctx.scale(textScale, textScale);

      ctx.font = `bold ${txt.fontSize || 48}px "${txt.fontFamily || 'Montserrat'}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // Typewriter effect
      let displayText = txt.text;
      if (txt.animation === 'typewriter') {
        const charsToShow = Math.floor(elapsed * 18);
        displayText = txt.text.slice(0, Math.max(1, charsToShow));
      }

      // Stroke outline
      if (txt.strokeColor && txt.strokeWidth) {
        ctx.strokeStyle = txt.strokeColor;
        ctx.lineWidth = txt.strokeWidth;
        ctx.strokeText(displayText, 0, 0);
      }

      // Drop Shadow
      if (txt.shadowColor) {
        ctx.shadowColor = txt.shadowColor;
        ctx.shadowBlur = txt.shadowBlur || 10;
      }

      ctx.fillStyle = txt.color || '#ffffff';
      ctx.fillText(displayText, 0, 0);
      ctx.restore();
    }
  }

  // 5. Render Captions / Subtitles
  const activeSub = project.subtitles.find(
    (s) => currentTime >= s.startTime && currentTime <= s.endTime
  );

  if (activeSub) {
    ctx.save();
    const subY = (height * (activeSub.positionY || 82)) / 100;
    ctx.font = `bold ${activeSub.fontSize || 38}px "${activeSub.fontFamily || 'Montserrat'}", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const textWidth = ctx.measureText(activeSub.text).width;
    const paddingX = 24;
    const paddingY = 12;

    if (activeSub.backgroundColor) {
      ctx.fillStyle = activeSub.backgroundColor;
      ctx.beginPath();
      ctx.roundRect(
        width / 2 - textWidth / 2 - paddingX,
        subY - (activeSub.fontSize || 38) / 2 - paddingY,
        textWidth + paddingX * 2,
        (activeSub.fontSize || 38) + paddingY * 2,
        8
      );
      ctx.fill();
    }

    ctx.shadowColor = 'rgba(0,0,0,0.85)';
    ctx.shadowBlur = 8;
    ctx.shadowOffsetY = 2;

    if (activeSub.strokeColor && activeSub.strokeWidth) {
      ctx.strokeStyle = activeSub.strokeColor;
      ctx.lineWidth = activeSub.strokeWidth;
      ctx.strokeText(activeSub.text, width / 2, subY);
    }

    ctx.fillStyle = activeSub.color || '#ffffff';
    ctx.fillText(activeSub.text, width / 2, subY);
    ctx.restore();
  }
}
