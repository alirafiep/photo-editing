import React, { useState } from 'react';
import { X, Download, Film, Check, Loader2, Sparkles } from 'lucide-react';
import { useVideo } from '../../context/VideoContext';
import { SnapEditLogo } from '../common/SnapEditLogo';

interface VideoExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VideoExportModal: React.FC<VideoExportModalProps> = ({ isOpen, onClose }) => {
  const { project, exportVideo, isExporting, exportProgress } = useVideo();

  const [resolution, setResolution] = useState<'720p' | '1080p' | '2k' | '4k'>('1080p');
  const [fps, setFps] = useState<number>(30);
  const [format, setFormat] = useState<'webm' | 'mp4'>('mp4');
  const [quality, setQuality] = useState<'Standard' | 'High' | 'Ultra'>('High');

  if (!isOpen) return null;

  const handleStartExport = async () => {
    await exportVideo(resolution, fps, format);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 select-none animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#1e1e1e] border border-[#383838] rounded-2xl shadow-2xl overflow-hidden text-[#e0e0e0]">
        {/* Header with SNAPEDIT Logo */}
        <div className="h-14 px-5 bg-[#161616] border-b border-[#2d2d2d] flex items-center justify-between">
          <SnapEditLogo size="sm" showText />
          {!isExporting && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-[#282828] text-neutral-400 hover:text-white transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 text-xs">
          <div className="text-xs font-bold text-white flex items-center gap-1.5">
            <Download size={14} className="text-[#1685ff]" />
            <span>Export & Render Project</span>
          </div>

          {/* Resolution Presets */}
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1.5 font-medium">
              Output Resolution
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(
                [
                  ['720p', 'HD 720p'],
                  ['1080p', 'FHD 1080p'],
                  ['2k', '2K Quad'],
                  ['4k', '4K UHD'],
                ] as const
              ).map(([resKey, label]) => (
                <button
                  key={resKey}
                  type="button"
                  disabled={isExporting}
                  onClick={() => setResolution(resKey)}
                  className={`py-2 rounded-xl border font-bold text-center transition-all ${
                    resolution === resKey
                      ? 'bg-[#1685ff] border-[#1685ff] text-white shadow-md'
                      : 'bg-[#141414] border-[#333] text-neutral-300 hover:bg-[#222]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Framerate Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1.5 font-medium">
                Frame Rate (FPS)
              </label>
              <div className="flex bg-[#141414] border border-[#333] rounded-xl p-1 gap-1">
                {[24, 30, 60].map((f) => (
                  <button
                    key={f}
                    type="button"
                    disabled={isExporting}
                    onClick={() => setFps(f)}
                    className={`flex-1 py-1 rounded-lg font-mono font-bold text-center transition-all ${
                      fps === f
                        ? 'bg-[#1685ff] text-white shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Container Format */}
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1.5 font-medium">
                Container Format
              </label>
              <div className="flex bg-[#141414] border border-[#333] rounded-xl p-1 gap-1">
                {(['mp4', 'webm'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    disabled={isExporting}
                    onClick={() => setFormat(fmt)}
                    className={`flex-1 py-1 rounded-lg font-mono font-bold uppercase text-center transition-all ${
                      format === fmt
                        ? 'bg-[#1685ff] text-white shadow'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {fmt}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quality Bitrate Preset */}
          <div>
            <label className="text-[11px] text-neutral-400 block mb-1.5 font-medium">
              Export Bitrate & Quality
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Standard', 'High', 'Ultra'] as const).map((q) => (
                <button
                  key={q}
                  type="button"
                  disabled={isExporting}
                  onClick={() => setQuality(q)}
                  className={`py-1.5 rounded-xl border font-semibold text-center transition-all ${
                    quality === q
                      ? 'bg-[#1685ff]/20 border-[#1685ff] text-white'
                      : 'bg-[#141414] border-[#333] text-neutral-400 hover:text-white'
                  }`}
                >
                  {q} Quality
                </button>
              ))}
            </div>
          </div>

          {/* Export Progress Bar if Active */}
          {isExporting && (
            <div className="bg-[#141414] border border-[#1685ff]/50 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-white font-semibold">
                  <Loader2 size={14} className="animate-spin text-[#1685ff]" />
                  <span>Rendering Video Frames...</span>
                </span>
                <span className="font-mono text-[#1685ff] font-bold">{exportProgress}%</span>
              </div>
              <div className="w-full h-2 bg-[#2a2a2a] rounded-full overflow-hidden">
                <div
                  style={{ width: `${exportProgress}%` }}
                  className="h-full bg-gradient-to-r from-[#1685ff] to-purple-500 transition-all duration-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-16 px-5 bg-[#161616] border-t border-[#2d2d2d] flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 bg-[#262626] hover:bg-[#303030] text-neutral-300 rounded-xl text-xs font-semibold disabled:opacity-40 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleStartExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#1685ff] to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-[#1685ff]/25 disabled:opacity-50 transition-all"
          >
            <Download size={14} />
            <span>{isExporting ? 'Encoding...' : 'Export & Download'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
