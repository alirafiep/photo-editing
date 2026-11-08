export interface CanvasSizePreset {
  id: string;
  name: string;
  category: 'ISO Standard' | 'North America' | 'Social & Video' | 'Custom';
  widthMm?: number;
  heightMm?: number;
  widthIn?: number;
  heightIn?: number;
  defaultWidthPx: number; // calculated at 300 DPI or standard screen resolution
  defaultHeightPx: number;
  description: string;
}

export const CANVAS_PRESETS: CanvasSizePreset[] = [
  // ISO Paper Series (at 300 DPI)
  { id: 'a0', name: 'A0 Poster', category: 'ISO Standard', widthMm: 841, heightMm: 1189, defaultWidthPx: 9933, defaultHeightPx: 14043, description: '841 × 1189 mm' },
  { id: 'a1', name: 'A1 Plan', category: 'ISO Standard', widthMm: 594, heightMm: 841, defaultWidthPx: 7016, defaultHeightPx: 9933, description: '594 × 841 mm' },
  { id: 'a2', name: 'A2 Art Print', category: 'ISO Standard', widthMm: 420, heightMm: 594, defaultWidthPx: 4960, defaultHeightPx: 7016, description: '420 × 594 mm' },
  { id: 'a3', name: 'A3 Ledger', category: 'ISO Standard', widthMm: 297, heightMm: 420, defaultWidthPx: 3508, defaultHeightPx: 4960, description: '297 × 420 mm' },
  { id: 'a4', name: 'A4 Document', category: 'ISO Standard', widthMm: 210, heightMm: 297, defaultWidthPx: 2480, defaultHeightPx: 3508, description: '210 × 297 mm · Standard Letter' },
  { id: 'a5', name: 'A5 Notebook', category: 'ISO Standard', widthMm: 148, heightMm: 210, defaultWidthPx: 1748, defaultHeightPx: 2480, description: '148 × 210 mm · Flyer / Booklet' },
  { id: 'a6', name: 'A6 Postcard', category: 'ISO Standard', widthMm: 105, heightMm: 148, defaultWidthPx: 1240, defaultHeightPx: 1748, description: '105 × 148 mm · Photo Postcard' },

  // North America
  { id: 'letter', name: 'US Letter', category: 'North America', widthIn: 8.5, heightIn: 11, defaultWidthPx: 2550, defaultHeightPx: 3300, description: '8.5 × 11 in (300 DPI)' },
  { id: 'legal', name: 'US Legal', category: 'North America', widthIn: 8.5, heightIn: 14, defaultWidthPx: 2550, defaultHeightPx: 4200, description: '8.5 × 14 in (300 DPI)' },
  { id: 'tabloid', name: 'Tabloid / 11×17', category: 'North America', widthIn: 11, heightIn: 17, defaultWidthPx: 3300, defaultHeightPx: 5100, description: '11 × 17 in (300 DPI)' },

  // Social & Video
  { id: 'instagram_post', name: 'Instagram Square Post', category: 'Social & Video', defaultWidthPx: 1080, defaultHeightPx: 1080, description: '1:1 Ratio · 1080 × 1080 px' },
  { id: 'instagram_story', name: 'Instagram Story / Reel', category: 'Social & Video', defaultWidthPx: 1080, defaultHeightPx: 1920, description: '9:16 Vertical · 1080 × 1920 px' },
  { id: 'youtube_thumb', name: 'YouTube Thumbnail', category: 'Social & Video', defaultWidthPx: 1280, defaultHeightPx: 720, description: '16:9 HD · 1280 × 720 px' },
  { id: 'full_hd', name: 'Full HD Wallpaper', category: 'Social & Video', defaultWidthPx: 1920, defaultHeightPx: 1080, description: '16:9 Full HD · 1920 × 1080 px' },
];

export function calculatePxFromUnit(
  value: number,
  unit: 'px' | 'in' | 'mm',
  dpi: number = 300
): number {
  if (unit === 'px') return Math.round(value);
  if (unit === 'in') return Math.round(value * dpi);
  if (unit === 'mm') return Math.round((value / 25.4) * dpi);
  return Math.round(value);
}

export function calculateUnitFromPx(
  px: number,
  unit: 'px' | 'in' | 'mm',
  dpi: number = 300
): number {
  if (unit === 'px') return px;
  if (unit === 'in') return Math.round((px / dpi) * 100) / 100;
  if (unit === 'mm') return Math.round(((px * 25.4) / dpi) * 10) / 10;
  return px;
}
