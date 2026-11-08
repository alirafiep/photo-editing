import { BlurSettings, SelectionArea } from '../types/editor';
import { getCachedImage } from './imageProcessing';

// 1. Box/Gaussian Blur Fast Approximation
export function applyFastBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  radius: number
): void {
  if (radius <= 0) return;
  const rad = Math.min(60, Math.round(radius));

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  // Horizontal blur pass
  const temp = new Uint8ClampedArray(data.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      const startX = Math.max(0, x - rad);
      const endX = Math.min(width - 1, x + rad);
      for (let ix = startX; ix <= endX; ix++) {
        const idx = (y * width + ix) * 4;
        r += data[idx];
        g += data[idx + 1];
        b += data[idx + 2];
        a += data[idx + 3];
        count++;
      }
      const target = (y * width + x) * 4;
      temp[target] = r / count;
      temp[target + 1] = g / count;
      temp[target + 2] = b / count;
      temp[target + 3] = a / count;
    }
  }

  // Vertical blur pass
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      const startY = Math.max(0, y - rad);
      const endY = Math.min(height - 1, y + rad);
      for (let iy = startY; iy <= endY; iy++) {
        const idx = (iy * width + x) * 4;
        r += temp[idx];
        g += temp[idx + 1];
        b += temp[idx + 2];
        a += temp[idx + 3];
        count++;
      }
      const target = (y * width + x) * 4;
      data[target] = r / count;
      data[target + 1] = g / count;
      data[target + 2] = b / count;
      data[target + 3] = a / count;
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

// 2. Motion Blur
export function applyMotionBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  distance: number,
  angleDeg: number = 0
): void {
  const rad = (angleDeg * Math.PI) / 180;
  const dx = Math.cos(rad);
  const dy = Math.sin(rad);
  const steps = Math.min(40, Math.max(2, Math.round(distance)));

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const copy = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0, a = 0, count = 0;
      for (let s = -steps / 2; s <= steps / 2; s++) {
        const sx = Math.round(x + s * dx);
        const sy = Math.round(y + s * dy);
        if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
          const idx = (sy * width + sx) * 4;
          r += copy[idx];
          g += copy[idx + 1];
          b += copy[idx + 2];
          a += copy[idx + 3];
          count++;
        }
      }
      if (count > 0) {
        const target = (y * width + x) * 4;
        data[target] = r / count;
        data[target + 1] = g / count;
        data[target + 2] = b / count;
        data[target + 3] = a / count;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// 3. Radial / Spin Blur
export function applyRadialBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number
): void {
  const cx = width / 2;
  const cy = height / 2;
  const steps = Math.min(20, Math.max(3, Math.round(strength / 4)));
  const angleDelta = (strength * 0.005) / steps;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const copy = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rx = x - cx;
      const ry = y - cy;
      const dist = Math.hypot(rx, ry);
      if (dist < 5) continue;

      let baseAngle = Math.atan2(ry, rx);
      let r = 0, g = 0, b = 0, a = 0, count = 0;

      for (let s = -steps / 2; s <= steps / 2; s++) {
        const aSample = baseAngle + s * angleDelta;
        const sx = Math.round(cx + dist * Math.cos(aSample));
        const sy = Math.round(cy + dist * Math.sin(aSample));
        if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
          const idx = (sy * width + sx) * 4;
          r += copy[idx];
          g += copy[idx + 1];
          b += copy[idx + 2];
          a += copy[idx + 3];
          count++;
        }
      }

      if (count > 0) {
        const target = (y * width + x) * 4;
        data[target] = r / count;
        data[target + 1] = g / count;
        data[target + 2] = b / count;
        data[target + 3] = a / count;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// 4. Zoom Blur (radiates out from center)
export function applyZoomBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  strength: number
): void {
  const cx = width / 2;
  const cy = height / 2;
  const steps = Math.min(20, Math.max(3, Math.round(strength / 5)));
  const factor = (strength * 0.008) / steps;

  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;
  const copy = new Uint8ClampedArray(data);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rx = x - cx;
      const ry = y - cy;

      let r = 0, g = 0, b = 0, a = 0, count = 0;
      for (let s = 0; s < steps; s++) {
        const scale = 1 - s * factor;
        const sx = Math.round(cx + rx * scale);
        const sy = Math.round(cy + ry * scale);
        if (sx >= 0 && sx < width && sy >= 0 && sy < height) {
          const idx = (sy * width + sx) * 4;
          r += copy[idx];
          g += copy[idx + 1];
          b += copy[idx + 2];
          a += copy[idx + 3];
          count++;
        }
      }

      if (count > 0) {
        const target = (y * width + x) * 4;
        data[target] = r / count;
        data[target + 1] = g / count;
        data[target + 2] = b / count;
        data[target + 3] = a / count;
      }
    }
  }
  ctx.putImageData(imgData, 0, 0);
}

// 5. Tilt-Shift Blur (linear focus band in center, progressive blur on top & bottom)
export function applyTiltShiftBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  radius: number
): void {
  // First create fully blurred copy
  const blurCanvas = document.createElement('canvas');
  blurCanvas.width = width;
  blurCanvas.height = height;
  const bCtx = blurCanvas.getContext('2d')!;
  bCtx.drawImage(ctx.canvas, 0, 0);
  applyFastBlur(bCtx, width, height, radius);

  const sharpData = ctx.getImageData(0, 0, width, height);
  const blurData = bCtx.getImageData(0, 0, width, height);

  const focusCenterY = height * 0.5;
  const bandHeight = height * 0.2;

  for (let y = 0; y < height; y++) {
    const dist = Math.abs(y - focusCenterY);
    // Smoothstep transition
    let blurFactor = 0;
    if (dist > bandHeight) {
      blurFactor = Math.min(1, (dist - bandHeight) / (height * 0.25));
    }

    if (blurFactor > 0) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        sharpData.data[idx] = sharpData.data[idx] * (1 - blurFactor) + blurData.data[idx] * blurFactor;
        sharpData.data[idx + 1] = sharpData.data[idx + 1] * (1 - blurFactor) + blurData.data[idx + 1] * blurFactor;
        sharpData.data[idx + 2] = sharpData.data[idx + 2] * (1 - blurFactor) + blurData.data[idx + 2] * blurFactor;
      }
    }
  }
  ctx.putImageData(sharpData, 0, 0);
}

// 6. Background Blur / Face Background Blur
// Automatically estimates central foreground subject and smoothly blurs surrounding background
export function applyBackgroundBlur(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  radius: number
): void {
  const blurCanvas = document.createElement('canvas');
  blurCanvas.width = width;
  blurCanvas.height = height;
  const bCtx = blurCanvas.getContext('2d')!;
  bCtx.drawImage(ctx.canvas, 0, 0);
  applyFastBlur(bCtx, width, height, radius);

  const sharpData = ctx.getImageData(0, 0, width, height);
  const blurData = bCtx.getImageData(0, 0, width, height);

  const cx = width / 2;
  const cy = height * 0.45;
  const radiusX = width * 0.35;
  const radiusY = height * 0.42;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dx = (x - cx) / radiusX;
      const dy = (y - cy) / radiusY;
      const d = Math.sqrt(dx * dx + dy * dy);

      // Subject mask: d < 0.8 is clear subject, 0.8 to 1.3 is feathered blur
      let blurWeight = 0;
      if (d > 0.8) {
        blurWeight = Math.min(1, (d - 0.8) / 0.5);
      }

      if (blurWeight > 0) {
        const idx = (y * width + x) * 4;
        sharpData.data[idx] = sharpData.data[idx] * (1 - blurWeight) + blurData.data[idx] * blurWeight;
        sharpData.data[idx + 1] = sharpData.data[idx + 1] * (1 - blurWeight) + blurData.data[idx + 1] * blurWeight;
        sharpData.data[idx + 2] = sharpData.data[idx + 2] * (1 - blurWeight) + blurData.data[idx + 2] * blurWeight;
      }
    }
  }
  ctx.putImageData(sharpData, 0, 0);
}

// 7. Master Apply Blur Function
export async function processBlurEffect(
  dataUrl: string,
  settings: BlurSettings,
  selection?: SelectionArea | null
): Promise<string> {
  const img = await getCachedImage(dataUrl);
  const canvas = document.createElement('canvas');
  canvas.width = img.width;
  canvas.height = img.height;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0);

  const w = canvas.width;
  const h = canvas.height;

  switch (settings.toolType) {
    case 'gaussian':
      applyFastBlur(ctx, w, h, settings.radius);
      break;
    case 'motion':
      applyMotionBlur(ctx, w, h, settings.radius * 2, settings.angle || 0);
      break;
    case 'radial':
      applyRadialBlur(ctx, w, h, settings.intensity);
      break;
    case 'zoom':
      applyZoomBlur(ctx, w, h, settings.intensity);
      break;
    case 'tilt-shift':
      applyTiltShiftBlur(ctx, w, h, settings.radius);
      break;
    case 'background':
    case 'face-bg':
      applyBackgroundBlur(ctx, w, h, settings.radius);
      break;
    case 'selective':
      if (selection && selection.width > 0 && selection.height > 0) {
        // Selective blur inside selection boundary
        const selCanvas = document.createElement('canvas');
        selCanvas.width = selection.width;
        selCanvas.height = selection.height;
        const sCtx = selCanvas.getContext('2d')!;
        sCtx.drawImage(
          canvas,
          selection.x,
          selection.y,
          selection.width,
          selection.height,
          0,
          0,
          selection.width,
          selection.height
        );
        applyFastBlur(sCtx, selection.width, selection.height, settings.radius);
        ctx.drawImage(selCanvas, selection.x, selection.y);
      } else {
        applyFastBlur(ctx, w, h, settings.radius);
      }
      break;
    case 'lens':
      // Lens blur bokeh: blur with highlight bloom
      applyFastBlur(ctx, w, h, settings.radius);
      const imgData = ctx.getImageData(0, 0, w, h);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const lum = 0.299 * imgData.data[i] + 0.587 * imgData.data[i + 1] + 0.114 * imgData.data[i + 2];
        if (lum > 180) {
          imgData.data[i] = Math.min(255, imgData.data[i] * 1.15);
          imgData.data[i + 1] = Math.min(255, imgData.data[i + 1] * 1.15);
          imgData.data[i + 2] = Math.min(255, imgData.data[i + 2] * 1.15);
        }
      }
      ctx.putImageData(imgData, 0, 0);
      break;
    default:
      applyFastBlur(ctx, w, h, settings.radius);
      break;
  }

  return canvas.toDataURL('image/png');
}
