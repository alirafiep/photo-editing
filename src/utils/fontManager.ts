import { saveCustomFont, getAllCustomFonts, CustomFontRecord } from './indexedDB';

export interface FontItem {
  name: string;
  category: 'sans-serif' | 'serif' | 'display' | 'handwriting' | 'monospace' | 'custom';
  isCustom?: boolean;
}

export const SYSTEM_FONTS: FontItem[] = [
  { name: 'Plus Jakarta Sans', category: 'sans-serif' },
  { name: 'Roboto', category: 'sans-serif' },
  { name: 'Montserrat', category: 'sans-serif' },
  { name: 'Playfair Display', category: 'serif' },
  { name: 'Oswald', category: 'display' },
  { name: 'Caveat', category: 'handwriting' },
  { name: 'JetBrains Mono', category: 'monospace' },
  { name: 'Georgia', category: 'serif' },
  { name: 'Arial', category: 'sans-serif' },
  { name: 'Courier New', category: 'monospace' },
  { name: 'Times New Roman', category: 'serif' },
  { name: 'Trebuchet MS', category: 'sans-serif' },
  { name: 'Impact', category: 'display' },
];

// In-memory cache of loaded custom fonts
let loadedCustomFonts: FontItem[] = [];

export async function initCustomFonts(): Promise<FontItem[]> {
  try {
    const saved = await getAllCustomFonts();
    const loadedList: FontItem[] = [];

    for (const fontRecord of saved) {
      try {
        const fontFace = new FontFace(
          fontRecord.name,
          `url(${fontRecord.dataUrl}) format('${fontRecord.format}')`
        );
        const loaded = await fontFace.load();
        document.fonts.add(loaded);
        loadedList.push({ name: fontRecord.name, category: 'custom', isCustom: true });
      } catch (err) {
        console.warn(`Could not load custom font ${fontRecord.name}:`, err);
      }
    }
    loadedCustomFonts = loadedList;
    return loadedList;
  } catch (err) {
    console.error('Error initializing custom fonts:', err);
    return [];
  }
}

export async function importCustomFontFile(file: File): Promise<FontItem> {
  const ext = file.name.split('.').pop()?.toLowerCase();
  let format: 'truetype' | 'opentype' | 'woff2' = 'truetype';
  if (ext === 'otf') format = 'opentype';
  if (ext === 'woff2') format = 'woff2';

  const fontName = file.name.replace(/\.[^/.]+$/, '').trim();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const dataUrl = e.target?.result as string;
        const fontFace = new FontFace(fontName, `url(${dataUrl}) format('${format}')`);
        const loaded = await fontFace.load();
        document.fonts.add(loaded);

        const record: CustomFontRecord = {
          name: fontName,
          dataUrl,
          format,
          addedAt: Date.now(),
        };
        await saveCustomFont(record);

        const item: FontItem = { name: fontName, category: 'custom', isCustom: true };
        loadedCustomFonts.push(item);
        resolve(item);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = (e) => reject(e);
    reader.readAsDataURL(file);
  });
}

export function getAllAvailableFonts(): FontItem[] {
  return [...SYSTEM_FONTS, ...loadedCustomFonts];
}
