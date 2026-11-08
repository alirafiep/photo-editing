import React, { useState } from 'react';
import { X, Film, Check, Sparkles, Monitor, Smartphone, Square } from 'lucide-react';
import { useVideo } from '../../context/VideoContext';
import { SnapEditLogo } from '../common/SnapEditLogo';

interface NewVideoProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated?: () => void;
}

export const NewVideoProjectModal: React.FC<NewVideoProjectModalProps> = ({ isOpen, onClose, onCreated }) => {
  const { createNewProject, loadSampleShowcase } = useVideo();

  const [projectName, setProjectName] = useState('My Black Canvas Edit');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:5' | '4:3' | 'custom'>('16:9');
  const [resolution, setResolution] = useState<'720p' | '1080p' | '2k' | '4k'>('1080p');
  const [fps, setFps] = useState<24 | 30 | 60>(30);
  const [customWidth, setCustomWidth] = useState(1920);
  const [customHeight, setCustomHeight] = useState(1080);

  if (!isOpen) return null;

  const handleCreate = () => {
    createNewProject({
      name: projectName.trim() || 'Untitled Video Project',
      aspectRatio,
      resolution,
      fps,
    });
    onClose();
    onCreated?.();
  };

  const handleLoadShowcase = () => {
    loadSampleShowcase();
    onClose();
    onCreated?.();
  };

  const ASPECT_OPTIONS = [
    { id: '16:9', label: '16:9 YouTube / Film', icon: Monitor, desc: 'Landscape standard' },
    { id: '9:16', label: '9:16 TikTok / Shorts', icon: Smartphone, desc: 'Vertical mobile' },
    { id: '1:1', label: '1:1 Square Post', icon: Square, desc: 'Instagram feed' },
    { id: '4:5', label: '4:5 Social Portrait', icon: Smartphone, desc: 'Portrait feed' },
    { id: '4:3', label: '4:3 Classic TV', icon: Monitor, desc: 'Vintage ratio' },
    { id: 'custom', label: 'Custom Ratio', icon: Film, desc: 'User dimensions' },
  ] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-[#1c1c1c] border border-[#383838] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#e0e0e0]">
        {/* Header with official SNAPEDIT logo */}
        <div className="h-14 px-6 bg-[#161616] border-b border-[#2d2d2d] flex items-center justify-between">
          <SnapEditLogo size="sm" showText showTagline />
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-[#282828] text-neutral-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Black Canvas Notice Banner */}
          <div className="bg-[#111111] border border-[#2b2b2b] rounded-xl p-3.5 flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-black border border-neutral-700 flex items-center justify-center shrink-0 shadow-inner">
              <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white mb-0.5">Pure Black Canvas Mode</div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Starts with an empty timeline and pure black (#000000) canvas. Import your videos, audio, or images to begin editing.
              </p>
            </div>
          </div>

          {/* Project Title */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="E.g. Summer Cinematic Vlog"
              className="w-full bg-[#141414] border border-[#333] rounded-xl px-3.5 py-2 text-xs text-white outline-none focus:border-[#1685ff] transition-colors"
            />
          </div>

          {/* Aspect Ratio Presets */}
          <div>
            <label className="text-xs font-semibold text-neutral-300 block mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ASPECT_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = aspectRatio === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAspectRatio(opt.id as any)}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-[#1685ff]/15 border-[#1685ff] text-white shadow-md'
                        : 'bg-[#141414] border-[#2e2e2e] hover:bg-[#202020] text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Icon size={16} className={isSelected ? 'text-[#1685ff]' : 'text-neutral-500'} />
                      {isSelected && <Check size={14} className="text-[#1685ff]" />}
                    </div>
                    <div className="text-xs font-bold text-neutral-200">{opt.id}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{opt.desc}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Dimension Inputs if selected */}
          {aspectRatio === 'custom' && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-[#141414] border border-[#2e2e2e] rounded-xl">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Custom Width (px)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1920)}
                  className="w-full bg-[#1c1c1c] border border-[#383838] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Custom Height (px)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1080)}
                  className="w-full bg-[#1c1c1c] border border-[#383838] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono"
                />
              </div>
            </div>
          )}

          {/* Resolution & Frame Rate */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Resolution</label>
              <div className="flex bg-[#141414] border border-[#2e2e2e] rounded-xl p-1 gap-1 text-xs">
                {(['720p', '1080p', '2k', '4k'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setResolution(r)}
                    className={`flex-1 py-1.5 rounded-lg font-bold text-center uppercase transition-all ${
                      resolution === r ? 'bg-[#1685ff] text-white shadow' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-neutral-300 block mb-1.5">Frame Rate (FPS)</label>
              <div className="flex bg-[#141414] border border-[#2e2e2e] rounded-xl p-1 gap-1 text-xs">
                {([24, 30, 60] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFps(f)}
                    className={`flex-1 py-1.5 rounded-lg font-mono font-semibold text-center transition-all ${
                      fps === f ? 'bg-[#1685ff] text-white shadow' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="h-16 px-6 bg-[#161616] border-t border-[#2d2d2d] flex items-center justify-between">
          <button
            type="button"
            onClick={handleLoadShowcase}
            className="text-xs text-neutral-400 hover:text-[#1685ff] flex items-center gap-1.5 transition-colors font-medium"
          >
            <Sparkles size={13} />
            <span>Load Demo Clips</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#262626] hover:bg-[#303030] text-neutral-300 rounded-xl text-xs font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              className="px-5 py-2 bg-gradient-to-r from-[#1685ff] to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-[#1685ff]/20 transition-all flex items-center gap-2"
            >
              <Film size={14} />
              <span>Create Black Canvas</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
