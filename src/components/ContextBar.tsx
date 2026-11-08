import React from 'react';
import {
  Sparkles,
  Scissors,
  Wand2,
  Check,
  X,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignVerticalJustifyStart,
  AlignVerticalJustifyCenter,
  AlignVerticalJustifyEnd,
  Type,
  Square,
  Circle,
  Star,
  Hexagon,
  Minus,
  MoveRight,
  Bold,
  Italic,
  AlignJustify,
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { ShapeType } from '../types/editor';

const FONT_FAMILIES = [
  'Plus Jakarta Sans',
  'Roboto',
  'Montserrat',
  'Playfair Display',
  'Oswald',
  'Caveat',
  'JetBrains Mono',
];

export const ContextBar: React.FC = () => {
  const {
    activeTool,
    toolSettings,
    updateToolSettings,
    selectedLayer,
    updateLayer,
    activeProject,
    applyCrop,
    cancelCrop,
    cropArea,
    selection,
    removeBackground,
    removeObject,
    autoEnhanceImage,
    isProcessingAI,
    fgColor,
    setShowColorPickerModal,
    setColorPickerTarget,
    deleteSelection,
    fitToScreen,
    zoomTo,
    setZoom,
  } = useEditor();

  const handleAlign = (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => {
    if (!selectedLayer || !activeProject) return;
    let newX = selectedLayer.x;
    let newY = selectedLayer.y;

    if (type === 'left') newX = 0;
    else if (type === 'center') newX = (activeProject.width - selectedLayer.width) / 2;
    else if (type === 'right') newX = activeProject.width - selectedLayer.width;
    else if (type === 'top') newY = 0;
    else if (type === 'middle') newY = (activeProject.height - selectedLayer.height) / 2;
    else if (type === 'bottom') newY = activeProject.height - selectedLayer.height;

    updateLayer(selectedLayer.id, { x: Math.round(newX), y: Math.round(newY) }, true, `Align ${type}`);
  };

  return (
    <div className="h-9 bg-[#2c2c2c] border-b border-[#3a3a3a] px-3 flex items-center justify-between text-[11px] text-[#e0e0e0] select-none overflow-x-auto whitespace-nowrap">
      {/* Tool-specific Options */}
      <div className="flex items-center gap-3">
        {/* Tool Indicator Badge */}
        <span className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px] pr-2 border-r border-[#3e3e3e]">
          {activeTool}
        </span>

        {/* MOVE TOOL OPTIONS */}
        {activeTool === 'move' && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Align:</span>
            <div className="flex items-center bg-[#222222] border border-[#3a3a3a] rounded p-0.5">
              <button
                onClick={() => handleAlign('left')}
                className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                title="Align Left"
              >
                <AlignLeft size={13} />
              </button>
              <button
                onClick={() => handleAlign('center')}
                className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                title="Align Center Horizontal"
              >
                <AlignCenter size={13} />
              </button>
              <button
                onClick={() => handleAlign('right')}
                className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                title="Align Right"
              >
                <AlignRight size={13} />
              </button>
              <div className="w-[1px] h-3 bg-[#3a3a3a] mx-0.5" />
              <button
                onClick={() => handleAlign('top')}
                className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                title="Align Top"
              >
                <AlignVerticalJustifyStart size={13} />
              </button>
              <button
                onClick={() => handleAlign('middle')}
                className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                title="Align Middle Vertical"
              >
                <AlignVerticalJustifyCenter size={13} />
              </button>
              <button
                onClick={() => handleAlign('bottom')}
                className="p-1 hover:bg-[#383838] rounded text-neutral-300 hover:text-white"
                title="Align Bottom"
              >
                <AlignVerticalJustifyEnd size={13} />
              </button>
            </div>
          </div>
        )}

        {/* BRUSH TOOL OPTIONS */}
        {activeTool === 'brush' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Size:</span>
              <input
                type="range"
                min="1"
                max="160"
                value={toolSettings.brush.size}
                onChange={(e) =>
                  updateToolSettings('brush', { size: parseInt(e.target.value) })
                }
                className="w-20"
              />
              <span className="font-mono text-neutral-300 w-7">
                {toolSettings.brush.size}px
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Hardness:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={toolSettings.brush.hardness}
                onChange={(e) =>
                  updateToolSettings('brush', { hardness: parseInt(e.target.value) })
                }
                className="w-16"
              />
              <span className="font-mono text-neutral-300 w-7">
                {toolSettings.brush.hardness}%
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Opacity:</span>
              <input
                type="range"
                min="5"
                max="100"
                value={toolSettings.brush.opacity}
                onChange={(e) =>
                  updateToolSettings('brush', { opacity: parseInt(e.target.value) })
                }
                className="w-16"
              />
              <span className="font-mono text-neutral-300 w-7">
                {toolSettings.brush.opacity}%
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Style:</span>
              <select
                value={toolSettings.brush.style}
                onChange={(e) =>
                  updateToolSettings('brush', {
                    style: e.target.value as any,
                  })
                }
                className="bg-[#202020] border border-[#3a3a3a] text-neutral-200 rounded px-1.5 py-0.5 outline-none text-[11px]"
              >
                <option value="round">Round Solid</option>
                <option value="soft">Soft Airbrush</option>
                <option value="chalk">Textured Chalk</option>
                <option value="square">Square Stamp</option>
                <option value="star">Star Sparkle</option>
              </select>
            </div>
          </div>
        )}

        {/* ERASER TOOL OPTIONS */}
        {activeTool === 'eraser' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Size:</span>
              <input
                type="range"
                min="1"
                max="160"
                value={toolSettings.eraser.size}
                onChange={(e) =>
                  updateToolSettings('eraser', { size: parseInt(e.target.value) })
                }
                className="w-20"
              />
              <span className="font-mono text-neutral-300 w-7">
                {toolSettings.eraser.size}px
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Hardness:</span>
              <input
                type="range"
                min="0"
                max="100"
                value={toolSettings.eraser.hardness}
                onChange={(e) =>
                  updateToolSettings('eraser', { hardness: parseInt(e.target.value) })
                }
                className="w-16"
              />
              <span className="font-mono text-neutral-300 w-7">
                {toolSettings.eraser.hardness}%
              </span>
            </div>
          </div>
        )}

        {/* CROP TOOL OPTIONS */}
        {activeTool === 'crop' && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Ratio:</span>
            <select
              value={toolSettings.crop.aspect}
              onChange={(e) =>
                updateToolSettings('crop', { aspect: e.target.value as any })
              }
              className="bg-[#202020] border border-[#3a3a3a] text-neutral-200 rounded px-1.5 py-0.5 outline-none text-[11px]"
            >
              <option value="free">Freeform Ratio</option>
              <option value="1:1">1:1 Square</option>
              <option value="16:9">16:9 Landscape</option>
              <option value="4:3">4:3 Photo</option>
              <option value="9:16">9:16 Story / Reel</option>
            </select>
            <button
              onClick={applyCrop}
              disabled={!cropArea}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded text-[11px] font-medium"
            >
              <Check size={12} /> Apply Crop
            </button>
            <button
              onClick={cancelCrop}
              className="flex items-center gap-1 px-2.5 py-0.5 bg-[#3a3a3a] hover:bg-[#484848] text-neutral-200 rounded text-[11px]"
            >
              <X size={12} /> Cancel
            </button>
          </div>
        )}

        {/* SELECTION & LASSO TOOL OPTIONS */}
        {(activeTool === 'select' || activeTool === 'lasso') && (
          <div className="flex items-center gap-2">
            {activeTool === 'select' && (
              <div className="flex items-center bg-[#202020] border border-[#3a3a3a] rounded p-0.5">
                <button
                  onClick={() => updateToolSettings('selection', { mode: 'rect' })}
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    toolSettings.selection.mode === 'rect'
                      ? 'bg-[#1685ff] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Rectangular
                </button>
                <button
                  onClick={() => updateToolSettings('selection', { mode: 'ellipse' })}
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    toolSettings.selection.mode === 'ellipse'
                      ? 'bg-[#1685ff] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Elliptical
                </button>
              </div>
            )}
            {selection && (
              <>
                <button
                  onClick={removeObject}
                  className="flex items-center gap-1 px-2.5 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[11px] font-medium shadow-sm"
                  title="Content-Aware Object Removal"
                >
                  <Wand2 size={12} /> Remove Object
                </button>
                <button
                  onClick={deleteSelection}
                  className="px-2 py-0.5 bg-[#3a3a3a] hover:bg-[#484848] text-neutral-200 rounded text-[11px]"
                >
                  Clear Area
                </button>
              </>
            )}
            {!selection && (
              <span className="text-neutral-400 italic">
                Drag to create a selection boundary
              </span>
            )}
          </div>
        )}

        {/* TEXT TOOL OPTIONS */}
        {activeTool === 'text' && (
          <div className="flex items-center gap-2">
            <select
              value={
                selectedLayer?.type === 'text' && selectedLayer.textConfig
                  ? selectedLayer.textConfig.fontFamily
                  : toolSettings.text.fontFamily
              }
              onChange={(e) => {
                const font = e.target.value;
                updateToolSettings('text', { fontFamily: font });
                if (selectedLayer?.type === 'text' && selectedLayer.textConfig) {
                  updateLayer(
                    selectedLayer.id,
                    {
                      textConfig: {
                        ...selectedLayer.textConfig,
                        fontFamily: font,
                      },
                    },
                    true,
                    'Change Font'
                  );
                }
              }}
              className="bg-[#202020] border border-[#3a3a3a] text-neutral-200 rounded px-1.5 py-0.5 outline-none text-[11px]"
            >
              {FONT_FAMILIES.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
            </select>

            <div className="flex items-center gap-1">
              <span className="text-neutral-400">Size:</span>
              <input
                type="number"
                min="8"
                max="240"
                value={
                  selectedLayer?.type === 'text' && selectedLayer.textConfig
                    ? selectedLayer.textConfig.fontSize
                    : toolSettings.text.fontSize
                }
                onChange={(e) => {
                  const sz = parseInt(e.target.value) || 24;
                  updateToolSettings('text', { fontSize: sz });
                  if (selectedLayer?.type === 'text' && selectedLayer.textConfig) {
                    updateLayer(
                      selectedLayer.id,
                      {
                        textConfig: {
                          ...selectedLayer.textConfig,
                          fontSize: sz,
                        },
                      },
                      true,
                      'Change Font Size'
                    );
                  }
                }}
                className="w-14 bg-[#202020] border border-[#3a3a3a] text-neutral-200 rounded px-1.5 py-0.5 text-center font-mono outline-none text-[11px]"
              />
            </div>

            {/* Bold / Italic */}
            <div className="flex items-center bg-[#202020] border border-[#3a3a3a] rounded p-0.5">
              <button
                onClick={() => {
                  const nextBold = !(selectedLayer?.type === 'text' && selectedLayer.textConfig
                    ? selectedLayer.textConfig.bold
                    : toolSettings.text.bold);
                  updateToolSettings('text', { bold: nextBold });
                  if (selectedLayer?.type === 'text' && selectedLayer.textConfig) {
                    updateLayer(
                      selectedLayer.id,
                      {
                        textConfig: {
                          ...selectedLayer.textConfig,
                          bold: nextBold,
                        },
                      },
                      true,
                      'Toggle Bold'
                    );
                  }
                }}
                className={`p-1 rounded ${
                  (selectedLayer?.type === 'text' && selectedLayer.textConfig
                    ? selectedLayer.textConfig.bold
                    : toolSettings.text.bold)
                    ? 'bg-[#1685ff] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Bold"
              >
                <Bold size={12} />
              </button>
              <button
                onClick={() => {
                  const nextItalic = !(selectedLayer?.type === 'text' && selectedLayer.textConfig
                    ? selectedLayer.textConfig.italic
                    : toolSettings.text.italic);
                  updateToolSettings('text', { italic: nextItalic });
                  if (selectedLayer?.type === 'text' && selectedLayer.textConfig) {
                    updateLayer(
                      selectedLayer.id,
                      {
                        textConfig: {
                          ...selectedLayer.textConfig,
                          italic: nextItalic,
                        },
                      },
                      true,
                      'Toggle Italic'
                    );
                  }
                }}
                className={`p-1 rounded ${
                  (selectedLayer?.type === 'text' && selectedLayer.textConfig
                    ? selectedLayer.textConfig.italic
                    : toolSettings.text.italic)
                    ? 'bg-[#1685ff] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
                title="Italic"
              >
                <Italic size={12} />
              </button>
            </div>

            {/* Color swatch */}
            <div
              onClick={() => {
                setColorPickerTarget('fg');
                setShowColorPickerModal(true);
              }}
              className="w-5 h-5 rounded border border-[#444444] cursor-pointer shadow-sm"
              style={{
                backgroundColor:
                  selectedLayer?.type === 'text' && selectedLayer.textConfig
                    ? selectedLayer.textConfig.color
                    : fgColor,
              }}
              title="Change Text Color"
            />
          </div>
        )}

        {/* SHAPE TOOL OPTIONS */}
        {activeTool === 'shape' && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Shape:</span>
            <div className="flex items-center bg-[#202020] border border-[#3a3a3a] rounded p-0.5">
              {(
                [
                  ['rectangle', Square, 'Rectangle'],
                  ['circle', Circle, 'Circle'],
                  ['star', Star, 'Star'],
                  ['polygon', Hexagon, 'Polygon'],
                  ['arrow', MoveRight, 'Arrow'],
                  ['line', Minus, 'Line'],
                ] as const
              ).map(([shType, Icon, label]) => (
                <button
                  key={shType}
                  onClick={() =>
                    updateToolSettings('shape', { shapeType: shType as ShapeType })
                  }
                  className={`p-1 rounded ${
                    toolSettings.shape.shapeType === shType
                      ? 'bg-[#1685ff] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                  title={label}
                >
                  <Icon size={13} />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-neutral-400">Fill:</span>
              <div
                onClick={() => {
                  setColorPickerTarget('fg');
                  setShowColorPickerModal(true);
                }}
                className="w-4 h-4 rounded border border-white/20 cursor-pointer"
                style={{ backgroundColor: toolSettings.shape.fillColor }}
                title="Shape Fill Color"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-neutral-400">Stroke:</span>
              <div
                onClick={() => {
                  setColorPickerTarget('bg');
                  setShowColorPickerModal(true);
                }}
                className="w-4 h-4 rounded border border-white/20 cursor-pointer"
                style={{ backgroundColor: toolSettings.shape.strokeColor }}
                title="Shape Stroke Color"
              />
              <input
                type="number"
                min="0"
                max="24"
                value={toolSettings.shape.strokeWidth}
                onChange={(e) =>
                  updateToolSettings('shape', {
                    strokeWidth: parseInt(e.target.value) || 0,
                  })
                }
                className="w-10 bg-[#202020] border border-[#3a3a3a] text-neutral-200 rounded px-1 py-0.5 text-center font-mono outline-none text-[10px]"
              />
              <span className="text-neutral-400 text-[10px]">px</span>
            </div>
          </div>
        )}

        {/* GRADIENT TOOL OPTIONS */}
        {activeTool === 'gradient' && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Gradient:</span>
            <select
              value={toolSettings.gradient.preset}
              onChange={(e) =>
                updateToolSettings('gradient', { preset: e.target.value as any })
              }
              className="bg-[#202020] border border-[#3a3a3a] text-neutral-200 rounded px-1.5 py-0.5 outline-none text-[11px]"
            >
              <option value="sunrise">Sunrise (Orange to Pink)</option>
              <option value="cyber">Cyberpunk (Neon Cyan to Magenta)</option>
              <option value="neon">Electric Neon (Lime to Cyan)</option>
              <option value="twilight">Twilight (Purple to Deep Blue)</option>
              <option value="sunset">Sunset Gold (Gold to Crimson)</option>
              <option value="monochrome">Monochrome (White to Black)</option>
            </select>
            <div className="flex items-center bg-[#202020] border border-[#3a3a3a] rounded p-0.5">
              <button
                onClick={() => updateToolSettings('gradient', { type: 'linear' })}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  toolSettings.gradient.type === 'linear'
                    ? 'bg-[#1685ff] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Linear
              </button>
              <button
                onClick={() => updateToolSettings('gradient', { type: 'radial' })}
                className={`px-2 py-0.5 rounded text-[10px] ${
                  toolSettings.gradient.type === 'radial'
                    ? 'bg-[#1685ff] text-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Radial
              </button>
            </div>
            <span className="text-neutral-400 italic text-[10px]">
              Drag line across canvas to render
            </span>
          </div>
        )}

        {/* EYEDROPPER OPTIONS */}
        {activeTool === 'eyedropper' && (
          <div className="flex items-center gap-2">
            <span className="text-neutral-400">Sample:</span>
            <div className="flex items-center bg-[#202020] border border-[#3a3a3a] rounded p-0.5">
              {[1, 3, 5].map((sz) => (
                <button
                  key={sz}
                  onClick={() => updateToolSettings('eyedropper', { sampleSize: sz as any })}
                  className={`px-2 py-0.5 rounded text-[10px] ${
                    toolSettings.eyedropper.sampleSize === sz
                      ? 'bg-[#1685ff] text-white'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {sz === 1 ? 'Point' : `${sz}×${sz}`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5 ml-2">
              <span className="text-neutral-400">Sampled:</span>
              <div
                className="w-4 h-4 rounded border border-white/30 shadow-inner"
                style={{ backgroundColor: fgColor }}
              />
              <span className="font-mono text-neutral-300 text-[10px] uppercase">
                {fgColor}
              </span>
            </div>
          </div>
        )}

        {/* HAND TOOL OPTIONS */}
        {activeTool === 'hand' && (
          <div className="flex items-center gap-2 text-neutral-300">
            <span>Click and drag anywhere to pan image (or hold Spacebar)</span>
            <button
              onClick={fitToScreen}
              className="px-2 py-0.5 bg-[#383838] hover:bg-[#444] rounded text-[10px]"
            >
              Reset Pan & Fit
            </button>
          </div>
        )}

        {/* ZOOM TOOL OPTIONS */}
        {activeTool === 'zoom' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setZoom((z) => Math.min(10, z + 0.5))}
              className="px-2 py-0.5 bg-[#383838] hover:bg-[#444] rounded text-[10px]"
            >
              Zoom In (+)
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.1, z - 0.5))}
              className="px-2 py-0.5 bg-[#383838] hover:bg-[#444] rounded text-[10px]"
            >
              Zoom Out (-)
            </button>
            <button
              onClick={fitToScreen}
              className="px-2 py-0.5 bg-[#383838] hover:bg-[#444] rounded text-[10px]"
            >
              Fit on Screen
            </button>
            <button
              onClick={() => zoomTo(100)}
              className="px-2 py-0.5 bg-[#383838] hover:bg-[#444] rounded text-[10px]"
            >
              100%
            </button>
          </div>
        )}
      </div>

      {/* Right: Quick AI Features shortcuts */}
      <div className="flex items-center gap-2">
        <button
          onClick={autoEnhanceImage}
          disabled={isProcessingAI || !selectedLayer?.dataUrl}
          className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded text-[10px] font-semibold transition-all disabled:opacity-40 shadow-sm"
          title="Analyze lighting, color saturation and dynamic range automatically"
        >
          <Sparkles size={11} />
          <span>Auto Enhance</span>
        </button>

        <button
          onClick={removeBackground}
          disabled={isProcessingAI || !selectedLayer?.dataUrl}
          className="flex items-center gap-1 px-2.5 py-1 bg-[#3a3a3a] hover:bg-[#484848] text-neutral-200 rounded text-[10px] font-medium transition-colors disabled:opacity-40"
          title="Instant Background Removal"
        >
          <Scissors size={11} />
          <span>Remove BG</span>
        </button>
      </div>
    </div>
  );
};
