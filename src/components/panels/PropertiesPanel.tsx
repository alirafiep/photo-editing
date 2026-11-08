import React, { useState } from 'react';
import {
  Link2,
  Link2Off,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Type,
  Square,
  Sliders,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const PropertiesPanel: React.FC = () => {
  const {
    selectedLayer,
    updateLayer,
    activeProject,
    setShowColorPickerModal,
    setColorPickerTarget,
  } = useEditor();

  const [lockAspect, setLockAspect] = useState(true);

  if (!selectedLayer || !activeProject) {
    return (
      <div className="p-4 text-center text-neutral-500 text-xs">
        No layer selected. Select a layer to inspect and edit its properties.
      </div>
    );
  }

  const handleWidthChange = (val: number) => {
    const nextW = Math.max(10, val);
    if (lockAspect && selectedLayer.width > 0) {
      const ratio = selectedLayer.height / selectedLayer.width;
      updateLayer(selectedLayer.id, {
        width: nextW,
        height: Math.round(nextW * ratio),
      });
    } else {
      updateLayer(selectedLayer.id, { width: nextW });
    }
  };

  const handleHeightChange = (val: number) => {
    const nextH = Math.max(10, val);
    if (lockAspect && selectedLayer.height > 0) {
      const ratio = selectedLayer.width / selectedLayer.height;
      updateLayer(selectedLayer.id, {
        height: nextH,
        width: Math.round(nextH * ratio),
      });
    } else {
      updateLayer(selectedLayer.id, { height: nextH });
    }
  };

  return (
    <div className="p-3 text-xs text-[#e0e0e0] space-y-4 overflow-y-auto h-full">
      {/* Transform Geometry Section */}
      <div>
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
          Transform & Position
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center bg-[#1c1c1c] border border-[#3a3a3a] rounded px-2 py-1">
            <span className="text-neutral-400 font-mono text-[11px] w-4">X</span>
            <input
              type="number"
              value={Math.round(selectedLayer.x)}
              onChange={(e) =>
                updateLayer(selectedLayer.id, { x: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-transparent text-right font-mono text-neutral-200 outline-none text-[11px]"
            />
            <span className="text-neutral-500 text-[10px] ml-1">px</span>
          </div>

          <div className="flex items-center bg-[#1c1c1c] border border-[#3a3a3a] rounded px-2 py-1">
            <span className="text-neutral-400 font-mono text-[11px] w-4">Y</span>
            <input
              type="number"
              value={Math.round(selectedLayer.y)}
              onChange={(e) =>
                updateLayer(selectedLayer.id, { y: parseInt(e.target.value) || 0 })
              }
              className="w-full bg-transparent text-right font-mono text-neutral-200 outline-none text-[11px]"
            />
            <span className="text-neutral-500 text-[10px] ml-1">px</span>
          </div>

          <div className="flex items-center bg-[#1c1c1c] border border-[#3a3a3a] rounded px-2 py-1">
            <span className="text-neutral-400 font-mono text-[11px] w-4">W</span>
            <input
              type="number"
              value={Math.round(selectedLayer.width)}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 10)}
              className="w-full bg-transparent text-right font-mono text-neutral-200 outline-none text-[11px]"
            />
            <span className="text-neutral-500 text-[10px] ml-1">px</span>
          </div>

          <div className="flex items-center bg-[#1c1c1c] border border-[#3a3a3a] rounded px-2 py-1 relative">
            <span className="text-neutral-400 font-mono text-[11px] w-4">H</span>
            <input
              type="number"
              value={Math.round(selectedLayer.height)}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 10)}
              className="w-full bg-transparent text-right font-mono text-neutral-200 outline-none text-[11px]"
            />
            <span className="text-neutral-500 text-[10px] ml-1">px</span>
          </div>
        </div>

        {/* Aspect Ratio Lock Toggle & Rotation */}
        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#333]">
          <button
            onClick={() => setLockAspect(!lockAspect)}
            className={`flex items-center gap-1.5 px-2 py-1 rounded text-[11px] transition-colors ${
              lockAspect
                ? 'bg-[#1685ff]/20 text-[#1685ff] border border-[#1685ff]/40'
                : 'text-neutral-400 hover:text-white hover:bg-[#333]'
            }`}
          >
            {lockAspect ? <Link2 size={13} /> : <Link2Off size={13} />}
            <span>Lock Aspect Ratio</span>
          </button>

          <div className="flex items-center bg-[#1c1c1c] border border-[#3a3a3a] rounded px-2 py-0.5">
            <span className="text-neutral-400 font-mono text-[10px] mr-1">∠</span>
            <input
              type="number"
              value={Math.round(selectedLayer.rotation || 0)}
              onChange={(e) =>
                updateLayer(selectedLayer.id, {
                  rotation: (parseInt(e.target.value) || 0) % 360,
                })
              }
              className="w-10 bg-transparent text-right font-mono text-neutral-200 outline-none text-[11px]"
            />
            <span className="text-neutral-400 text-[10px] ml-0.5">°</span>
          </div>
        </div>

        {/* Quick Transform Buttons */}
        <div className="grid grid-cols-4 gap-1 mt-2">
          <button
            onClick={() =>
              updateLayer(
                selectedLayer.id,
                { rotation: (selectedLayer.rotation + 90) % 360 },
                true,
                'Rotate CW'
              )
            }
            className="p-1.5 bg-[#292929] hover:bg-[#333] hover:text-white rounded flex items-center justify-center transition-colors"
            title="Rotate 90° CW"
          >
            <RotateCw size={13} />
          </button>
          <button
            onClick={() =>
              updateLayer(
                selectedLayer.id,
                { rotation: (selectedLayer.rotation - 90 + 360) % 360 },
                true,
                'Rotate CCW'
              )
            }
            className="p-1.5 bg-[#292929] hover:bg-[#333] hover:text-white rounded flex items-center justify-center transition-colors"
            title="Rotate 90° CCW"
          >
            <RotateCcw size={13} />
          </button>
          <button
            onClick={() =>
              updateLayer(
                selectedLayer.id,
                { flipH: !selectedLayer.flipH },
                true,
                'Flip H'
              )
            }
            className="p-1.5 bg-[#292929] hover:bg-[#333] hover:text-white rounded flex items-center justify-center transition-colors"
            title="Flip Horizontal"
          >
            <FlipHorizontal size={13} />
          </button>
          <button
            onClick={() =>
              updateLayer(
                selectedLayer.id,
                { flipV: !selectedLayer.flipV },
                true,
                'Flip V'
              )
            }
            className="p-1.5 bg-[#292929] hover:bg-[#333] hover:text-white rounded flex items-center justify-center transition-colors"
            title="Flip Vertical"
          >
            <FlipVertical size={13} />
          </button>
        </div>
      </div>

      {/* Layer Opacity */}
      <div>
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-neutral-400">Opacity</span>
          <span className="font-mono text-neutral-300">
            {Math.round(selectedLayer.opacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          value={Math.round(selectedLayer.opacity * 100)}
          onChange={(e) =>
            updateLayer(selectedLayer.id, { opacity: parseInt(e.target.value) / 100 })
          }
          className="w-full"
        />
      </div>

      {/* TEXT SPECIFIC CONTROLS */}
      {selectedLayer.type === 'text' && selectedLayer.textConfig && (
        <div className="border-t border-[#3a3a3a] pt-3 space-y-3">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Typography
          </div>

          <div>
            <label className="text-[10px] text-neutral-400 block mb-1">Text Content</label>
            <textarea
              rows={2}
              value={selectedLayer.textConfig.text}
              onChange={(e) =>
                updateLayer(
                  selectedLayer.id,
                  {
                    textConfig: {
                      ...selectedLayer.textConfig!,
                      text: e.target.value,
                    },
                  },
                  false
                )
              }
              className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded p-2 text-neutral-200 outline-none text-xs focus:border-[#1685ff]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Font Size</label>
              <input
                type="number"
                min="8"
                max="200"
                value={selectedLayer.textConfig.fontSize}
                onChange={(e) =>
                  updateLayer(selectedLayer.id, {
                    textConfig: {
                      ...selectedLayer.textConfig!,
                      fontSize: parseInt(e.target.value) || 24,
                    },
                  })
                }
                className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded px-2 py-1 font-mono text-right outline-none text-xs"
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Color</label>
              <div
                onClick={() => {
                  setColorPickerTarget('fg');
                  setShowColorPickerModal(true);
                }}
                className="w-full h-7 rounded border border-[#3a3a3a] cursor-pointer flex items-center px-2 gap-2"
                style={{ backgroundColor: selectedLayer.textConfig.color }}
              >
                <span className="text-[10px] font-mono mix-blend-difference text-white">
                  {selectedLayer.textConfig.color}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SHAPE SPECIFIC CONTROLS */}
      {selectedLayer.type === 'shape' && selectedLayer.shapeConfig && (
        <div className="border-t border-[#3a3a3a] pt-3 space-y-3">
          <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
            Shape Style
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Fill Color</label>
              <div
                onClick={() => {
                  setColorPickerTarget('fg');
                  setShowColorPickerModal(true);
                }}
                className="w-full h-7 rounded border border-[#3a3a3a] cursor-pointer shadow-inner"
                style={{ backgroundColor: selectedLayer.shapeConfig.fillColor }}
              />
            </div>

            <div>
              <label className="text-[10px] text-neutral-400 block mb-1">Stroke Color</label>
              <div
                onClick={() => {
                  setColorPickerTarget('bg');
                  setShowColorPickerModal(true);
                }}
                className="w-full h-7 rounded border border-[#3a3a3a] cursor-pointer shadow-inner"
                style={{ backgroundColor: selectedLayer.shapeConfig.strokeColor }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Stroke Width</span>
            <input
              type="number"
              min="0"
              max="40"
              value={selectedLayer.shapeConfig.strokeWidth}
              onChange={(e) =>
                updateLayer(selectedLayer.id, {
                  shapeConfig: {
                    ...selectedLayer.shapeConfig!,
                    strokeWidth: parseInt(e.target.value) || 0,
                  },
                })
              }
              className="w-14 bg-[#1c1c1c] border border-[#3a3a3a] rounded px-2 py-0.5 text-right font-mono outline-none text-xs"
            />
          </div>
        </div>
      )}

      {/* Canvas Dimensions Info */}
      <div className="border-t border-[#3a3a3a] pt-3 text-[11px] text-neutral-400 space-y-1">
        <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-1">
          Document Details
        </div>
        <div className="flex justify-between">
          <span>Canvas Size:</span>
          <span className="font-mono text-neutral-200">
            {activeProject.width} × {activeProject.height} px
          </span>
        </div>
        <div className="flex justify-between">
          <span>Color Space:</span>
          <span className="text-neutral-200">sRGB (8-bit)</span>
        </div>
        <div className="flex justify-between">
          <span>Total Layers:</span>
          <span className="text-neutral-200">{activeProject.layers.length}</span>
        </div>
      </div>
    </div>
  );
};
