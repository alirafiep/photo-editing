import React, { useRef, useState } from 'react';
import {
  Scissors,
  Copy,
  Trash2,
  ZoomIn,
  ZoomOut,
  Plus,
  Music,
  Film,
  Type,
  Smile,
  Volume2,
  Magnet,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Sparkles,
} from 'lucide-react';
import { useVideo } from '../../context/VideoContext';
import { VideoClip, AudioClip, SubtitleItem, StickerItem, TextOverlayItem } from '../../types/editor';

export const VideoTimeline: React.FC = () => {
  const {
    project,
    currentTime,
    seek,
    stepFrame,
    selectedClipId,
    setSelectedClipId,
    selectedAudioId,
    setSelectedAudioId,
    selectedTextId,
    setSelectedTextId,
    selectedStickerId,
    setSelectedStickerId,
    splitClipAtPlayhead,
    deleteSelectedClip,
    duplicateSelectedClip,
    freezeFrameAtPlayhead,
    reverseClip,
    updateClip,
    updateAudioClip,
    updateTextOverlay,
    updateSticker,
    timelineZoom,
    setTimelineZoom,
    snapEnabled,
    toggleSnap,
  } = useVideo();

  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [isScrubbing, setIsScrubbing] = useState(false);

  const trackHeaderWidth = 100; // px
  const timelineWidth = Math.max(1400, project.duration * timelineZoom);

  // Scrubber click / drag handler
  const handleTimelineMouseDown = (e: React.MouseEvent) => {
    if (!timelineContainerRef.current) return;
    setIsScrubbing(true);
    updateTimeFromPointer(e.clientX);

    const onPointerMove = (ev: MouseEvent) => {
      updateTimeFromPointer(ev.clientX);
    };

    const onPointerUp = () => {
      setIsScrubbing(false);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
    };

    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
  };

  const updateTimeFromPointer = (clientX: number) => {
    if (!timelineContainerRef.current) return;
    const rect = timelineContainerRef.current.getBoundingClientRect();
    const scrollLeft = timelineContainerRef.current.scrollLeft;
    const clickX = clientX - rect.left + scrollLeft - trackHeaderWidth;
    let targetTime = Math.max(0, Math.min(project.duration, clickX / timelineZoom));

    // Magnetic Snapping to clip edges if enabled
    if (snapEnabled) {
      const snapThresholdSec = 0.25;
      for (const clip of project.videoClips) {
        if (Math.abs(targetTime - clip.startOnTimeline) < snapThresholdSec) {
          targetTime = clip.startOnTimeline;
          break;
        }
        if (Math.abs(targetTime - (clip.startOnTimeline + clip.duration)) < snapThresholdSec) {
          targetTime = clip.startOnTimeline + clip.duration;
          break;
        }
      }
    }

    seek(targetTime);
  };

  // Format Timecode: MM:SS:FF
  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const f = Math.floor((sec % 1) * (project.fps || 30));
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(m)}:${pad(s)}:${pad(f)}`;
  };

  // Generate seconds ruler marks
  const totalSeconds = Math.ceil(project.duration);
  const rulerTicks = [];
  for (let s = 0; s <= totalSeconds; s++) {
    rulerTicks.push(s);
  }

  const playheadPositionPx = currentTime * timelineZoom;

  // Separate clips by track
  const overlayClips = project.videoClips.filter((c) => c.trackIndex === 1);
  const mainClips = project.videoClips.filter((c) => c.trackIndex === 0 || c.trackIndex === undefined);
  const musicAudioClips = project.audioClips.filter((a) => a.trackIndex === 0 || a.trackIndex === undefined);
  const voiceAudioClips = project.audioClips.filter((a) => a.trackIndex === 1);

  return (
    <div className="h-72 bg-[#181818] border-t border-[#2e2e2e] flex flex-col select-none text-xs text-[#e0e0e0] z-20 shrink-0">
      {/* 1. CapCut Timeline Header & Action Toolbar */}
      <div className="h-10 bg-[#1e1e1e] border-b border-[#2e2e2e] px-4 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {/* Split (C) */}
          <button
            onClick={splitClipAtPlayhead}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#282828] hover:bg-[#333] hover:text-white rounded-lg text-neutral-300 font-semibold text-xs transition-colors"
            title="Split Clip at Playhead (C)"
          >
            <Scissors size={14} className="text-[#1685ff]" />
            <span>Split (C)</span>
          </button>

          {/* Freeze Frame */}
          <button
            onClick={freezeFrameAtPlayhead}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#282828] hover:bg-[#333] hover:text-white rounded-lg text-neutral-300 font-semibold text-xs transition-colors"
            title="Freeze Frame at Playhead"
          >
            <Sparkles size={14} className="text-amber-400" />
            <span>Freeze</span>
          </button>

          {/* Reverse */}
          <button
            onClick={() => selectedClipId && reverseClip(selectedClipId)}
            disabled={!selectedClipId}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#282828] hover:bg-[#333] hover:text-white rounded-lg text-neutral-300 disabled:opacity-30 transition-colors"
            title="Reverse Selected Clip"
          >
            <RotateCw size={13} />
            <span>Reverse</span>
          </button>

          {/* Duplicate */}
          <button
            onClick={duplicateSelectedClip}
            disabled={!selectedClipId}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#282828] hover:bg-[#333] hover:text-white rounded-lg text-neutral-300 disabled:opacity-30 transition-colors"
            title="Duplicate Clip"
          >
            <Copy size={13} />
            <span>Duplicate</span>
          </button>

          {/* Delete */}
          <button
            onClick={deleteSelectedClip}
            disabled={!selectedClipId}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[#282828] hover:bg-[#333] hover:text-rose-400 rounded-lg text-neutral-300 disabled:opacity-30 transition-colors"
            title="Delete Selected Clip (Del)"
          >
            <Trash2 size={13} />
            <span>Delete</span>
          </button>

          <div className="w-[1px] h-4 bg-[#333] mx-1" />

          {/* Magnetic Snap toggle */}
          <button
            onClick={toggleSnap}
            className={`p-1.5 rounded-lg border transition-colors ${
              snapEnabled
                ? 'bg-[#1685ff]/20 border-[#1685ff] text-[#1685ff]'
                : 'bg-[#252525] border-transparent text-neutral-500 hover:text-neutral-300'
            }`}
            title={`Magnetic Snapping: ${snapEnabled ? 'Enabled' : 'Disabled'}`}
          >
            <Magnet size={14} />
          </button>

          {/* Frame Step Navigation */}
          <div className="flex items-center bg-[#252525] border border-[#333] rounded-lg p-0.5 ml-1">
            <button
              onClick={() => stepFrame(-1)}
              className="p-1 hover:text-white text-neutral-400 hover:bg-[#333] rounded"
              title="Step Back 1 Frame (←)"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              onClick={() => stepFrame(1)}
              className="p-1 hover:text-white text-neutral-400 hover:bg-[#333] rounded"
              title="Step Forward 1 Frame (→)"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Timecode & Timeline Zoom */}
        <div className="flex items-center gap-4">
          <div className="font-mono text-xs font-bold text-neutral-300 bg-[#141414] px-2.5 py-1 rounded-md border border-[#2e2e2e]">
            <span className="text-[#1685ff]">{formatTimecode(currentTime)}</span>
            <span className="text-neutral-500 mx-1.5">/</span>
            <span>{formatTimecode(project.duration)}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTimelineZoom((z) => Math.max(15, z - 8))}
              className="p-1 hover:text-white text-neutral-400"
              title="Zoom Out Timeline"
            >
              <ZoomOut size={13} />
            </button>
            <input
              type="range"
              min="15"
              max="100"
              value={timelineZoom}
              onChange={(e) => setTimelineZoom(parseInt(e.target.value))}
              className="w-20 accent-[#1685ff] h-1"
            />
            <button
              onClick={() => setTimelineZoom((z) => Math.min(100, z + 8))}
              className="p-1 hover:text-white text-neutral-400"
              title="Zoom In Timeline"
            >
              <ZoomIn size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Scrollable Multi-Track Timeline Canvas */}
      <div
        ref={timelineContainerRef}
        className="flex-1 overflow-x-auto overflow-y-auto relative scrollbar-thin bg-[#141414]"
      >
        <div style={{ width: `${timelineWidth + trackHeaderWidth + 100}px` }} className="min-h-full flex flex-col relative">
          {/* Seconds Ruler Header */}
          <div
            className="h-6 bg-[#1a1a1a] border-b border-[#2b2b2b] sticky top-0 z-30 cursor-pointer flex"
            onMouseDown={handleTimelineMouseDown}
          >
            <div style={{ width: `${trackHeaderWidth}px` }} className="shrink-0 bg-[#1a1a1a] border-r border-[#2b2b2b] px-2 text-[10px] text-neutral-500 font-mono flex items-center">
              TIMELINE
            </div>
            <div className="relative flex-1 h-full">
              {rulerTicks.map((sec) => (
                <div
                  key={sec}
                  style={{ left: `${sec * timelineZoom}px` }}
                  className="absolute top-0 bottom-0 flex flex-col justify-end"
                >
                  <div className="w-[1px] h-2 bg-neutral-600" />
                  <span className="text-[9px] font-mono text-neutral-400 pl-1 select-none leading-none pb-0.5">
                    {sec}s
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Playhead Needle */}
          <div
            style={{ left: `${trackHeaderWidth + playheadPositionPx}px` }}
            className="absolute top-0 bottom-0 z-40 pointer-events-none flex flex-col items-center"
          >
            <div className="w-3.5 h-3.5 bg-[#1685ff] rotate-45 -mt-1.5 shadow-md" />
            <div className="w-[2px] bg-[#1685ff] flex-1 shadow-[0_0_8px_rgba(22,133,255,0.8)]" />
          </div>

          {/* TRACK 1: Text & Captions Track */}
          <div className="h-10 border-b border-[#242424] flex items-center hover:bg-[#1a1a1a] transition-colors relative">
            <div style={{ width: `${trackHeaderWidth}px` }} className="shrink-0 h-full bg-[#161616] border-r border-[#242424] px-2.5 flex items-center gap-1.5 text-neutral-400">
              <Type size={12} className="text-[#1685ff]" />
              <span className="font-semibold text-[10px]">Text Track</span>
            </div>
            <div className="relative flex-1 h-full" onMouseDown={handleTimelineMouseDown}>
              {/* Subtitles */}
              {project.subtitles?.map((sub) => {
                const left = sub.startTime * timelineZoom;
                const width = (sub.endTime - sub.startTime) * timelineZoom;
                return (
                  <div
                    key={sub.id}
                    style={{ left: `${left}px`, width: `${Math.max(10, width)}px` }}
                    className="absolute top-1 bottom-1 bg-purple-900/60 border border-purple-500/80 rounded-md px-2 flex items-center text-[10px] text-white font-medium truncate shadow"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    <span className="truncate">{sub.text}</span>
                  </div>
                );
              })}

              {/* Title Text Overlays */}
              {project.textOverlays?.map((txt) => {
                const left = txt.startOnTimeline * timelineZoom;
                const width = txt.duration * timelineZoom;
                const isSelected = selectedTextId === txt.id;
                return (
                  <div
                    key={txt.id}
                    style={{ left: `${left}px`, width: `${Math.max(10, width)}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedTextId(txt.id);
                    }}
                    className={`absolute top-1 bottom-1 rounded-md px-2 flex items-center text-[10px] text-white font-bold truncate cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#1685ff] border-2 border-white shadow-lg'
                        : 'bg-[#1685ff]/60 border border-[#1685ff] hover:bg-[#1685ff]/80'
                    }`}
                  >
                    <span className="truncate">{txt.text}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 2: Stickers Track */}
          <div className="h-10 border-b border-[#242424] flex items-center hover:bg-[#1a1a1a] transition-colors relative">
            <div style={{ width: `${trackHeaderWidth}px` }} className="shrink-0 h-full bg-[#161616] border-r border-[#242424] px-2.5 flex items-center gap-1.5 text-neutral-400">
              <Smile size={12} className="text-amber-400" />
              <span className="font-semibold text-[10px]">Stickers</span>
            </div>
            <div className="relative flex-1 h-full" onMouseDown={handleTimelineMouseDown}>
              {project.stickers?.map((stk) => {
                const left = stk.startOnTimeline * timelineZoom;
                const width = stk.duration * timelineZoom;
                const isSelected = selectedStickerId === stk.id;
                return (
                  <div
                    key={stk.id}
                    style={{ left: `${left}px`, width: `${Math.max(10, width)}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStickerId(stk.id);
                    }}
                    className={`absolute top-1 bottom-1 rounded-md px-2 flex items-center gap-1.5 text-[11px] cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-amber-500 border-2 border-white text-black font-bold shadow'
                        : 'bg-amber-950/70 border border-amber-600/60 text-amber-200'
                    }`}
                  >
                    <span>{stk.content}</span>
                    <span className="text-[9px] truncate">{stk.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 3: Video Track 2 (Overlay / PIP) */}
          <div className="h-12 border-b border-[#242424] flex items-center hover:bg-[#1a1a1a] transition-colors relative">
            <div style={{ width: `${trackHeaderWidth}px` }} className="shrink-0 h-full bg-[#161616] border-r border-[#242424] px-2.5 flex items-center gap-1.5 text-neutral-400">
              <Film size={12} className="text-sky-400" />
              <span className="font-semibold text-[10px]">Video 2 (PIP)</span>
            </div>
            <div className="relative flex-1 h-full" onMouseDown={handleTimelineMouseDown}>
              {overlayClips.map((clip) => {
                const left = clip.startOnTimeline * timelineZoom;
                const width = clip.duration * timelineZoom;
                const isSelected = selectedClipId === clip.id;
                return (
                  <div
                    key={clip.id}
                    style={{ left: `${left}px`, width: `${Math.max(15, width)}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClipId(clip.id);
                    }}
                    className={`absolute top-1 bottom-1 rounded-lg px-2.5 flex items-center justify-between text-white font-semibold text-xs cursor-pointer shadow transition-all ${
                      isSelected
                        ? 'bg-[#1685ff] border-2 border-white ring-2 ring-[#1685ff]/50'
                        : 'bg-sky-950/80 border border-sky-700/60 hover:bg-sky-900/80'
                    }`}
                  >
                    <span className="truncate">{clip.name}</span>
                    <span className="text-[10px] opacity-70 font-mono">{clip.duration.toFixed(1)}s</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 4: Video Track 1 (Main Track) */}
          <div className="h-14 border-b border-[#242424] flex items-center hover:bg-[#1a1a1a] transition-colors relative">
            <div style={{ width: `${trackHeaderWidth}px` }} className="shrink-0 h-full bg-[#161616] border-r border-[#242424] px-2.5 flex items-center gap-1.5 text-neutral-400">
              <Film size={13} className="text-[#1685ff]" />
              <span className="font-bold text-[10px]">Main Video</span>
            </div>
            <div className="relative flex-1 h-full" onMouseDown={handleTimelineMouseDown}>
              {mainClips.map((clip) => {
                const left = clip.startOnTimeline * timelineZoom;
                const width = clip.duration * timelineZoom;
                const isSelected = selectedClipId === clip.id;
                return (
                  <div
                    key={clip.id}
                    style={{ left: `${left}px`, width: `${Math.max(15, width)}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedClipId(clip.id);
                    }}
                    className={`absolute top-1 bottom-1 rounded-lg px-3 flex items-center justify-between text-white font-bold text-xs cursor-pointer shadow-md transition-all group ${
                      isSelected
                        ? 'bg-[#1685ff] border-2 border-white ring-2 ring-[#1685ff]/60'
                        : 'bg-[#222222] border border-[#3a3a3a] hover:bg-[#282828] hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      {clip.isFrozen && (
                        <span className="px-1.5 py-0.5 bg-amber-500 text-black text-[9px] rounded font-black uppercase">
                          Freeze
                        </span>
                      )}
                      <span className="truncate">{clip.name}</span>
                    </div>
                    <span className="text-[10px] opacity-80 font-mono shrink-0 pl-1">
                      {clip.duration.toFixed(1)}s
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 5: Audio Track 1 (Music) */}
          <div className="h-10 border-b border-[#242424] flex items-center hover:bg-[#1a1a1a] transition-colors relative">
            <div style={{ width: `${trackHeaderWidth}px` }} className="shrink-0 h-full bg-[#161616] border-r border-[#242424] px-2.5 flex items-center gap-1.5 text-neutral-400">
              <Music size={12} className="text-emerald-400" />
              <span className="font-semibold text-[10px]">Audio 1</span>
            </div>
            <div className="relative flex-1 h-full" onMouseDown={handleTimelineMouseDown}>
              {musicAudioClips.map((audio) => {
                const left = audio.startOnTimeline * timelineZoom;
                const width = audio.duration * timelineZoom;
                const isSelected = selectedAudioId === audio.id;
                return (
                  <div
                    key={audio.id}
                    style={{ left: `${left}px`, width: `${Math.max(15, width)}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAudioId(audio.id);
                    }}
                    className={`absolute top-1 bottom-1 rounded-lg px-2.5 flex items-center justify-between text-[11px] font-semibold cursor-pointer shadow transition-all ${
                      isSelected
                        ? 'bg-emerald-600 border-2 border-white text-white font-bold shadow'
                        : 'bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 hover:bg-emerald-900/80'
                    }`}
                  >
                    <span className="truncate">{audio.name}</span>
                    <span className="text-[9px] opacity-75 font-mono">{audio.duration.toFixed(1)}s</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 6: Audio Track 2 (Voiceover / SFX) */}
          <div className="h-10 border-b border-[#242424] flex items-center hover:bg-[#1a1a1a] transition-colors relative">
            <div style={{ width: `${trackHeaderWidth}px` }} className="shrink-0 h-full bg-[#161616] border-r border-[#242424] px-2.5 flex items-center gap-1.5 text-neutral-400">
              <Volume2 size={12} className="text-purple-400" />
              <span className="font-semibold text-[10px]">Voice / SFX</span>
            </div>
            <div className="relative flex-1 h-full" onMouseDown={handleTimelineMouseDown}>
              {voiceAudioClips.map((audio) => {
                const left = audio.startOnTimeline * timelineZoom;
                const width = audio.duration * timelineZoom;
                const isSelected = selectedAudioId === audio.id;
                return (
                  <div
                    key={audio.id}
                    style={{ left: `${left}px`, width: `${Math.max(15, width)}px` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedAudioId(audio.id);
                    }}
                    className={`absolute top-1 bottom-1 rounded-lg px-2.5 flex items-center justify-between text-[11px] font-semibold cursor-pointer shadow transition-all ${
                      isSelected
                        ? 'bg-purple-600 border-2 border-white text-white font-bold shadow'
                        : 'bg-purple-950/80 border border-purple-700/60 text-purple-200 hover:bg-purple-900/80'
                    }`}
                  >
                    <span className="truncate">{audio.name}</span>
                    <span className="text-[9px] opacity-75 font-mono">{audio.duration.toFixed(1)}s</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
