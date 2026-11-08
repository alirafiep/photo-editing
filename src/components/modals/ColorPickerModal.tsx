import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

const SWATCHES = [
  '#000000', '#ffffff', '#1685ff', '#00f2fe', '#4facfe', '#00ff87',
  '#ff416c', '#ff4b2b', '#ff7e5f', '#feb47b', '#f9d423', '#a8ff78',
  '#7028e4', '#e5b2ca', '#667eea', '#764ba2', '#1e3c72', '#2a5298',
  '#232526', '#414345', '#3a6073', '#3a7bd5', '#11998e', '#38ef7d',
];

export const ColorPickerModal: React.FC = () => {
  const {
    showColorPickerModal,
    setShowColorPickerModal,
    colorPickerTarget,
    fgColor,
    bgColor,
    setFgColor,
    setBgColor,
    selectedLayer,
    updateLayer,
  } = useEditor();

  const [hex, setHex] = useState('#ffffff');

  useEffect(() => {
    if (colorPickerTarget === 'fg') {
      setHex(fgColor);
    } else {
      setHex(bgColor);
    }
  }, [colorPickerTarget, fgColor, bgColor, showColorPickerModal]);

  if (!showColorPickerModal) return null;

  const handleApply = (newHex: string) => {
    if (colorPickerTarget === 'fg') {
      setFgColor(newHex);
      // If editing text layer color
      if (selectedLayer?.type === 'text' && selectedLayer.textConfig) {
        updateLayer(selectedLayer.id, {
          textConfig: { ...selectedLayer.textConfig, color: newHex },
        });
      }
    } else {
      setBgColor(newHex);
      if (selectedLayer?.type === 'shape' && selectedLayer.shapeConfig) {
        updateLayer(selectedLayer.id, {
          shapeConfig: { ...selectedLayer.shapeConfig, strokeColor: newHex },
        });
      }
    }
    setShowColorPickerModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-[#242424] border border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden text-[#e0e0e0]">
        <div className="h-11 px-4 bg-[#202020] border-b border-[#3a3a3a] flex items-center justify-between">
          <span className="font-bold text-white text-xs">
            Color Picker ({colorPickerTarget === 'fg' ? 'Foreground' : 'Background'})
          </span>
          <button
            onClick={() => setShowColorPickerModal(false)}
            className="p-1 rounded hover:bg-[#333] hover:text-white text-neutral-400"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Native HTML Color Input & Preview Box */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-white/30 shadow-inner shrink-0">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="absolute inset-0 w-[200%] h-[200%] -top-[50%] -left-[50%] cursor-pointer"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-[11px] text-neutral-400 block">Hex Color Code</label>
              <div className="flex items-center bg-[#1c1c1c] border border-[#3a3a3a] rounded px-2.5 py-1.5 focus-within:border-[#1685ff]">
                <span className="text-neutral-500 font-mono text-xs mr-1">#</span>
                <input
                  type="text"
                  value={hex.replace(/^#/, '')}
                  onChange={(e) => setHex('#' + e.target.value)}
                  className="w-full bg-transparent font-mono text-xs text-white uppercase outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Swatches Palette */}
          <div>
            <label className="text-[11px] text-neutral-400 block mb-2">Preset Swatches</label>
            <div className="grid grid-cols-8 gap-1.5">
              {SWATCHES.map((swatch) => (
                <button
                  key={swatch}
                  onClick={() => setHex(swatch)}
                  className={`w-7 h-7 rounded border transition-transform hover:scale-110 ${
                    hex.toLowerCase() === swatch.toLowerCase()
                      ? 'border-white ring-2 ring-[#1685ff]'
                      : 'border-white/20'
                  }`}
                  style={{ backgroundColor: swatch }}
                  title={swatch}
                />
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#3a3a3a]">
            <button
              onClick={() => setShowColorPickerModal(false)}
              className="px-3.5 py-1.5 bg-[#333] hover:bg-[#404040] text-neutral-300 rounded text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleApply(hex)}
              className="px-4 py-1.5 bg-[#1685ff] hover:bg-[#0070eb] text-white font-medium rounded text-xs transition-colors"
            >
              Select Color
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
