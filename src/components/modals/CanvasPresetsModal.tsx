import React, { useState } from 'react';
import { X, Maximize2, Layers, Check, ArrowRight } from 'lucide-react';
import { CANVAS_PRESETS, calculatePxFromUnit } from '../../utils/canvasPresets';
import { useEditor } from '../../context/EditorContext';

interface CanvasPresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDimensions: (name: string, width: number, height: number, dpi: number) => void;
}

export const CanvasPresetsModal: React.FC<CanvasPresetsModalProps> = ({
  isOpen,
  onClose,
  onSelectDimensions,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('ISO Standard');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('a4');
  const [orientation, setOrientation] = useState<'portrait' | 'landscape'>('portrait');
  const [dpi, setDpi] = useState<number>(300);

  // Custom dimensions state
  const [customUnit, setCustomUnit] = useState<'px' | 'in' | 'mm'>('px');
  const [customWidth, setCustomWidth] = useState<number>(1920);
  const [customHeight, setCustomHeight] = useState<number>(1080);
  const [customName, setCustomName] = useState<string>('Custom Document');

  if (!isOpen) return null;

  const currentPreset = CANVAS_PRESETS.find((p) => p.id === selectedPresetId);

  const handleApplyPreset = () => {
    if (!currentPreset) return;
    let w = currentPreset.defaultWidthPx;
    let h = currentPreset.defaultHeightPx;

    // Adjust for orientation
    if (orientation === 'landscape' && h > w) {
      const temp = w;
      w = h;
      h = temp;
    } else if (orientation === 'portrait' && w > h) {
      const temp = w;
      w = h;
      h = temp;
    }

    onSelectDimensions(currentPreset.name, w, h, dpi);
    onClose();
  };

  const handleApplyCustom = () => {
    let w = calculatePxFromUnit(customWidth, customUnit, dpi);
    let h = calculatePxFromUnit(customHeight, customUnit, dpi);

    if (orientation === 'landscape' && h > w) {
      const temp = w;
      w = h;
      h = temp;
    } else if (orientation === 'portrait' && w > h) {
      const temp = w;
      w = h;
      h = temp;
    }

    onSelectDimensions(customName || 'Custom Canvas', w, h, dpi);
    onClose();
  };

  const categories = ['ISO Standard', 'North America', 'Social & Video', 'Custom'];
  const filteredPresets = CANVAS_PRESETS.filter((p) => p.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl bg-[#222222] border border-[#383838] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#e0e0e0] max-h-[90vh]">
        {/* Header */}
        <div className="h-12 px-5 bg-[#1b1b1b] border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 size={16} className="text-[#1685ff]" />
            <span className="font-bold text-white text-sm">Choose Canvas Size & Dimensions</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#333] hover:text-white text-neutral-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="px-5 pt-3 bg-[#1e1e1e] border-b border-[#333] flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`pb-2.5 px-3 font-semibold text-xs border-b-2 transition-colors ${
                activeCategory === cat
                  ? 'border-[#1685ff] text-white'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeCategory !== 'Custom' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <div
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1685ff]/20 border-[#1685ff] text-white shadow'
                        : 'bg-[#1a1a1a] border-[#333] hover:bg-[#252525] text-neutral-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs">{preset.name}</span>
                      {isSelected && <Check size={14} className="text-[#1685ff]" />}
                    </div>
                    <div className="text-[11px] text-neutral-400 font-mono">
                      {preset.description}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Custom Dimensions Form */
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Document Name</label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full bg-[#181818] border border-[#383838] rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-[#1685ff]"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Width</label>
                  <input
                    type="number"
                    min="1"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#181818] border border-[#383838] rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-[#1685ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Height</label>
                  <input
                    type="number"
                    min="1"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(parseFloat(e.target.value) || 1)}
                    className="w-full bg-[#181818] border border-[#383838] rounded-lg px-3 py-1.5 text-xs font-mono text-white outline-none focus:border-[#1685ff]"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">Unit</label>
                  <select
                    value={customUnit}
                    onChange={(e) => setCustomUnit(e.target.value as any)}
                    className="w-full bg-[#181818] border border-[#383838] rounded-lg px-2 py-1.5 text-xs text-neutral-200 outline-none focus:border-[#1685ff]"
                  >
                    <option value="px">Pixels (px)</option>
                    <option value="in">Inches (in)</option>
                    <option value="mm">Millimeters (mm)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Orientation & DPI Settings */}
          <div className="pt-4 border-t border-[#333] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">Orientation:</span>
              <div className="flex bg-[#1a1a1a] border border-[#383838] rounded-lg p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setOrientation('portrait')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    orientation === 'portrait' ? 'bg-[#1685ff] text-white' : 'text-neutral-400'
                  }`}
                >
                  Portrait
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('landscape')}
                  className={`px-3 py-1 rounded-md transition-colors ${
                    orientation === 'landscape' ? 'bg-[#1685ff] text-white' : 'text-neutral-400'
                  }`}
                >
                  Landscape
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-neutral-400">Resolution (DPI):</span>
              <div className="flex bg-[#1a1a1a] border border-[#383838] rounded-lg p-0.5 text-xs">
                {[72, 150, 300].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setDpi(d)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                      dpi === d ? 'bg-[#1685ff] text-white' : 'text-neutral-400'
                    }`}
                  >
                    {d} DPI
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-5 bg-[#1b1b1b] border-t border-[#333] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2f2f2f] hover:bg-[#383838] text-neutral-300 rounded-lg text-xs"
          >
            Cancel
          </button>
          <button
            onClick={activeCategory === 'Custom' ? handleApplyCustom : handleApplyPreset}
            className="px-5 py-2 bg-[#1685ff] hover:bg-[#0070eb] text-white font-semibold rounded-lg text-xs shadow"
          >
            Create Canvas
          </button>
        </div>
      </div>
    </div>
  );
};
