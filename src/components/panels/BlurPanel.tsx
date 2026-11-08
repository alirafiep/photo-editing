import React, { useState } from 'react';
import {
  Wand2,
  Sparkles,
  Undo2,
  Redo2,
  Check,
  X,
  Sliders,
  Paintbrush,
  Eraser,
  RotateCw,
  Focus,
  Sun,
  Maximize2,
  Move,
  Eye,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { BlurToolType, BlurSettings, DEFAULT_BLUR_SETTINGS } from '../../types/editor';
import { processBlurEffect } from '../../utils/blurProcessing';

interface BlurToolItem {
  id: BlurToolType;
  name: string;
  desc: string;
}

const BLUR_TOOLS: BlurToolItem[] = [
  { id: 'gaussian', name: 'Gaussian Blur', desc: 'Smooth, natural overall blur' },
  { id: 'motion', name: 'Motion Blur', desc: 'Directional velocity streak blur' },
  { id: 'background', name: 'Background Blur', desc: 'Isolate & keep subject crisp' },
  { id: 'lens', name: 'Lens Blur / Bokeh', desc: 'Camera aperture highlight bloom' },
  { id: 'radial', name: 'Radial Blur', desc: 'Circular spinning vortex blur' },
  { id: 'zoom', name: 'Zoom Blur', desc: 'Explosive radial perspective zoom' },
  { id: 'tilt-shift', name: 'Tilt-Shift Blur', desc: 'Miniature linear focus plane' },
  { id: 'selective', name: 'Selective Blur', desc: 'Blur active marquee/lasso region' },
  { id: 'face-bg', name: 'Face Background Blur', desc: 'Portrait mode subject focus' },
  { id: 'brush', name: 'Custom Brush Blur', desc: 'Paint blur directly on canvas' },
];

export const BlurPanel: React.FC = () => {
  const {
    selectedLayer,
    updateLayer,
    selection,
    undo,
    redo,
    historyIndex,
    history,
    showToast,
    activeTool,
    setActiveTool,
    toolSettings,
    updateToolSettings,
  } = useEditor();

  const [settings, setSettings] = useState<BlurSettings>({ ...DEFAULT_BLUR_SETTINGS });
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  const handleSelectTool = (type: BlurToolType) => {
    setSettings((s) => ({ ...s, toolType: type }));
    if (type === 'brush') {
      setActiveTool('blur');
      showToast('Click and drag on canvas to paint blur');
    }
  };

  const handleLivePreview = async () => {
    if (!selectedLayer || !selectedLayer.dataUrl) {
      showToast('Select an image layer first');
      return;
    }

    if (!originalUrl) {
      setOriginalUrl(selectedLayer.dataUrl);
    }

    setIsApplying(true);
    try {
      const srcToBlur = originalUrl || selectedLayer.dataUrl;
      const blurredDataUrl = await processBlurEffect(srcToBlur, settings, selection);
      updateLayer(selectedLayer.id, { dataUrl: blurredDataUrl });
    } catch (e) {
      console.error(e);
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyPermanent = () => {
    if (!selectedLayer) return;
    updateLayer(selectedLayer.id, {}, true, `Apply ${settings.toolType.toUpperCase()} Blur`);
    setOriginalUrl(null);
    showToast(`Applied ${settings.toolType} blur effect`);
  };

  const handleCancel = () => {
    if (!selectedLayer || !originalUrl) return;
    updateLayer(selectedLayer.id, { dataUrl: originalUrl });
    setOriginalUrl(null);
    showToast('Blur effect cancelled');
  };

  return (
    <div className="flex flex-col h-full text-xs text-[#e0e0e0] select-none">
      {/* Header Bar */}
      <div className="p-2.5 border-b border-[#3a3a3a] bg-[#222222] flex items-center justify-between">
        <span className="font-semibold text-neutral-300 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
          <Wand2 size={13} className="text-[#1685ff]" />
          <span>Blur Studio (10 Tools)</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1 hover:bg-[#333] hover:text-white rounded text-neutral-400 disabled:opacity-30"
            title="Undo"
          >
            <Undo2 size={13} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1 hover:bg-[#333] hover:text-white rounded text-neutral-400 disabled:opacity-30"
            title="Redo"
          >
            <Redo2 size={13} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Blur Tool Grid */}
        <div className="grid grid-cols-2 gap-1.5">
          {BLUR_TOOLS.map((bt) => {
            const isSelected = settings.toolType === bt.id;
            return (
              <button
                key={bt.id}
                onClick={() => handleSelectTool(bt.id)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1685ff]/20 border-[#1685ff] text-white shadow-sm'
                    : 'bg-[#1c1c1c] border-[#383838] text-neutral-300 hover:bg-[#282828]'
                }`}
              >
                <div className="font-bold text-[11px] truncate">{bt.name}</div>
                <div className="text-[9px] text-neutral-400 mt-0.5 line-clamp-1">{bt.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Sliders & Parameters */}
        <div className="bg-[#1c1c1c] border border-[#383838] rounded-xl p-3 space-y-3">
          <div className="text-[11px] font-semibold text-neutral-300 uppercase tracking-wider flex items-center justify-between">
            <span>Settings</span>
            <span className="text-[10px] text-[#1685ff] capitalize">{settings.toolType}</span>
          </div>

          {/* Radius Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-neutral-400">Blur Radius</span>
              <span className="font-mono text-neutral-200">{settings.radius} px</span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              value={settings.radius}
              onChange={(e) => setSettings((s) => ({ ...s, radius: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Intensity Slider */}
          <div>
            <div className="flex justify-between text-[11px] mb-1">
              <span className="text-neutral-400">Blur Intensity</span>
              <span className="font-mono text-neutral-200">{settings.intensity}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="100"
              value={settings.intensity}
              onChange={(e) => setSettings((s) => ({ ...s, intensity: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          {/* Motion Angle (if motion blur) */}
          {settings.toolType === 'motion' && (
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-neutral-400">Motion Angle</span>
                <span className="font-mono text-neutral-200">{settings.angle || 0}°</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                value={settings.angle || 0}
                onChange={(e) => setSettings((s) => ({ ...s, angle: parseInt(e.target.value) }))}
                className="w-full"
              />
            </div>
          )}

          {/* Brush Controls for Brush Blur / Restore */}
          {settings.toolType === 'brush' && (
            <div className="pt-2 border-t border-[#333] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-neutral-400">Brush Mode</span>
                <div className="flex bg-[#252525] rounded p-0.5 border border-[#444]">
                  <button
                    onClick={() => setSettings((s) => ({ ...s, isEraserRestore: false }))}
                    className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 ${
                      !settings.isEraserRestore ? 'bg-[#1685ff] text-white' : 'text-neutral-400'
                    }`}
                  >
                    <Paintbrush size={10} /> Blur
                  </button>
                  <button
                    onClick={() => setSettings((s) => ({ ...s, isEraserRestore: true }))}
                    className={`px-2 py-0.5 text-[10px] rounded flex items-center gap-1 ${
                      settings.isEraserRestore ? 'bg-emerald-600 text-white' : 'text-neutral-400'
                    }`}
                  >
                    <Eraser size={10} /> Restore
                  </button>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-neutral-400">Brush Size</span>
                  <span className="font-mono text-neutral-200">{settings.brushSize} px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="180"
                  value={settings.brushSize}
                  onChange={(e) => setSettings((s) => ({ ...s, brushSize: parseInt(e.target.value) }))}
                  className="w-full"
                />
              </div>
            </div>
          )}

          {/* Live Preview Button */}
          <button
            onClick={handleLivePreview}
            disabled={isApplying}
            className="w-full py-2 bg-[#2a2a2a] hover:bg-[#333] border border-[#444] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles size={13} className="text-[#1685ff]" />
            <span>{isApplying ? 'Rendering Blur...' : 'Render Live Preview'}</span>
          </button>
        </div>
      </div>

      {/* Footer Actions (Apply / Cancel) */}
      <div className="p-3 border-t border-[#3a3a3a] bg-[#222222] flex items-center justify-between gap-2">
        <button
          onClick={handleCancel}
          disabled={!originalUrl}
          className="flex-1 py-1.5 px-3 bg-[#333] hover:bg-[#3e3e3e] text-neutral-300 rounded text-xs transition-colors disabled:opacity-40"
        >
          Cancel
        </button>
        <button
          onClick={handleApplyPermanent}
          className="flex-1 py-1.5 px-3 bg-[#1685ff] hover:bg-[#0070eb] text-white font-semibold rounded text-xs transition-colors shadow"
        >
          Apply Blur
        </button>
      </div>
    </div>
  );
};
