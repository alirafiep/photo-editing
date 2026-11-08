import { PhotoProject as Project, DEFAULT_ADJUSTMENTS } from '../types/editor';

export interface SampleTemplate {
  id: string;
  title: string;
  category: string;
  imageSrc: string;
  width: number;
  height: number;
  description: string;
}

export const SAMPLE_PROJECTS: SampleTemplate[] = [
  {
    id: 'sample-portrait',
    title: 'Studio Portrait Editorial',
    category: 'Portrait',
    imageSrc: '/src/assets/images/sample_portrait_model_1794099853081.jpg',
    width: 1200,
    height: 900,
    description: 'High-fashion editorial portrait with natural soft window lighting and dark backdrop.',
  },
  {
    id: 'sample-cyberpunk',
    title: 'Cyberpunk Neon Metropolis',
    category: 'Cinematic',
    imageSrc: '/src/assets/images/sample_cyberpunk_city_1794099852386.jpg',
    width: 1600,
    height: 900,
    description: 'Futuristic night street with glowing holograms, reflections, and deep neon tones.',
  },
  {
    id: 'sample-landscape',
    title: 'Alpine Lake Sunrise',
    category: 'Landscape',
    imageSrc: '/src/assets/images/sample_mountain_landscape_1794099854545.jpg',
    width: 1600,
    height: 900,
    description: 'Misty mountain peaks with pine forest reflections in a crystal turquoise lake.',
  },
  {
    id: 'sample-product',
    title: 'Designer Sneaker Studio',
    category: 'Commercial',
    imageSrc: '/src/assets/images/sample_product_sneaker_1794099853226.jpg',
    width: 1200,
    height: 900,
    description: 'Commercial studio product shot ideal for background removal and branding overlays.',
  },
];

export function createProjectFromSample(sample: SampleTemplate): Project {
  const layerId = 'layer_' + Math.random().toString(36).substring(2, 9);
  return {
    id: 'proj_' + Math.random().toString(36).substring(2, 9),
    type: 'photo',
    name: sample.title,
    width: sample.width,
    height: sample.height,
    dpi: 300,
    zoom: 1,
    panX: 0,
    panY: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    selectedLayerId: layerId,
    layers: [
      {
        id: layerId,
        name: 'Background (' + sample.category + ')',
        type: 'image',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: 0,
        y: 0,
        width: sample.width,
        height: sample.height,
        rotation: 0,
        flipH: false,
        flipV: false,
        dataUrl: sample.imageSrc,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        filter: null,
      },
    ],
  };
}

export function createBlankProject(
  name: string,
  width: number,
  height: number,
  bgColor: string = '#ffffff'
): Project {
  const layerId = 'layer_' + Math.random().toString(36).substring(2, 9);

  // Create solid white or transparent background canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (ctx && bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);
  }

  return {
    id: 'proj_' + Math.random().toString(36).substring(2, 9),
    type: 'photo',
    name: name || 'Untitled Document',
    width,
    height,
    dpi: 300,
    zoom: 1,
    panX: 0,
    panY: 0,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    selectedLayerId: layerId,
    layers: [
      {
        id: layerId,
        name: 'Background',
        type: 'image',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: 0,
        y: 0,
        width,
        height,
        rotation: 0,
        flipH: false,
        flipV: false,
        dataUrl: canvas.toDataURL('image/png'),
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        filter: null,
      },
    ],
  };
}
