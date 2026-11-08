import React, { useState, useEffect } from 'react';
import { X, Download, FileImage, Check } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { exportCanvasImage } from '../../utils/imageProcessing';

export const ExportModal: React.FC = () => {
  const { showExportModal, setShowExportModal, activeProject, showToast } = useEditor();

  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp'>('png');
  const [scale, setScale] = useState<number>(1);
  const [quality, setQuality] = useState<number>(92);
  const [transparent, setTransparent] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string>('snapedit_export');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (activeProject) {
      setFileName(activeProject.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_'));
    }
  }, [activeProject]);

  // Generate preview
  useEffect(() => {
    if (!showExportModal || !activeProject) return;

    let isMounted = true;
    exportCanvasImage(
      activeProject.layers,
      activeProject.width,
      activeProject.height,
      format,
      quality / 100,
      0.25, // Small thumbnail scale for preview
      transparent
    )
      .then((url) => {
        if (isMounted) setPreviewUrl(url);
      })
      .catch((err) => console.error(err));

    return () => {
      isMounted = false;
    };
  }, [showExportModal, activeProject, format, quality, transparent]);

  if (!showExportModal || !activeProject) return null;

  const targetWidth = Math.round(activeProject.width * scale);
  const targetHeight = Math.round(activeProject.height * scale);

  const handleDownload = async () => {
    setIsExporting(true);
    try {
      const dataUrl = await exportCanvasImage(
        activeProject.layers,
        activeProject.width,
        activeProject.height,
        format,
        quality / 100,
        scale,
        transparent
      );

      const ext = format === 'jpeg' ? 'jpg' : format;
      const downloadName = `${fileName || 'photo'}.${ext}`;

      const link = document.createElement('a');
      link.download = downloadName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast(`Exported ${downloadName} (${targetWidth} × ${targetHeight}px)`);
      setShowExportModal(false);
    } catch (err) {
      console.error(err);
      showToast('Failed to export image');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-xl bg-[#242424] border border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[#e0e0e0]">
        {/* Header */}
        <div className="h-12 px-5 bg-[#202020] border-b border-[#3a3a3a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download size={16} className="text-[#1685ff]" />
            <span className="font-bold text-white text-sm">Export & Download Image</span>
          </div>
          <button
            onClick={() => setShowExportModal(false)}
            className="p-1 rounded hover:bg-[#333] hover:text-white text-neutral-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* File Name */}
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1">File Name</label>
            <div className="flex items-center bg-[#1c1c1c] border border-[#3a3a3a] rounded px-3 py-1.5 focus-within:border-[#1685ff]">
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-transparent text-xs text-white outline-none"
              />
              <span className="text-neutral-500 text-xs font-mono ml-2">
                .{format === 'jpeg' ? 'jpg' : format}
              </span>
            </div>
          </div>

          {/* Format Selection */}
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1.5">File Format</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'png', label: 'PNG', desc: 'Lossless & Transparency' },
                { id: 'jpeg', label: 'JPG / JPEG', desc: 'Compact Web Photo' },
                { id: 'webp', label: 'WEBP', desc: 'Modern High Compression' },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setFormat(fmt.id as any)}
                  className={`p-2.5 rounded-lg border text-left transition-all ${
                    format === fmt.id
                      ? 'bg-[#1685ff]/20 border-[#1685ff] text-white'
                      : 'bg-[#1e1e1e] border-[#3a3a3a] text-neutral-300 hover:bg-[#282828]'
                  }`}
                >
                  <div className="font-bold text-xs">{fmt.label}</div>
                  <div className="text-[10px] text-neutral-400 mt-0.5">{fmt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Scale Resolution Multiplier */}
          <div>
            <div className="flex justify-between items-center text-[11px] mb-1.5">
              <span className="text-neutral-400">Scale Resolution</span>
              <span className="font-mono text-neutral-200">
                {targetWidth} × {targetHeight} px
              </span>
            </div>
            <div className="flex items-center gap-2">
              {[
                { s: 0.5, label: '0.5× (Half)' },
                { s: 1, label: '1× (Original)' },
                { s: 2, label: '2× (Ultra HD)' },
              ].map((item) => (
                <button
                  key={item.s}
                  type="button"
                  onClick={() => setScale(item.s)}
                  className={`flex-1 py-1.5 rounded text-xs border transition-colors ${
                    scale === item.s
                      ? 'bg-[#1685ff] border-[#1685ff] text-white font-medium'
                      : 'bg-[#1e1e1e] border-[#3a3a3a] text-neutral-300 hover:bg-[#282828]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Quality Slider (for JPG and WEBP) */}
          {format !== 'png' && (
            <div>
              <div className="flex justify-between items-center text-[11px] mb-1">
                <span className="text-neutral-400">Compression Quality</span>
                <span className="font-mono text-neutral-200">{quality}%</span>
              </div>
              <input
                type="range"
                min="30"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
          )}

          {/* Transparency Option (for PNG and WEBP) */}
          {format !== 'jpeg' && (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="transparent-toggle"
                checked={transparent}
                onChange={(e) => setTransparent(e.target.checked)}
                className="rounded bg-[#1c1c1c] border-[#3a3a3a] text-[#1685ff] focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor="transparent-toggle"
                className="text-xs text-neutral-300 cursor-pointer"
              >
                Preserve Transparent Background (Alpha Channel)
              </label>
            </div>
          )}

          {/* Live Preview & Dimension Summary */}
          <div className="bg-[#1c1c1c] border border-[#3a3a3a] rounded-lg p-3 flex items-center gap-4">
            <div className="w-16 h-16 rounded bg-[#111] overflow-hidden border border-[#333] shrink-0 canvas-checkerboard flex items-center justify-center">
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Export preview"
                  className="w-full h-full object-contain"
                />
              )}
            </div>
            <div className="text-xs space-y-0.5">
              <div className="text-white font-medium truncate">
                {fileName}.{format === 'jpeg' ? 'jpg' : format}
              </div>
              <div className="text-neutral-400 font-mono text-[11px]">
                {targetWidth} × {targetHeight} pixels
              </div>
              <div className="text-[10px] text-emerald-400">
                Ready for high-quality export
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-5 bg-[#202020] border-t border-[#3a3a3a] flex items-center justify-end gap-3">
          <button
            onClick={() => setShowExportModal(false)}
            className="px-4 py-2 bg-[#333] hover:bg-[#404040] text-neutral-300 rounded text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 bg-[#1685ff] hover:bg-[#0070eb] text-white font-semibold rounded text-xs transition-colors shadow-md disabled:opacity-50"
          >
            <Download size={14} />
            <span>{isExporting ? 'Exporting...' : 'Download Image'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
