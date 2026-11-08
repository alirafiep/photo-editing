import React from 'react';
import {
  RotateCcw,
  Sparkles,
  Sun,
  Contrast as ContrastIcon,
  Palette,
  Thermometer,
  Zap,
  Eye,
  Sliders,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

interface SliderDef {
  key: keyof import('../../types/editor').LayerAdjustments;
  label: string;
  min: number;
  max: number;
  unit?: string;
}

const ADJUSTMENT_SLIDERS: SliderDef[] = [
  { key: 'brightness', label: 'Brightness', min: -100, max: 100 },
  { key: 'contrast', label: 'Contrast', min: -100, max: 100 },
  { key: 'exposure', label: 'Exposure', min: -100, max: 100 },
  { key: 'saturation', label: 'Saturation', min: -100, max: 100 },
  { key: 'temperature', label: 'Temperature', min: -100, max: 100 },
  { key: 'tint', label: 'Tint', min: -100, max: 100 },
  { key: 'highlights', label: 'Highlights', min: -100, max: 100 },
  { key: 'shadows', label: 'Shadows', min: -100, max: 100 },
  { key: 'sharpness', label: 'Sharpness', min: 0, max: 100 },
  { key: 'blur', label: 'Blur', min: 0, max: 40, unit: 'px' },
  { key: 'vignette', label: 'Vignette', min: 0, max: 100 },
];

export const AdjustmentsPanel: React.FC = () => {
  const {
    selectedLayer,
    updateAdjustments,
    resetAdjustments,
    autoEnhanceImage,
    isProcessingAI,
  } = useEditor();

  if (!selectedLayer) {
    return (
      <div className="p-4 text-center text-neutral-500 text-xs">
        Select an image layer to apply real-time color and tonal adjustments.
      </div>
    );
  }

  const adj = selectedLayer.adjustments;

  return (
    <div className="p-3 text-xs text-[#e0e0e0] space-y-4 overflow-y-auto h-full">
      {/* Top Header Actions */}
      <div className="flex items-center justify-between pb-2 border-b border-[#3a3a3a]">
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
          Color & Light
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={autoEnhanceImage}
            disabled={isProcessingAI}
            className="flex items-center gap-1 px-2 py-0.5 bg-[#1685ff] hover:bg-[#0070eb] text-white rounded text-[10px] font-medium transition-colors disabled:opacity-40 shadow-sm"
            title="Auto-adjust tone, contrast & vibrant saturation"
          >
            <Sparkles size={11} /> Auto AI
          </button>
          <button
            onClick={resetAdjustments}
            className="p-1 hover:text-white hover:bg-[#333] rounded text-neutral-400 transition-colors"
            title="Reset All Adjustments"
          >
            <RotateCcw size={12} />
          </button>
        </div>
      </div>

      {/* Sliders List */}
      <div className="space-y-3">
        {ADJUSTMENT_SLIDERS.map((s) => {
          const val = adj[s.key] ?? 0;
          return (
            <div key={s.key} className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-neutral-400">{s.label}</span>
                <span
                  onDoubleClick={() => updateAdjustments({ [s.key]: 0 })}
                  className="font-mono text-neutral-200 cursor-pointer hover:text-[#1685ff]"
                  title="Double click to reset"
                >
                  {val > 0 && s.min < 0 ? `+${val}` : val}
                  {s.unit || ''}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                value={val}
                onChange={(e) =>
                  updateAdjustments({ [s.key]: parseInt(e.target.value) || 0 })
                }
                className="w-full"
              />
            </div>
          );
        })}
      </div>

      {/* Quick Tonal Modes */}
      <div className="pt-3 border-t border-[#3a3a3a]">
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Color Modes
        </div>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() =>
              updateAdjustments({ grayscale: adj.grayscale > 0 ? 0 : 100 })
            }
            className={`py-1.5 px-2 rounded text-center transition-colors border text-[11px] ${
              adj.grayscale > 0
                ? 'bg-[#1685ff]/20 border-[#1685ff] text-white font-medium'
                : 'bg-[#242424] border-[#3a3a3a] text-neutral-300 hover:bg-[#303030]'
            }`}
          >
            Grayscale
          </button>
          <button
            onClick={() =>
              updateAdjustments({ sepia: adj.sepia > 0 ? 0 : 85 })
            }
            className={`py-1.5 px-2 rounded text-center transition-colors border text-[11px] ${
              adj.sepia > 0
                ? 'bg-[#1685ff]/20 border-[#1685ff] text-white font-medium'
                : 'bg-[#242424] border-[#3a3a3a] text-neutral-300 hover:bg-[#303030]'
            }`}
          >
            Sepia
          </button>
          <button
            onClick={() =>
              updateAdjustments({ invert: adj.invert > 0 ? 0 : 100 })
            }
            className={`py-1.5 px-2 rounded text-center transition-colors border text-[11px] ${
              adj.invert > 0
                ? 'bg-[#1685ff]/20 border-[#1685ff] text-white font-medium'
                : 'bg-[#242424] border-[#3a3a3a] text-neutral-300 hover:bg-[#303030]'
            }`}
          >
            Invert
          </button>
        </div>
      </div>
    </div>
  );
};
