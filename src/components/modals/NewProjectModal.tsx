import React, { useState, useRef } from 'react';
import {
  X,
  FilePlus,
  FolderOpen,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { SAMPLE_PROJECTS, SampleTemplate } from '../../utils/sampleData';

const PRESETS = [
  { name: 'Full HD Landscape', width: 1920, height: 1080, desc: '16:9 1080p' },
  { name: 'Instagram Square', width: 1080, height: 1080, desc: '1:1 Feed Post' },
  { name: 'Story / Reel', width: 1080, height: 1920, desc: '9:16 Mobile Vertical' },
  { name: 'Social Banner', width: 1200, height: 630, desc: 'OpenGraph / Facebook' },
  { name: 'Desktop 2K', width: 2560, height: 1440, desc: '1440p High Res' },
  { name: 'Photo Print 4×6', width: 1800, height: 1200, desc: '3:2 300 DPI' },
];

export const NewProjectModal: React.FC = () => {
  const {
    showNewModal,
    setShowNewModal,
    createNewProject,
    openSampleProject,
    openImageFiles,
  } = useEditor();

  const [name, setName] = useState('Untitled Project');
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [bgChoice, setBgChoice] = useState<'#ffffff' | '#181818' | 'transparent'>('#ffffff');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!showNewModal) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createNewProject(name || 'Untitled Document', width, height, bgChoice);
  };

  const handleSelectPreset = (p: typeof PRESETS[0]) => {
    setWidth(p.width);
    setHeight(p.height);
    setName(p.name);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#242424] border border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden flex flex-col text-[#e0e0e0] max-h-[90vh]">
        {/* Modal Header */}
        <div className="h-12 px-5 bg-[#202020] border-b border-[#3a3a3a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-[#1685ff] flex items-center justify-center font-bold text-white text-xs">
              Se
            </div>
            <span className="font-bold text-white text-sm">New Document / Open Photo</span>
          </div>
          <button
            onClick={() => setShowNewModal(false)}
            className="p-1 rounded hover:bg-[#333] hover:text-white text-neutral-400 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick Open File Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => e.target.files && openImageFiles(e.target.files)}
            multiple
            accept="image/png,image/jpeg,image/webp,image/jpg"
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#3a3a3a] hover:border-[#1685ff] bg-[#1e1e1e] hover:bg-[#222] p-5 rounded-xl cursor-pointer text-center transition-all group"
          >
            <div className="w-10 h-10 rounded-full bg-[#2a2a2a] group-hover:bg-[#1685ff] text-neutral-300 group-hover:text-white flex items-center justify-center mx-auto mb-2 transition-colors">
              <FolderOpen size={18} />
            </div>
            <div className="font-semibold text-white text-sm">Open Photo from Computer</div>
            <div className="text-xs text-neutral-400 mt-0.5">
              Supports PNG, JPG, JPEG, WEBP · Drag & drop onto workspace anytime
            </div>
          </div>

          {/* Sample Photos Gallery */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-[#1685ff]" />
              <span className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
                Start with High-Resolution Sample Photo
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SAMPLE_PROJECTS.map((sample) => (
                <div
                  key={sample.id}
                  onClick={() => openSampleProject(sample)}
                  className="group rounded-lg overflow-hidden border border-[#3a3a3a] hover:border-[#1685ff] bg-[#1e1e1e] cursor-pointer transition-all hover:scale-[1.02] shadow"
                >
                  <div className="h-24 bg-[#111] overflow-hidden relative">
                    <img
                      src={sample.imageSrc}
                      alt={sample.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/70 backdrop-blur-sm rounded text-[9px] font-medium text-neutral-200">
                      {sample.category}
                    </div>
                  </div>
                  <div className="p-2">
                    <div className="font-medium text-white text-xs truncate">
                      {sample.title}
                    </div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      {sample.width} × {sample.height}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Custom Canvas Presets */}
          <form onSubmit={handleCreate} className="space-y-4 pt-4 border-t border-[#3a3a3a]">
            <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider">
              Or Create Blank Custom Canvas
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PRESETS.map((p) => {
                const isSelected = width === p.width && height === p.height;
                return (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => handleSelectPreset(p)}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      isSelected
                        ? 'bg-[#1685ff]/20 border-[#1685ff] text-white'
                        : 'bg-[#1e1e1e] border-[#3a3a3a] hover:bg-[#282828] text-neutral-300'
                    }`}
                  >
                    <div className="font-medium text-xs truncate">{p.name}</div>
                    <div className="text-[10px] text-neutral-400 font-mono mt-0.5">
                      {p.width} × {p.height} · {p.desc}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Custom Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Document Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded px-3 py-1.5 text-xs text-white outline-none focus:border-[#1685ff]"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Width (px)</label>
                <input
                  type="number"
                  min="64"
                  max="8000"
                  value={width}
                  onChange={(e) => setWidth(parseInt(e.target.value) || 1080)}
                  className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-[#1685ff]"
                />
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Height (px)</label>
                <input
                  type="number"
                  min="64"
                  max="8000"
                  value={height}
                  onChange={(e) => setHeight(parseInt(e.target.value) || 1080)}
                  className="w-full bg-[#1c1c1c] border border-[#3a3a3a] rounded px-3 py-1.5 font-mono text-xs text-white outline-none focus:border-[#1685ff]"
                />
              </div>
            </div>

            {/* Background fill color selection */}
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1.5">
                Background Contents
              </label>
              <div className="flex items-center gap-2">
                {[
                  { id: '#ffffff', label: 'White' },
                  { id: '#181818', label: 'Dark (#181818)' },
                  { id: 'transparent', label: 'Transparent' },
                ].map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => setBgChoice(b.id as any)}
                    className={`px-3 py-1.5 rounded text-xs border transition-colors flex items-center gap-1.5 ${
                      bgChoice === b.id
                        ? 'bg-[#1685ff]/20 border-[#1685ff] text-white font-medium'
                        : 'bg-[#1e1e1e] border-[#3a3a3a] text-neutral-300 hover:bg-[#282828]'
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full border border-white/20 inline-block"
                      style={{
                        backgroundColor: b.id === 'transparent' ? '#888' : b.id,
                      }}
                    />
                    <span>{b.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-4 py-2 bg-[#333] hover:bg-[#404040] text-neutral-300 rounded text-xs transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1685ff] hover:bg-[#0070eb] text-white font-semibold rounded text-xs transition-colors shadow-md"
              >
                Create Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
