import React, { useState, useEffect } from 'react';
import { X, Maximize2, Link2, Link2Off } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const ResizeModal: React.FC = () => {
  const { showResizeModal, setShowResizeModal, activeProject, updateLayer, recordHistory, showToast } =
    useEditor();

  const [mode, setMode] = useState<'image' | 'canvas'>('image');
  const [width, setWidth] = useState<number>(1920);
  const [height, setHeight] = useState<number>(1080);
  const [lockAspect, setLockAspect] = useState<boolean>(true);

  useEffect(() => {
    if (activeProject) {
      setWidth(activeProject.width);
      setHeight(activeProject.height);
    }
  }, [activeProject, showResizeModal]);

  if (!showResizeModal || !activeProject) return null;

  const handleWidthChange = (val: number) => {
    const nextW = Math.max(10, val);
    setWidth(nextW);
    if (lockAspect && activeProject.width > 0) {
      const ratio = activeProject.height / activeProject.width;
      setHeight(Math.round(nextW * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    const nextH = Math.max(10, val);
    setHeight(nextH);
    if (lockAspect && activeProject.height > 0) {
      const ratio = activeProject.width / activeProject.height;
      setWidth(Math.round(nextH * ratio));
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (width <= 0 || height <= 0) return;

    if (mode === 'image') {
      // Scale all layers proportionally
      const scaleX = width / activeProject.width;
      const scaleY = height / activeProject.height;

      const scaledLayers = activeProject.layers.map((l) => ({
        ...l,
        x: Math.round(l.x * scaleX),
        y: Math.round(l.y * scaleY),
        width: Math.round(l.width * scaleX),
        height: Math.round(l.height * scaleY),
      }));

      activeProject.width = width;
      activeProject.height = height;
      activeProject.layers = scaledLayers;
      recordHistory(`Resize Image to ${width}×${height}`, scaledLayers);
      showToast(`Image resized to ${width} × ${height} px`);
    } else {
      // Canvas resize (expand or crop canvas boundary without scaling layers)
      activeProject.width = width;
      activeProject.height = height;
      recordHistory(`Resize Canvas to ${width}×${height}`, activeProject.layers);
      showToast(`Canvas resized to ${width} × ${height} px`);
    }

    setShowResizeModal(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#242424] border border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden text-[#e0e0e0]">
        <div className="h-11 px-4 bg-[#202020] border-b border-[#3a3a3a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Maximize2 size={15} className="text-[#1685ff]" />
            <span className="font-bold text-white text-xs">Resize Image & Canvas</span>
          </div>
          <button
            onClick={() => setShowResizeModal(false)}
            className="p-1 rounded hover:bg-[#333] hover:text-white text-neutral-400"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleApply} className="p-5 space-y-4 text-xs">
          {/* Mode Switch: Image Resize vs Canvas Resize */}
          <div className="flex bg-[#1c1c1c] p-1 rounded-lg border border-[#3a3a3a]">
            <button
              type="button"
              onClick={() => setMode('image')}
              className={`flex-1 py-1.5 rounded-md font-medium text-xs transition-colors ${
                mode === 'image'
                  ? 'bg-[#1685ff] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Image Size (Scale Contents)
            </button>
            <button
              type="button"
              onClick={() => setMode('canvas')}
              className={`flex-1 py-1.5 rounded-md font-medium text-xs transition-colors ${
                mode === 'canvas'
                  ? 'bg-[#1685ff] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Canvas Size (Adjust Bounds)
            </button>
          </div>

          {/* Width & Height Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-neutral-400 block mb-1">Width (px)</label>
              <input
                type="number"
                min="10"
                max="10000"
                value={width}
                onChange={(e) => handleWidthChange(parseInt(e.target.value) || 10)}
                className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded px-3 py-1.5 font-mono text-white outline-none focus:border-[#1685ff]"
              />
            </div>
            <div>
              <label className="text-neutral-400 block mb-1">Height (px)</label>
              <input
                type="number"
                min="10"
                max="10000"
                value={height}
                onChange={(e) => handleHeightChange(parseInt(e.target.value) || 10)}
                className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded px-3 py-1.5 font-mono text-white outline-none focus:border-[#1685ff]"
              />
            </div>
          </div>

          {/* Constrain Proportions */}
          <div className="flex items-center justify-between pt-1">
            <button
              type="button"
              onClick={() => setLockAspect(!lockAspect)}
              className={`flex items-center gap-2 px-2.5 py-1 rounded border transition-colors ${
                lockAspect
                  ? 'bg-[#1685ff]/20 border-[#1685ff] text-white'
                  : 'bg-[#1c1c1c] border-[#3a3a3a] text-neutral-400 hover:text-white'
              }`}
            >
              {lockAspect ? <Link2 size={13} /> : <Link2Off size={13} />}
              <span>Constrain Proportions</span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#3a3a3a]">
            <button
              type="button"
              onClick={() => setShowResizeModal(false)}
              className="px-4 py-2 bg-[#333] hover:bg-[#404040] text-neutral-300 rounded text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1685ff] hover:bg-[#0070eb] text-white font-medium rounded text-xs"
            >
              Apply Resize
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
