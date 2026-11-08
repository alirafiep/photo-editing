import React, { useState } from 'react';
import {
  Sliders,
  Maximize2,
  Volume2,
  Gauge,
  Sparkles,
  Zap,
  Key,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Trash2,
  Copy,
  Scissors,
  Eye,
  Type,
  Smile,
  Music,
  Plus,
  Check,
  ChevronRight,
  Palette,
  Film,
} from 'lucide-react';
import { useVideo } from '../../context/VideoContext';
import {
  VIDEO_EFFECTS_LIST,
  VIDEO_FILTERS_LIST,
  TRANSITIONS_LIST,
  ANIMATIONS_LIST,
} from '../../utils/videoProcessing';
import { BlendMode } from '../../types/editor';

export const VideoPropertiesPanel: React.FC = () => {
  const {
    project,
    currentTime,
    selectedItemType,
    selectedClipId,
    selectedClip,
    updateClip,
    deleteSelectedClip,
    duplicateSelectedClip,
    freezeFrameAtPlayhead,
    reverseClip,
    extractAudioFromClip,
    addKeyframe,
    removeKeyframe,
    selectedAudioId,
    updateAudioClip,
    deleteAudioClip,
    selectedTextId,
    updateTextOverlay,
    deleteTextOverlay,
    selectedStickerId,
    updateSticker,
    deleteSticker,
    setBackgroundColor,
    setProject,
  } = useVideo();

  const [activeTab, setActiveTab] = useState<'basic' | 'speed' | 'audio' | 'animation' | 'color'>('basic');

  const selectedAudio = project.audioClips.find((a) => a.id === selectedAudioId) || null;
  const selectedText = project.textOverlays?.find((t) => t.id === selectedTextId) || null;
  const selectedSticker = project.stickers?.find((s) => s.id === selectedStickerId) || null;

  const BLEND_MODES: { id: BlendMode; label: string }[] = [
    { id: 'source-over', label: 'Normal' },
    { id: 'screen', label: 'Screen' },
    { id: 'multiply', label: 'Multiply' },
    { id: 'overlay', label: 'Overlay' },
    { id: 'darken', label: 'Darken' },
    { id: 'lighten', label: 'Lighten' },
    { id: 'color-dodge', label: 'Color Dodge' },
    { id: 'soft-light', label: 'Soft Light' },
    { id: 'difference', label: 'Difference' },
  ];

  // -------------------------------------------------------------
  // 1. TEXT OVERLAY INSPECTOR
  // -------------------------------------------------------------
  if (selectedItemType === 'text' && selectedText) {
    return (
      <aside className="w-80 bg-[#1e1e1e] border-l border-[#2e2e2e] flex flex-col text-[#e0e0e0] select-none text-xs z-20 overflow-y-auto">
        <div className="h-11 px-4 bg-[#181818] border-b border-[#2e2e2e] flex items-center justify-between font-bold text-white shrink-0">
          <div className="flex items-center gap-2">
            <Type size={15} className="text-[#1685ff]" />
            <span>Text Properties</span>
          </div>
          <button
            onClick={() => deleteTextOverlay(selectedText.id)}
            className="p-1 text-neutral-400 hover:text-rose-400 rounded transition-colors"
            title="Delete text"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="p-4 space-y-5 flex-1">
          {/* Content */}
          <div>
            <label className="text-[11px] text-neutral-400 font-semibold block mb-1">Text Content</label>
            <textarea
              rows={2}
              value={selectedText.text}
              onChange={(e) => updateTextOverlay(selectedText.id, { text: e.target.value })}
              className="w-full bg-[#141414] border border-[#383838] rounded-lg p-2.5 text-xs text-white outline-none focus:border-[#1685ff]"
            />
          </div>

          {/* Typography */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Font Family</label>
              <select
                value={selectedText.fontFamily}
                onChange={(e) => updateTextOverlay(selectedText.id, { fontFamily: e.target.value })}
                className="w-full bg-[#141414] border border-[#383838] rounded-lg px-2 py-1.5 text-xs text-white outline-none"
              >
                <option value="Montserrat">Montserrat</option>
                <option value="Plus Jakarta Sans">Jakarta Sans</option>
                <option value="Playfair Display">Playfair Serif</option>
                <option value="Oswald">Oswald Bold</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
                <option value="Caveat">Caveat Handwriting</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Font Size ({selectedText.fontSize}px)</label>
              <input
                type="range"
                min="16"
                max="120"
                value={selectedText.fontSize}
                onChange={(e) => updateTextOverlay(selectedText.id, { fontSize: parseInt(e.target.value) })}
                className="w-full accent-[#1685ff]"
              />
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Text Color</label>
              <div className="flex items-center gap-2 bg-[#141414] border border-[#383838] p-1.5 rounded-lg">
                <input
                  type="color"
                  value={selectedText.color || '#ffffff'}
                  onChange={(e) => updateTextOverlay(selectedText.id, { color: e.target.value })}
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-[10px] text-neutral-300 uppercase">{selectedText.color}</span>
              </div>
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Stroke Outline</label>
              <div className="flex items-center gap-2 bg-[#141414] border border-[#383838] p-1.5 rounded-lg">
                <input
                  type="color"
                  value={selectedText.strokeColor || '#000000'}
                  onChange={(e) =>
                    updateTextOverlay(selectedText.id, {
                      strokeColor: e.target.value,
                      strokeWidth: selectedText.strokeWidth || 3,
                    })
                  }
                  className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                />
                <span className="font-mono text-[10px] text-neutral-300 uppercase">
                  {selectedText.strokeWidth ? `${selectedText.strokeWidth}px` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Text Animation */}
          <div>
            <label className="text-[11px] text-neutral-400 font-semibold block mb-1.5">Text Animation</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['none', 'pop', 'typewriter', 'glow', 'slide', 'fade'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => updateTextOverlay(selectedText.id, { animation: a })}
                  className={`py-1.5 px-2 rounded-lg text-[11px] capitalize border transition-all ${
                    selectedText.animation === a
                      ? 'bg-[#1685ff] border-[#1685ff] text-white font-bold'
                      : 'bg-[#141414] border-[#333] hover:bg-[#252525] text-neutral-400'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Position & Scale */}
          <div className="space-y-3 pt-2 border-t border-[#2e2e2e]">
            <div>
              <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                <span>Vertical Offset Y</span>
                <span className="font-mono text-neutral-300">{selectedText.posY}px</span>
              </div>
              <input
                type="range"
                min="-400"
                max="400"
                value={selectedText.posY}
                onChange={(e) => updateTextOverlay(selectedText.id, { posY: parseInt(e.target.value) })}
                className="w-full accent-[#1685ff]"
              />
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // 2. STICKER INSPECTOR
  // -------------------------------------------------------------
  if (selectedItemType === 'sticker' && selectedSticker) {
    return (
      <aside className="w-80 bg-[#1e1e1e] border-l border-[#2e2e2e] flex flex-col text-[#e0e0e0] select-none text-xs z-20 overflow-y-auto">
        <div className="h-11 px-4 bg-[#181818] border-b border-[#2e2e2e] flex items-center justify-between font-bold text-white shrink-0">
          <div className="flex items-center gap-2">
            <Smile size={15} className="text-amber-400" />
            <span>Sticker Properties</span>
          </div>
          <button
            onClick={() => deleteSticker(selectedSticker.id)}
            className="p-1 text-neutral-400 hover:text-rose-400 rounded transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          <div className="flex items-center justify-center p-6 bg-[#141414] border border-[#2e2e2e] rounded-xl text-5xl">
            {selectedSticker.content}
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Scale Size</span>
              <span className="font-mono text-neutral-300">{Math.round((selectedSticker.scale || 1) * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.4"
              max="3"
              step="0.1"
              value={selectedSticker.scale || 1}
              onChange={(e) => updateSticker(selectedSticker.id, { scale: parseFloat(e.target.value) })}
              className="w-full accent-[#1685ff]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Position X ({Math.round(selectedSticker.posX)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedSticker.posX}
              onChange={(e) => updateSticker(selectedSticker.id, { posX: parseFloat(e.target.value) })}
              className="w-full accent-[#1685ff]"
            />
          </div>

          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Position Y ({Math.round(selectedSticker.posY)}%)</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedSticker.posY}
              onChange={(e) => updateSticker(selectedSticker.id, { posY: parseFloat(e.target.value) })}
              className="w-full accent-[#1685ff]"
            />
          </div>

          <div>
            <label className="text-[11px] text-neutral-400 block mb-1.5">Sticker Animation</label>
            <div className="grid grid-cols-2 gap-1.5">
              {(['none', 'bounce', 'pulse', 'spin', 'shake'] as const).map((a) => (
                <button
                  key={a}
                  onClick={() => updateSticker(selectedSticker.id, { animation: a })}
                  className={`py-1.5 px-2 rounded-lg text-[11px] capitalize border transition-all ${
                    selectedSticker.animation === a
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                      : 'bg-[#141414] border-[#333] hover:bg-[#252525] text-neutral-400'
                  }`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // 3. AUDIO CLIP INSPECTOR
  // -------------------------------------------------------------
  if (selectedItemType === 'audio' && selectedAudio) {
    return (
      <aside className="w-80 bg-[#1e1e1e] border-l border-[#2e2e2e] flex flex-col text-[#e0e0e0] select-none text-xs z-20 overflow-y-auto">
        <div className="h-11 px-4 bg-[#181818] border-b border-[#2e2e2e] flex items-center justify-between font-bold text-white shrink-0">
          <div className="flex items-center gap-2">
            <Music size={15} className="text-emerald-400" />
            <span className="truncate max-w-[180px]">{selectedAudio.name}</span>
          </div>
          <button
            onClick={() => deleteAudioClip(selectedAudio.id)}
            className="p-1 text-neutral-400 hover:text-rose-400 rounded transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Volume */}
          <div>
            <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
              <span>Volume</span>
              <span className="font-mono text-emerald-400 font-bold">{Math.round(selectedAudio.volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="2"
              step="0.05"
              value={selectedAudio.volume}
              onChange={(e) => updateAudioClip(selectedAudio.id, { volume: parseFloat(e.target.value) })}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Fade In & Fade Out */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Fade In ({selectedAudio.fadeIn || 0}s)</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.2"
                value={selectedAudio.fadeIn || 0}
                onChange={(e) => updateAudioClip(selectedAudio.id, { fadeIn: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>
            <div>
              <label className="text-[11px] text-neutral-400 block mb-1">Fade Out ({selectedAudio.fadeOut || 0}s)</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.2"
                value={selectedAudio.fadeOut || 0}
                onChange={(e) => updateAudioClip(selectedAudio.id, { fadeOut: parseFloat(e.target.value) })}
                className="w-full accent-emerald-500"
              />
            </div>
          </div>

          {/* Noise Reduction Toggle */}
          <div className="pt-2 border-t border-[#2e2e2e] flex items-center justify-between">
            <div>
              <div className="font-semibold text-xs text-white">Noise Reduction</div>
              <div className="text-[10px] text-neutral-400">Filter background hum & hiss</div>
            </div>
            <button
              onClick={() => updateAudioClip(selectedAudio.id, { noiseReduction: !selectedAudio.noiseReduction })}
              className={`w-10 h-5 rounded-full transition-colors relative ${
                selectedAudio.noiseReduction ? 'bg-emerald-500' : 'bg-[#333]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                  selectedAudio.noiseReduction ? 'left-5.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // 4. VIDEO CLIP INSPECTOR (CapCut-Style Multi-Tab)
  // -------------------------------------------------------------
  if (selectedItemType === 'clip' && selectedClip) {
    return (
      <aside className="w-80 bg-[#1e1e1e] border-l border-[#2e2e2e] flex flex-col text-[#e0e0e0] select-none text-xs z-20 overflow-hidden">
        {/* Header */}
        <div className="h-11 px-4 bg-[#181818] border-b border-[#2e2e2e] flex items-center justify-between font-bold text-white shrink-0">
          <div className="flex items-center gap-2 truncate max-w-[180px]">
            <Film size={15} className="text-[#1685ff]" />
            <span className="truncate">{selectedClip.name}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={duplicateSelectedClip}
              className="p-1.5 hover:bg-[#2c2c2c] text-neutral-400 hover:text-white rounded transition-colors"
              title="Duplicate Clip (Ctrl+D)"
            >
              <Copy size={13} />
            </button>
            <button
              onClick={deleteSelectedClip}
              className="p-1.5 hover:bg-[#2c2c2c] text-neutral-400 hover:text-rose-400 rounded transition-colors"
              title="Delete Clip (Delete)"
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* CapCut Sub-Tabs: Basic, Speed, Audio, Animation, Color */}
        <div className="h-9 bg-[#161616] border-b border-[#2e2e2e] flex items-center px-2 gap-1 overflow-x-auto scrollbar-none shrink-0">
          {(
            [
              { id: 'basic', label: 'Basic' },
              { id: 'speed', label: 'Speed' },
              { id: 'audio', label: 'Audio' },
              { id: 'animation', label: 'Animation' },
              { id: 'color', label: 'Color' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#282828] text-white border-b-2 border-[#1685ff]'
                  : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Panel Content Body */}
        <div className="p-4 space-y-5 flex-1 overflow-y-auto">
          {/* TAB 1: BASIC (Position, Scale, Rotation, Opacity, Blend, Flip) */}
          {activeTab === 'basic' && (
            <div className="space-y-4">
              {/* Scale / Zoom */}
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Scale Size</span>
                  <span className="font-mono text-white font-bold">{Math.round((selectedClip.scale || 1) * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.2"
                  max="2.5"
                  step="0.05"
                  value={selectedClip.scale || 1}
                  onChange={(e) => updateClip(selectedClip.id, { scale: parseFloat(e.target.value) })}
                  className="w-full accent-[#1685ff]"
                />
              </div>

              {/* Position X / Y */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Position X</span>
                    <span className="font-mono text-neutral-300">{selectedClip.posX || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="-400"
                    max="400"
                    value={selectedClip.posX || 0}
                    onChange={(e) => updateClip(selectedClip.id, { posX: parseInt(e.target.value) })}
                    className="w-full accent-[#1685ff]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Position Y</span>
                    <span className="font-mono text-neutral-300">{selectedClip.posY || 0}px</span>
                  </div>
                  <input
                    type="range"
                    min="-400"
                    max="400"
                    value={selectedClip.posY || 0}
                    onChange={(e) => updateClip(selectedClip.id, { posY: parseInt(e.target.value) })}
                    className="w-full accent-[#1685ff]"
                  />
                </div>
              </div>

              {/* Rotation & Opacity */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Rotate</span>
                    <span className="font-mono text-neutral-300">{selectedClip.rotation || 0}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    value={selectedClip.rotation || 0}
                    onChange={(e) => updateClip(selectedClip.id, { rotation: parseInt(e.target.value) })}
                    className="w-full accent-[#1685ff]"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Opacity</span>
                    <span className="font-mono text-neutral-300">{Math.round((selectedClip.opacity ?? 1) * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={selectedClip.opacity ?? 1}
                    onChange={(e) => updateClip(selectedClip.id, { opacity: parseFloat(e.target.value) })}
                    className="w-full accent-[#1685ff]"
                  />
                </div>
              </div>

              {/* Flip Horizontal / Vertical */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#2e2e2e]">
                <button
                  onClick={() => updateClip(selectedClip.id, { flipH: !selectedClip.flipH })}
                  className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1.5 text-xs transition-colors ${
                    selectedClip.flipH
                      ? 'bg-[#1685ff]/20 border-[#1685ff] text-white'
                      : 'bg-[#141414] border-[#333] text-neutral-400 hover:text-white'
                  }`}
                >
                  <FlipHorizontal size={14} /> Flip H
                </button>
                <button
                  onClick={() => updateClip(selectedClip.id, { flipV: !selectedClip.flipV })}
                  className={`flex-1 py-1.5 rounded-lg border flex items-center justify-center gap-1.5 text-xs transition-colors ${
                    selectedClip.flipV
                      ? 'bg-[#1685ff]/20 border-[#1685ff] text-white'
                      : 'bg-[#141414] border-[#333] text-neutral-400 hover:text-white'
                  }`}
                >
                  <FlipVertical size={14} /> Flip V
                </button>
              </div>

              {/* Blend Mode */}
              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Blend Mode</label>
                <select
                  value={selectedClip.blendMode || 'source-over'}
                  onChange={(e) => updateClip(selectedClip.id, { blendMode: e.target.value as BlendMode })}
                  className="w-full bg-[#141414] border border-[#383838] rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                >
                  {BLEND_MODES.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Keyframes Action */}
              <div className="pt-3 border-t border-[#2e2e2e]">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <Key size={13} className="text-[#1685ff]" />
                    <span>Keyframes Animation</span>
                  </div>
                  <button
                    onClick={() => addKeyframe(selectedClip.id)}
                    className="px-2.5 py-1 bg-[#1685ff] hover:bg-[#0070eb] text-white rounded text-[11px] font-semibold flex items-center gap-1 shadow"
                  >
                    <Plus size={11} /> Add at Playhead
                  </button>
                </div>

                {selectedClip.keyframes && selectedClip.keyframes.length > 0 ? (
                  <div className="space-y-1.5">
                    {selectedClip.keyframes.map((kf, i) => (
                      <div
                        key={kf.id}
                        className="flex items-center justify-between bg-[#141414] border border-[#2e2e2e] p-2 rounded-lg text-[11px]"
                      >
                        <span className="font-mono text-neutral-300">
                          #{i + 1} · {kf.time.toFixed(1)}s (Scale: {Math.round(kf.scale * 100)}%)
                        </span>
                        <button
                          onClick={() => removeKeyframe(selectedClip.id, kf.id)}
                          className="text-neutral-500 hover:text-rose-400"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-[11px] text-neutral-500 italic">No keyframes on this clip yet.</div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SPEED (Speed slider, reverse, freeze frame) */}
          {activeTab === 'speed' && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1.5">
                  <span>Playback Speed</span>
                  <span className="font-mono text-[#1685ff] font-bold text-sm">{selectedClip.speed}x</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {[0.5, 1, 1.5, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateClip(selectedClip.id, { speed: s })}
                      className={`py-1 rounded-lg text-xs font-mono font-bold border transition-colors ${
                        selectedClip.speed === s
                          ? 'bg-[#1685ff] border-[#1685ff] text-white'
                          : 'bg-[#141414] border-[#333] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  min="0.25"
                  max="4"
                  step="0.25"
                  value={selectedClip.speed}
                  onChange={(e) => updateClip(selectedClip.id, { speed: parseFloat(e.target.value) })}
                  className="w-full accent-[#1685ff]"
                />
              </div>

              {/* Reverse & Freeze Frame */}
              <div className="space-y-2 pt-3 border-t border-[#2e2e2e]">
                <button
                  onClick={() => reverseClip(selectedClip.id)}
                  className={`w-full py-2 rounded-xl border flex items-center justify-center gap-2 text-xs font-semibold transition-colors ${
                    selectedClip.reverse
                      ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                      : 'bg-[#141414] border-[#333] text-neutral-300 hover:text-white'
                  }`}
                >
                  <RotateCw size={14} />
                  <span>{selectedClip.reverse ? 'Reversed (On)' : 'Reverse Clip'}</span>
                </button>

                <button
                  onClick={freezeFrameAtPlayhead}
                  className="w-full py-2 rounded-xl bg-[#141414] hover:bg-[#252525] border border-[#333] text-white font-semibold flex items-center justify-center gap-2 text-xs transition-colors"
                >
                  <Sparkles size={14} className="text-[#1685ff]" />
                  <span>Freeze Frame at Playhead (3s)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIO (Volume, fade, noise reduction, extract) */}
          {activeTab === 'audio' && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                  <span>Clip Volume</span>
                  <span className="font-mono text-emerald-400 font-bold">{Math.round(selectedClip.volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={selectedClip.volume}
                  onChange={(e) => updateClip(selectedClip.id, { volume: parseFloat(e.target.value) })}
                  className="w-full accent-emerald-500"
                />
              </div>

              {/* Extract Audio Button */}
              <div className="pt-2 border-t border-[#2e2e2e]">
                <button
                  onClick={() => extractAudioFromClip(selectedClip.id)}
                  className="w-full py-2 bg-[#141414] hover:bg-[#252525] border border-[#333] text-emerald-400 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Volume2 size={14} />
                  <span>Extract Audio to Track</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ANIMATION (In, Out, Combo animations) */}
          {activeTab === 'animation' && (
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-neutral-400 font-semibold block mb-1.5">Clip Animation</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {ANIMATIONS_LIST.map((anim) => (
                    <button
                      key={anim.id}
                      onClick={() => updateClip(selectedClip.id, { animation: anim.id })}
                      className={`py-1.5 px-2 rounded-lg text-[11px] border text-left transition-colors truncate ${
                        selectedClip.animation === anim.id
                          ? 'bg-[#1685ff] border-[#1685ff] text-white font-bold'
                          : 'bg-[#141414] border-[#333] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {anim.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] text-neutral-400 font-semibold block mb-1.5">Transition Out</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {TRANSITIONS_LIST.map((tr) => (
                    <button
                      key={tr.id}
                      onClick={() => updateClip(selectedClip.id, { transition: tr.id })}
                      className={`py-1.5 px-2 rounded-lg text-[11px] border text-left transition-colors truncate ${
                        selectedClip.transition === tr.id
                          ? 'bg-purple-600 border-purple-500 text-white font-bold'
                          : 'bg-[#141414] border-[#333] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {tr.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: COLOR & FILTERS */}
          {activeTab === 'color' && (
            <div className="space-y-4">
              {/* Preset Filters */}
              <div>
                <label className="text-[11px] text-neutral-400 font-semibold block mb-1.5">Preset Filters</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {VIDEO_FILTERS_LIST.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateClip(selectedClip.id, { filter: f.id })}
                      className={`py-1.5 px-2 rounded-lg text-[11px] border text-left transition-colors truncate ${
                        selectedClip.filter === f.id
                          ? 'bg-[#1685ff] border-[#1685ff] text-white font-bold'
                          : 'bg-[#141414] border-[#333] text-neutral-400 hover:text-white'
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Grading Sliders */}
              <div className="space-y-3 pt-2 border-t border-[#2e2e2e]">
                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Brightness</span>
                    <span className="font-mono text-neutral-300">{selectedClip.colorGrade.brightness}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={selectedClip.colorGrade.brightness}
                    onChange={(e) =>
                      updateClip(selectedClip.id, {
                        colorGrade: { ...selectedClip.colorGrade, brightness: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-[#1685ff]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Contrast</span>
                    <span className="font-mono text-neutral-300">{selectedClip.colorGrade.contrast}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={selectedClip.colorGrade.contrast}
                    onChange={(e) =>
                      updateClip(selectedClip.id, {
                        colorGrade: { ...selectedClip.colorGrade, contrast: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-[#1685ff]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-neutral-400 mb-1">
                    <span>Saturation</span>
                    <span className="font-mono text-neutral-300">{selectedClip.colorGrade.saturation}</span>
                  </div>
                  <input
                    type="range"
                    min="-50"
                    max="50"
                    value={selectedClip.colorGrade.saturation}
                    onChange={(e) =>
                      updateClip(selectedClip.id, {
                        colorGrade: { ...selectedClip.colorGrade, saturation: parseInt(e.target.value) },
                      })
                    }
                    className="w-full accent-[#1685ff]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // -------------------------------------------------------------
  // 5. CANVAS & PROJECT SETTINGS (Default when nothing selected)
  // -------------------------------------------------------------
  return (
    <aside className="w-80 bg-[#1e1e1e] border-l border-[#2e2e2e] flex flex-col text-[#e0e0e0] select-none text-xs z-20 overflow-y-auto">
      <div className="h-11 px-4 bg-[#181818] border-b border-[#2e2e2e] flex items-center justify-between font-bold text-white shrink-0">
        <div className="flex items-center gap-2">
          <Palette size={15} className="text-[#1685ff]" />
          <span>Canvas & Project Settings</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Requirement 4: Background Color Selector */}
        <div>
          <label className="text-[11px] font-semibold text-neutral-300 block mb-2">
            Canvas Background Color
          </label>
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[
              { color: '#000000', label: 'Pure Black' },
              { color: '#ffffff', label: 'White' },
              { color: '#1685ff', label: 'Blue' },
              { color: '#181818', label: 'Dark' },
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => setBackgroundColor(c.color)}
                className={`h-9 rounded-lg border flex items-center justify-center transition-all ${
                  project.backgroundColor === c.color ? 'ring-2 ring-[#1685ff] border-white' : 'border-[#383838]'
                }`}
                style={{ backgroundColor: c.color }}
                title={c.label}
              >
                {project.backgroundColor === c.color && (
                  <Check size={14} className={c.color === '#ffffff' ? 'text-black' : 'text-white'} />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 bg-[#141414] border border-[#383838] p-2 rounded-xl">
            <input
              type="color"
              value={project.backgroundColor || '#000000'}
              onChange={(e) => setBackgroundColor(e.target.value)}
              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
            />
            <span className="font-mono text-neutral-300 text-xs">
              Custom: {project.backgroundColor || '#000000'}
            </span>
          </div>
        </div>

        {/* Aspect Ratio Display & Settings */}
        <div className="space-y-3 pt-3 border-t border-[#2e2e2e]">
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-400">Aspect Ratio:</span>
            <span className="font-bold text-white uppercase">{project.aspectRatio}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-400">Resolution:</span>
            <span className="font-mono text-white">
              {project.width} × {project.height} ({project.resolution || '1080p'})
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-400">Frame Rate:</span>
            <span className="font-mono text-white">{project.fps || 30} FPS</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-neutral-400">Timeline Duration:</span>
            <span className="font-mono text-white">{project.duration}s</span>
          </div>
        </div>

        {/* Quick Helper Instructions */}
        <div className="p-3 bg-[#161616] border border-[#2b2b2b] rounded-xl text-[11px] text-neutral-400 space-y-2">
          <div className="font-bold text-neutral-300 text-xs">Keyboard Shortcuts</div>
          <div className="flex justify-between">
            <span>Play / Pause</span>
            <span className="font-mono text-neutral-200">Space</span>
          </div>
          <div className="flex justify-between">
            <span>Split Clip</span>
            <span className="font-mono text-neutral-200">C</span>
          </div>
          <div className="flex justify-between">
            <span>Delete Clip</span>
            <span className="font-mono text-neutral-200">Del</span>
          </div>
          <div className="flex justify-between">
            <span>Frame Step</span>
            <span className="font-mono text-neutral-200">← / →</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
