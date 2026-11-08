import { Layer, LayerAdjustments, SelectionArea } from '../types/editor';

// Cache for loaded HTMLImageElements
const imageElementCache = new Map<string, HTMLImageElement>();

export function getCachedImage(src: string): Promise<HTMLImageElement> {
  if (imageElementCache.has(src)) {
    const cached = imageElementCache.get(src)!;
    if (cached.complete) return Promise.resolve(cached);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageElementCache.set(src, img);
      resolve(img);
    };
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// Preset filter definitions
export interface FilterPreset {
  id: string;
  name: string;
  category: string;
  adjustments: Partial<LayerAdjustments>;
}

export const FILTER_PRESETS: FilterPreset[] = [
  // Cinematic
  {
    id: 'cinematic_teal_orange',
    name: 'Teal & Orange',
    category: 'Cinematic',
    adjustments: { contrast: 25, saturation: 20, temperature: 15, tint: -10, shadows: -15, highlights: 10, vignette: 18 },
  },
  {
    id: 'cinematic_moody_noir',
    name: 'Moody Noir',
    category: 'Cinematic',
    adjustments: { contrast: 35, saturation: -30, brightness: -10, exposure: -5, shadows: -25, vignette: 30 },
  },
  {
    id: 'cinematic_cyberpunk',
    name: 'Cyberpunk',
    category: 'Cinematic',
    adjustments: { contrast: 30, saturation: 45, temperature: -20, tint: 25, sharpness: 30, vignette: 15 },
  },
  {
    id: 'cinematic_golden_hour',
    name: 'Golden Hour',
    category: 'Cinematic',
    adjustments: { brightness: 5, contrast: 15, saturation: 25, temperature: 35, highlights: 10, vignette: 12 },
  },
  // Vintage
  {
    id: 'vintage_sepia_1970',
    name: 'Sepia 1970',
    category: 'Vintage',
    adjustments: { sepia: 85, contrast: 15, saturation: -20, temperature: 25, vignette: 25 },
  },
  {
    id: 'vintage_kodachrome',
    name: 'Kodachrome',
    category: 'Vintage',
    adjustments: { contrast: 25, saturation: 35, temperature: 10, sharpness: 20, vignette: 10 },
  },
  {
    id: 'vintage_polaroid',
    name: 'Polaroid',
    category: 'Vintage',
    adjustments: { brightness: 8, contrast: -10, saturation: -15, temperature: 15, tint: -8, vignette: 20 },
  },
  {
    id: 'vintage_retro_fade',
    name: 'Retro Fade',
    category: 'Vintage',
    adjustments: { brightness: 10, contrast: -20, saturation: -25, shadows: 25, sepia: 20 },
  },
  // Portrait
  {
    id: 'portrait_soft_glow',
    name: 'Soft Glamour',
    category: 'Portrait',
    adjustments: { brightness: 10, contrast: -10, saturation: 10, temperature: 8, blur: 2, highlights: 15 },
  },
  {
    id: 'portrait_warm_skin',
    name: 'Warm Skin',
    category: 'Portrait',
    adjustments: { brightness: 5, contrast: 10, saturation: 12, temperature: 18, tint: 5, sharpness: 15 },
  },
  {
    id: 'portrait_high_key',
    name: 'High Key',
    category: 'Portrait',
    adjustments: { brightness: 25, exposure: 20, contrast: -15, saturation: -10, highlights: 25 },
  },
  // Landscape
  {
    id: 'landscape_vibrant',
    name: 'Vibrant Nature',
    category: 'Landscape',
    adjustments: { contrast: 20, saturation: 40, sharpness: 35, exposure: 5, highlights: -10, shadows: 15 },
  },
  {
    id: 'landscape_sunset',
    name: 'Sunset Glow',
    category: 'Landscape',
    adjustments: { contrast: 20, saturation: 35, temperature: 40, tint: 15, vignette: 15 },
  },
  {
    id: 'landscape_forest',
    name: 'Forest Emerald',
    category: 'Landscape',
    adjustments: { contrast: 15, saturation: 25, temperature: -10, tint: -15, sharpness: 20 },
  },
  // Black & White
  {
    id: 'bw_silver_gelatin',
    name: 'Silver Gelatin',
    category: 'Black & White',
    adjustments: { grayscale: 100, contrast: 30, sharpness: 20, shadows: -10, highlights: 15 },
  },
  {
    id: 'bw_high_contrast',
    name: 'High Contrast Mono',
    category: 'Black & White',
    adjustments: { grayscale: 100, contrast: 60, exposure: 10, shadows: -30, sharpness: 30 },
  },
  {
    id: 'bw_matte_dark',
    name: 'Matte Dark',
    category: 'Black & White',
    adjustments: { grayscale: 100, contrast: -10, brightness: -5, shadows: 20, vignette: 25 },
  },
  // Warm & Cool
  {
    id: 'wc_golden_amber',
    name: 'Golden Amber',
    category: 'Warm & Cool',
    adjustments: { temperature: 50, saturation: 20, brightness: 5 },
  },
  {
    id: 'wc_arctic_blue',
    name: 'Arctic Chill',
    category: 'Warm & Cool',
    adjustments: { temperature: -50, tint: -10, contrast: 15, saturation: 10 },
  },
  {
    id: 'wc_rose_tint',
    name: 'Rose Tint',
    category: 'Warm & Cool',
    adjustments: { tint: 45, temperature: 15, saturation: 15 },
  },
  // Artistic
  {
    id: 'artistic_duotone_neon',
    name: 'Duotone Neon',
    category: 'Artistic',
    adjustments: { contrast: 40, saturation: 60, temperature: -30, tint: 50, vignette: 20 },
  },
  {
    id: 'artistic_dramatic_hdr',
    name: 'Dramatic HDR',
    category: 'Artistic',
    adjustments: { contrast: 40, saturation: 30, sharpness: 50, highlights: -30, shadows: 40 },
  },
];

// Apply pixel adjustments directly to ImageData
export function applyAdjustmentsToImageData(
  imageData: ImageData,
  adj: LayerAdjustments
): void {
  const data = imageData.data;
  const len = data.length;
  const width = imageData.width;
  const height = imageData.height;

  const hasAdjustments =
    adj.brightness !== 0 ||
    adj.contrast !== 0 ||
    adj.saturation !== 0 ||
    adj.exposure !== 0 ||
    adj.temperature !== 0 ||
    adj.tint !== 0 ||
    adj.highlights !== 0 ||
    adj.shadows !== 0 ||
    adj.vignette !== 0 ||
    adj.sepia !== 0 ||
    adj.grayscale !== 0 ||
    adj.invert !== 0;

  if (!hasAdjustments) return;

  // Precompute adjustment multipliers
  const bMult = adj.brightness * 2.55;
  const cFactor = (259 * (adj.contrast + 255)) / (255 * (259 - adj.contrast));
  const expMult = Math.pow(2, adj.exposure / 50);
  const satMult = (adj.saturation + 100) / 100;
  const tempR = adj.temperature > 0 ? adj.temperature * 1.2 : 0;
  const tempB = adj.temperature < 0 ? -adj.temperature * 1.2 : 0;
  const tintG = adj.tint < 0 ? -adj.tint * 1.0 : 0;
  const tintM = adj.tint > 0 ? adj.tint * 1.0 : 0;
  const sepiaNorm = adj.sepia / 100;
  const grayNorm = adj.grayscale / 100;
  const invNorm = adj.invert / 100;
  const shadowAdj = adj.shadows / 100;
  const highlightAdj = adj.highlights / 100;

  const cx = width / 2;
  const cy = height / 2;
  const maxDist = Math.sqrt(cx * cx + cy * cy);
  const vigFactor = adj.vignette / 100;

  for (let i = 0; i < len; i += 4) {
    if (data[i + 3] === 0) continue; // Skip fully transparent pixels

    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Exposure
    if (adj.exposure !== 0) {
      r *= expMult;
      g *= expMult;
      b *= expMult;
    }

    // Brightness
    if (adj.brightness !== 0) {
      r += bMult;
      g += bMult;
      b += bMult;
    }

    // Contrast
    if (adj.contrast !== 0) {
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      b = cFactor * (b - 128) + 128;
    }

    // Highlights and Shadows
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    if (adj.shadows !== 0 && lum < 128) {
      const sRatio = (1 - lum / 128) * shadowAdj * 60;
      r += sRatio;
      g += sRatio;
      b += sRatio;
    }
    if (adj.highlights !== 0 && lum >= 128) {
      const hRatio = ((lum - 128) / 127) * highlightAdj * 60;
      r += hRatio;
      g += hRatio;
      b += hRatio;
    }

    // Temperature & Tint
    if (adj.temperature !== 0) {
      r += tempR;
      b += tempB;
    }
    if (adj.tint !== 0) {
      g += tintG;
      r += tintM * 0.5;
      b += tintM * 0.5;
    }

    // Saturation
    if (adj.saturation !== 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * satMult;
      g = gray + (g - gray) * satMult;
      b = gray + (b - gray) * satMult;
    }

    // Grayscale
    if (adj.grayscale > 0) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = r * (1 - grayNorm) + gray * grayNorm;
      g = g * (1 - grayNorm) + gray * grayNorm;
      b = b * (1 - grayNorm) + gray * grayNorm;
    }

    // Sepia
    if (adj.sepia > 0) {
      const sr = r * 0.393 + g * 0.769 + b * 0.189;
      const sg = r * 0.349 + g * 0.686 + b * 0.168;
      const sb = r * 0.272 + g * 0.534 + b * 0.131;
      r = r * (1 - sepiaNorm) + sr * sepiaNorm;
      g = g * (1 - sepiaNorm) + sg * sepiaNorm;
      b = b * (1 - sepiaNorm) + sb * sepiaNorm;
    }

    // Invert
    if (adj.invert > 0) {
      r = r * (1 - invNorm) + (255 - r) * invNorm;
      g = g * (1 - invNorm) + (255 - g) * invNorm;
      b = b * (1 - invNorm) + (255 - b) * invNorm;
    }

    // Vignette
    if (adj.vignette > 0) {
      const pixelIdx = i / 4;
      const px = pixelIdx % width;
      const py = Math.floor(pixelIdx / width);
      const dx = px - cx;
      const dy = py - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const vig = Math.max(0, 1 - (dist / maxDist) * vigFactor * 1.2);
      r *= vig;
      g *= vig;
      b *= vig;
    }

    // Clamp
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }
}

// Render individual layer onto target canvas context
export async function renderLayer(
  ctx: CanvasRenderingContext2D,
  layer: Layer
): Promise<void> {
  if (!layer.visible || layer.opacity <= 0) return;

  ctx.save();
  ctx.globalAlpha = layer.opacity;
  ctx.globalCompositeOperation = layer.blendMode || 'source-over';

  // Apply layer transform: translate to center, rotate, scale/flip, translate back
  const cx = layer.x + layer.width / 2;
  const cy = layer.y + layer.height / 2;

  ctx.translate(cx, cy);
  if (layer.rotation) {
    ctx.rotate((layer.rotation * Math.PI) / 180);
  }
  ctx.scale(layer.flipH ? -1 : 1, layer.flipV ? -1 : 1);
  ctx.translate(-cx, -cy);

  // Render layer content based on type
  if ((layer.type === 'image' || layer.type === 'paint') && layer.dataUrl) {
    try {
      const img = await getCachedImage(layer.dataUrl);

      // Create offscreen canvas to process adjustments if needed
      const hasAdj =
        layer.adjustments.brightness !== 0 ||
        layer.adjustments.contrast !== 0 ||
        layer.adjustments.saturation !== 0 ||
        layer.adjustments.exposure !== 0 ||
        layer.adjustments.temperature !== 0 ||
        layer.adjustments.tint !== 0 ||
        layer.adjustments.highlights !== 0 ||
        layer.adjustments.shadows !== 0 ||
        layer.adjustments.vignette !== 0 ||
        layer.adjustments.sepia !== 0 ||
        layer.adjustments.grayscale !== 0 ||
        layer.adjustments.invert !== 0 ||
        layer.adjustments.blur > 0 ||
        layer.adjustments.sharpness > 0;

      if (hasAdj) {
        const offCanvas = document.createElement('canvas');
        offCanvas.width = img.width;
        offCanvas.height = img.height;
        const offCtx = offCanvas.getContext('2d');
        if (offCtx) {
          // Sharpness/Blur CSS filter
          const filters: string[] = [];
          if (layer.adjustments.blur > 0) {
            filters.push(`blur(${layer.adjustments.blur}px)`);
          }
          if (filters.length > 0) {
            offCtx.filter = filters.join(' ');
          }

          offCtx.drawImage(img, 0, 0);
          offCtx.filter = 'none';

          const imgData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
          applyAdjustmentsToImageData(imgData, layer.adjustments);
          offCtx.putImageData(imgData, 0, 0);

          ctx.drawImage(offCanvas, layer.x, layer.y, layer.width, layer.height);
        } else {
          ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);
        }
      } else {
        ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);
      }
    } catch (err) {
      console.warn('Failed to draw layer image:', err);
    }
  } else if (layer.type === 'text' && layer.textConfig) {
    const tc = layer.textConfig;
    ctx.font = `${tc.italic ? 'italic ' : ''}${tc.bold ? 'bold ' : ''}${tc.fontSize}px "${tc.fontFamily}", system-ui, sans-serif`;
    ctx.textAlign = tc.align;
    ctx.textBaseline = 'middle';

    let textX = layer.x;
    if (tc.align === 'center') textX = layer.x + layer.width / 2;
    else if (tc.align === 'right') textX = layer.x + layer.width;

    const textY = layer.y + layer.height / 2;

    if (tc.shadowBlur > 0) {
      ctx.shadowColor = tc.shadowColor || 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = tc.shadowBlur;
    }

    if (tc.strokeWidth > 0 && tc.strokeColor) {
      ctx.strokeStyle = tc.strokeColor;
      ctx.lineWidth = tc.strokeWidth;
      ctx.strokeText(tc.text, textX, textY);
    }

    ctx.fillStyle = tc.color || '#ffffff';
    ctx.fillText(tc.text, textX, textY);

    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  } else if (layer.type === 'shape' && layer.shapeConfig) {
    const sc = layer.shapeConfig;
    ctx.beginPath();

    const x = layer.x;
    const y = layer.y;
    const w = layer.width;
    const h = layer.height;

    switch (sc.shapeType) {
      case 'rectangle':
        ctx.rect(x, y, w, h);
        break;
      case 'rounded-rect': {
        const rad = Math.min(sc.cornerRadius || 12, w / 2, h / 2);
        ctx.roundRect(x, y, w, h, rad);
        break;
      }
      case 'circle':
        ctx.ellipse(x + w / 2, y + h / 2, Math.abs(w / 2), Math.abs(h / 2), 0, 0, Math.PI * 2);
        break;
      case 'star': {
        const points = 5;
        const outerRadius = Math.min(w, h) / 2;
        const innerRadius = outerRadius * 0.45;
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        for (let i = 0; i < points * 2; i++) {
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / points - Math.PI / 2;
          const px = centerX + r * Math.cos(angle);
          const py = centerY + r * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }
      case 'polygon': {
        const sides = sc.sides || 6;
        const radius = Math.min(w, h) / 2;
        const centerX = x + w / 2;
        const centerY = y + h / 2;
        for (let i = 0; i < sides; i++) {
          const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
          const px = centerX + radius * Math.cos(angle);
          const py = centerY + radius * Math.sin(angle);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        break;
      }
      case 'line':
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y + h);
        break;
      case 'arrow': {
        const headlen = 20;
        const angle = Math.atan2(h, w);
        ctx.moveTo(x, y);
        ctx.lineTo(x + w, y + h);
        ctx.lineTo(
          x + w - headlen * Math.cos(angle - Math.PI / 6),
          y + h - headlen * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(x + w, y + h);
        ctx.lineTo(
          x + w - headlen * Math.cos(angle + Math.PI / 6),
          y + h - headlen * Math.sin(angle + Math.PI / 6)
        );
        break;
      }
    }

    if (sc.fillColor && sc.shapeType !== 'line' && sc.shapeType !== 'arrow') {
      ctx.fillStyle = sc.fillColor;
      ctx.fill();
    }
    if (sc.strokeWidth > 0 && sc.strokeColor) {
      ctx.strokeStyle = sc.strokeColor;
      ctx.lineWidth = sc.strokeWidth;
      ctx.stroke();
    }
  }

  ctx.restore();
}

// Perform instant client-side smart background removal (chroma / edge / threshold cutout)
export async function removeBackgroundLocally(dataUrl: string): Promise<string> {
  const img = await getCachedImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0);
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const width = canvas.width;
  const height = canvas.height;

  // Sample corner pixel colors to detect dominant background tone
  const corners = [
    0, // top-left
    (width - 1) * 4, // top-right
    ((height - 1) * width) * 4, // bottom-left
    ((height - 1) * width + (width - 1)) * 4, // bottom-right
  ];

  let bgR = 0, bgG = 0, bgB = 0;
  for (const c of corners) {
    bgR += data[c];
    bgG += data[c + 1];
    bgB += data[c + 2];
  }
  bgR /= 4;
  bgG /= 4;
  bgB /= 4;

  const threshold = 38;
  const feather = 18;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      const diff = Math.sqrt(
        Math.pow(r - bgR, 2) + Math.pow(g - bgG, 2) + Math.pow(b - bgB, 2)
      );

      if (diff < threshold) {
        data[idx + 3] = 0; // Transparent
      } else if (diff < threshold + feather) {
        // Soft edge feathering
        const alphaFactor = (diff - threshold) / feather;
        data[idx + 3] = Math.floor(data[idx + 3] * alphaFactor);
      }
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

// Perform instant content-aware fill / object removal on selected area
export async function inpaintObjectLocally(
  dataUrl: string,
  selection: SelectionArea,
  layerX: number,
  layerY: number
): Promise<string> {
  const img = await getCachedImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;

  ctx.drawImage(img, 0, 0);

  // Convert canvas coordinates to layer image coordinates
  const selX = Math.max(0, Math.floor(selection.x - layerX));
  const selY = Math.max(0, Math.floor(selection.y - layerY));
  const selW = Math.min(canvas.width - selX, Math.floor(selection.width));
  const selH = Math.min(canvas.height - selY, Math.floor(selection.height));

  if (selW <= 0 || selH <= 0) return dataUrl;

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;
  const width = canvas.width;

  // Bilinear texture and color patch sampling surrounding border pixels
  const borderRing = 6;
  for (let y = selY; y < selY + selH; y++) {
    for (let x = selX; x < selX + selW; x++) {
      const u = (x - selX) / selW;
      const v = (y - selY) / selH;

      // Sample left, right, top, bottom boundary colors
      const leftX = Math.max(0, selX - borderRing);
      const rightX = Math.min(width - 1, selX + selW + borderRing);
      const topY = Math.max(0, selY - borderRing);
      const botY = Math.min(canvas.height - 1, selY + selH + borderRing);

      const lIdx = (y * width + leftX) * 4;
      const rIdx = (y * width + rightX) * 4;
      const tIdx = (topY * width + x) * 4;
      const bIdx = (botY * width + x) * 4;

      const horizR = data[lIdx] * (1 - u) + data[rIdx] * u;
      const horizG = data[lIdx + 1] * (1 - u) + data[rIdx + 1] * u;
      const horizB = data[lIdx + 2] * (1 - u) + data[rIdx + 2] * u;

      const vertR = data[tIdx] * (1 - v) + data[bIdx] * v;
      const vertG = data[tIdx + 1] * (1 - v) + data[bIdx + 1] * v;
      const vertB = data[tIdx + 2] * (1 - v) + data[bIdx + 2] * v;

      // Add gentle procedural noise for natural texture continuity
      const noise = (Math.random() - 0.5) * 8;

      const targetIdx = (y * width + x) * 4;
      data[targetIdx] = Math.max(0, Math.min(255, (horizR + vertR) / 2 + noise));
      data[targetIdx + 1] = Math.max(0, Math.min(255, (horizG + vertG) / 2 + noise));
      data[targetIdx + 2] = Math.max(0, Math.min(255, (horizB + vertB) / 2 + noise));
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

// Export canvas as image blob / data url with resolution scaling
export async function exportCanvasImage(
  layers: Layer[],
  docWidth: number,
  docHeight: number,
  format: 'png' | 'jpeg' | 'webp',
  quality: number = 0.92,
  scale: number = 1,
  transparent: boolean = true
): Promise<string> {
  const exportCanvas = document.createElement('canvas');
  exportCanvas.width = Math.round(docWidth * scale);
  exportCanvas.height = Math.round(docHeight * scale);
  const ctx = exportCanvas.getContext('2d');
  if (!ctx) throw new Error('Cannot create export context');

  ctx.scale(scale, scale);

  // Background fill if not transparent or if format doesn't support transparency
  if (!transparent || format === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, docWidth, docHeight);
  }

  // Render all visible layers in stack order (bottom to top)
  for (const layer of layers) {
    if (layer.visible) {
      await renderLayer(ctx, layer);
    }
  }

  const mimeType = format === 'jpeg' ? 'image/jpeg' : format === 'webp' ? 'image/webp' : 'image/png';
  return exportCanvas.toDataURL(mimeType, quality);
}
