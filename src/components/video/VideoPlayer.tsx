import React, { useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  ChevronLeft,
  ChevronRight,
  Maximize2,
} from 'lucide-react';
import { useVideo } from '../../context/VideoContext';
import { renderVideoFrame } from '../../utils/videoProcessing';

export const VideoPlayer: React.FC = () => {
  const {
    project,
    currentTime,
    seek,
    isPlaying,
    togglePlay,
    stepFrame,
  } = useVideo();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoElementsMapRef = useRef<Map<string, HTMLVideoElement>>(new Map());
  const imageElementsMapRef = useRef<Map<string, HTMLImageElement>>(new Map());

  // Initialize and synchronize HTMLVideoElements for video clips
  useEffect(() => {
    const vMap = videoElementsMapRef.current;
    const iMap = imageElementsMapRef.current;

    project.videoClips.forEach((clip) => {
      if (clip.type === 'video' && !vMap.has(clip.id)) {
        const v = document.createElement('video');
        v.crossOrigin = 'anonymous';
        v.src = clip.src;
        v.preload = 'auto';
        v.muted = true;
        v.playsInline = true;
        v.load();
        vMap.set(clip.id, v);
      } else if (clip.type === 'image' && !iMap.has(clip.id)) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = clip.src;
        iMap.set(clip.id, img);
      }
    });
  }, [project.videoClips]);

  // Sync video elements playback state
  useEffect(() => {
    const vMap = videoElementsMapRef.current;

    project.videoClips.forEach((clip) => {
      if (clip.type !== 'video') return;
      const v = vMap.get(clip.id);
      if (!v) return;

      const isClipActive =
        currentTime >= clip.startOnTimeline &&
        currentTime <= clip.startOnTimeline + clip.duration;

      if (isClipActive) {
        const offset = (currentTime - clip.startOnTimeline) * (clip.speed || 1) + (clip.trimStart || 0);
        if (Math.abs(v.currentTime - offset) > 0.25) {
          v.currentTime = offset;
        }
        if (isPlaying && v.paused) {
          v.play().catch(() => {});
        } else if (!isPlaying && !v.paused) {
          v.pause();
        }
      } else {
        if (!v.paused) v.pause();
      }
    });
  }, [currentTime, isPlaying, project.videoClips]);

  // Render current canvas frame
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (canvas.width !== project.width || canvas.height !== project.height) {
      canvas.width = project.width;
      canvas.height = project.height;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    renderVideoFrame(
      ctx,
      project,
      currentTime,
      videoElementsMapRef.current,
      imageElementsMapRef.current
    );
  }, [currentTime, project]);

  // Keyboard shortcut listeners (Space for play/pause, Arrows for frame step)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        stepFrame(-1);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        stepFrame(1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [togglePlay, stepFrame]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const f = Math.floor((secs % 1) * (project.fps || 30));
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${f.toString().padStart(2, '0')}`;
  };

  const getAspectCss = () => {
    switch (project.aspectRatio) {
      case '9:16':
        return '9 / 16';
      case '1:1':
        return '1 / 1';
      case '4:5':
        return '4 / 5';
      case '4:3':
        return '4 / 3';
      default:
        return '16 / 9';
    }
  };

  return (
    <div className="flex-1 bg-[#141414] flex flex-col items-center justify-between p-4 relative select-none overflow-hidden">
      {/* Canvas Viewport Frame */}
      <div className="flex-1 w-full flex items-center justify-center p-2 relative">
        <div
          style={{
            aspectRatio: getAspectCss(),
            maxHeight: '100%',
            maxWidth: '100%',
          }}
          className="relative bg-black rounded-xl overflow-hidden shadow-2xl border border-[#2d2d2d] flex items-center justify-center"
        >
          {/* Main Rendering Canvas */}
          <canvas ref={canvasRef} className="w-full h-full object-contain" />

          {/* Large Center Play Overlay Button when paused */}
          {!isPlaying && (
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-black/60 hover:bg-[#1685ff]/90 text-white flex items-center justify-center transition-all shadow-xl backdrop-blur-sm group cursor-pointer"
            >
              <Play size={24} className="ml-1 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Media Player Controls Bar */}
      <div className="w-full max-w-xl bg-[#202020] border border-[#353535] rounded-xl px-4 py-2 flex items-center justify-between text-xs text-[#e0e0e0] shadow-lg mt-2">
        {/* Left: Step Frame Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => seek(0)}
            className="p-1.5 hover:bg-[#333] hover:text-white rounded text-neutral-400 transition-colors"
            title="Return to Start"
          >
            <SkipBack size={15} />
          </button>
          <button
            onClick={() => stepFrame(-1)}
            className="p-1.5 hover:bg-[#333] hover:text-white rounded text-neutral-400 transition-colors"
            title="Previous Frame (Left Arrow)"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 rounded-full bg-[#1685ff] hover:bg-[#0070eb] text-white flex items-center justify-center transition-colors shadow-sm mx-1 cursor-pointer"
            title="Play / Pause (Space)"
          >
            {isPlaying ? <Pause size={15} /> : <Play size={15} className="ml-0.5" />}
          </button>
          <button
            onClick={() => stepFrame(1)}
            className="p-1.5 hover:bg-[#333] hover:text-white rounded text-neutral-400 transition-colors"
            title="Next Frame (Right Arrow)"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => seek(project.duration)}
            className="p-1.5 hover:bg-[#333] hover:text-white rounded text-neutral-400 transition-colors"
            title="Jump to End"
          >
            <SkipForward size={15} />
          </button>
        </div>

        {/* Center: Timecode Counter */}
        <div className="font-mono text-xs font-semibold text-white tracking-wider bg-[#181818] border border-[#383838] px-3 py-1 rounded-md">
          <span className="text-[#1685ff]">{formatTime(currentTime)}</span>
          <span className="text-neutral-500 mx-1.5">/</span>
          <span className="text-neutral-400">{formatTime(project.duration)}</span>
        </div>

        {/* Right: Info / FPS */}
        <div className="flex items-center gap-2 text-neutral-400 font-mono text-[11px]">
          <span>{project.fps} FPS</span>
          <span className="text-neutral-600">·</span>
          <span>{project.aspectRatio}</span>
        </div>
      </div>
    </div>
  );
};
