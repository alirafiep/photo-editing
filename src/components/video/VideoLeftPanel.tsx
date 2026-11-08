import React, { useState, useRef } from 'react';
import {
  Film,
  Music,
  Type,
  Sparkles,
  Sliders,
  Upload,
  Plus,
  Play,
  Volume2,
  FileText,
  Download,
  Trash2,
  Check,
  Layers,
  Wand2,
  Smile,
  Mic,
  MicOff,
  Radio,
  Share2,
  Search,
} from 'lucide-react';
import { useVideo } from '../../context/VideoContext';
import {
  SAMPLE_MEDIA_LIBRARY,
  MUSIC_LIBRARY,
  SOUND_EFFECTS_LIBRARY,
  STICKERS_LIBRARY,
  TEXT_TEMPLATES_LIBRARY,
  VIDEO_EFFECTS_LIST,
  VIDEO_FILTERS_LIST,
  TRANSITIONS_LIST,
  SampleMedia,
} from '../../utils/videoProcessing';

export const VideoLeftPanel: React.FC = () => {
  const {
    project,
    importedMedia,
    importMediaFiles,
    addMediaToTimeline,
    addAudioTrackToTimeline,
    selectedClip,
    updateClip,
    subtitles,
    addSubtitle,
    updateSubtitle,
    deleteSubtitle,
    generateAutoCaptions,
    importSrtFile,
    exportSrtFile,
    addTextOverlay,
    addSticker,
    showToast,
  } = useVideo();

  const [activeTab, setActiveTab] = useState<
    'media' | 'audio' | 'text' | 'captions' | 'stickers' | 'effects' | 'transitions' | 'filters'
  >('media');

  // Media tab filter
  const [mediaCategory, setMediaCategory] = useState<'all' | 'video' | 'image' | 'audio'>('all');
  const [audioSubTab, setAudioSubTab] = useState<'music' | 'sfx' | 'record'>('music');
  const [musicCategory, setMusicCategory] = useState<string>('all');
  const [stickerCategory, setStickerCategory] = useState<'all' | 'Emoji' | 'Social' | 'Badges'>('all');
  const [textCategory, setTextCategory] = useState<'all' | 'Trending' | 'Titles' | 'Social' | 'Minimal'>('all');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const stickerInputRef = useRef<HTMLInputElement>(null);
  const srtInputRef = useRef<HTMLInputElement>(null);

  // Voiceover Microphone Recorder state
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordTimerRef = useRef<number | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startVoiceRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const duration = Math.max(1, recordSeconds);

        addAudioTrackToTimeline(
          {
            title: `Voiceover Recording (${duration}s)`,
            src: audioUrl,
            duration,
          },
          1 // Secondary voiceover audio track
        );

        stream.getTracks().forEach((track) => track.stop());
        setIsRecording(false);
        setRecordSeconds(0);
        showToast('Added voiceover to audio track');
      };

      recorder.start();
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((s) => s + 1);
      }, 1000);
    } catch (err) {
      console.warn('Microphone access not available, generating demo voiceover', err);
      // Fallback procedural recording
      setIsRecording(true);
      setRecordSeconds(0);
      recordTimerRef.current = window.setInterval(() => {
        setRecordSeconds((s) => {
          if (s >= 4) {
            stopVoiceRecording();
            return s;
          }
          return s + 1;
        });
      }, 1000);
    }
  };

  const stopVoiceRecording = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    } else {
      // Fallback demo track
      setIsRecording(false);
      addAudioTrackToTimeline(
        {
          title: `Voiceover Demo (${recordSeconds || 3}s)`,
          src: 'https://actions.google.com/sounds/v1/science_fiction/force_field_hum.ogg',
          duration: Math.max(2, recordSeconds),
        },
        1
      );
      setRecordSeconds(0);
      showToast('Added voiceover recording');
    }
  };

  const handleCustomStickerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    addSticker(url, true, file.name.replace(/\.[^/.]+$/, ''));
    showToast(`Added custom sticker: ${file.name}`);
  };

  const filteredMedia = importedMedia.filter((m) => {
    if (mediaCategory === 'all') return true;
    return m.type === mediaCategory;
  });

  const filteredMusic = MUSIC_LIBRARY.filter((m) => {
    if (musicCategory === 'all') return true;
    return m.category === musicCategory;
  });

  const filteredStickers = STICKERS_LIBRARY.filter((s) => {
    if (stickerCategory === 'all') return true;
    return s.category === stickerCategory;
  });

  const filteredTextTemplates = TEXT_TEMPLATES_LIBRARY.filter((t) => {
    if (textCategory === 'all') return true;
    return t.category === textCategory;
  });

  const NAV_TABS = [
    { id: 'media', label: 'Media', icon: Film },
    { id: 'audio', label: 'Audio', icon: Music },
    { id: 'text', label: 'Text', icon: Type },
    { id: 'captions', label: 'Captions', icon: FileText },
    { id: 'stickers', label: 'Stickers', icon: Smile },
    { id: 'effects', label: 'Effects', icon: Sparkles },
    { id: 'transitions', label: 'Transitions', icon: Wand2 },
    { id: 'filters', label: 'Filters', icon: Sliders },
  ] as const;

  return (
    <aside className="w-80 lg:w-96 bg-[#1e1e1e] border-r border-[#2e2e2e] flex flex-col text-[#e0e0e0] select-none text-xs z-20 overflow-hidden">
      {/* 1. CapCut Left Navigation Tabs */}
      <div className="h-12 bg-[#181818] border-b border-[#2e2e2e] flex items-center px-1.5 gap-0.5 overflow-x-auto scrollbar-none shrink-0">
        {NAV_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 font-semibold text-[11px] whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#1685ff] text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white hover:bg-[#282828]'
              }`}
            >
              <Icon size={13} className={isActive ? 'text-white' : 'text-neutral-400'} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Main Tab Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ======================= TAB 1: MEDIA ======================= */}
        {activeTab === 'media' && (
          <div className="space-y-4">
            {/* Local File Browser Import Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && importMediaFiles(e.target.files)}
              multiple
              accept="video/*,image/*,audio/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3.5 bg-gradient-to-r from-[#1685ff]/20 to-indigo-600/20 hover:from-[#1685ff]/30 hover:to-indigo-600/30 border border-[#1685ff]/50 rounded-xl flex items-center justify-center gap-2 text-white font-bold text-xs transition-all shadow-md group cursor-pointer"
            >
              <Upload size={16} className="text-[#1685ff] group-hover:scale-110 transition-transform" />
              <span>Import Videos, Images & Audio</span>
            </button>

            {/* Media Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#141414] border border-[#2e2e2e] p-1 rounded-xl text-[11px]">
              {(['all', 'video', 'image', 'audio'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setMediaCategory(cat)}
                  className={`flex-1 py-1 rounded-lg capitalize font-medium transition-colors ${
                    mediaCategory === cat ? 'bg-[#282828] text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Media Grid Cards */}
            <div className="grid grid-cols-2 gap-2.5">
              {filteredMedia.map((m) => (
                <div
                  key={m.id}
                  className="group relative bg-[#141414] border border-[#2e2e2e] hover:border-[#1685ff] rounded-xl overflow-hidden cursor-pointer transition-all flex flex-col justify-between"
                  onClick={() => addMediaToTimeline(m, 0)}
                >
                  <div className="h-24 bg-[#0a0a0a] relative overflow-hidden flex items-center justify-center">
                    {m.thumbnail ? (
                      <img src={m.thumbnail} alt={m.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-neutral-500 gap-1">
                        {m.type === 'video' ? <Film size={24} /> : m.type === 'audio' ? <Music size={24} /> : <Film size={24} />}
                        <span className="text-[10px] uppercase font-bold">{m.type}</span>
                      </div>
                    )}

                    <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 rounded text-[9px] font-mono text-neutral-200">
                      {m.duration}s
                    </div>

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                      <button className="w-8 h-8 rounded-full bg-[#1685ff] text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="p-2">
                    <div className="text-[11px] font-semibold text-neutral-200 truncate">{m.title}</div>
                    <div className="text-[9px] text-neutral-500 uppercase">{m.category || m.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 2: AUDIO ======================= */}
        {activeTab === 'audio' && (
          <div className="space-y-4">
            {/* Audio Sub-Tabs */}
            <div className="flex items-center gap-1 bg-[#141414] border border-[#2e2e2e] p-1 rounded-xl text-xs">
              <button
                onClick={() => setAudioSubTab('music')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                  audioSubTab === 'music' ? 'bg-[#1685ff] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Music Tracks
              </button>
              <button
                onClick={() => setAudioSubTab('sfx')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors ${
                  audioSubTab === 'sfx' ? 'bg-[#1685ff] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                Sound Effects
              </button>
              <button
                onClick={() => setAudioSubTab('record')}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-colors flex items-center justify-center gap-1 ${
                  audioSubTab === 'record' ? 'bg-[#1685ff] text-white' : 'text-neutral-400 hover:text-white'
                }`}
              >
                <Mic size={12} /> Record
              </button>
            </div>

            {/* MUSIC SECTION */}
            {audioSubTab === 'music' && (
              <div className="space-y-3">
                <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1 text-[10px]">
                  {['all', 'Ambient', 'Cinematic', 'Lo-Fi', 'Upbeat', 'Electronic'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setMusicCategory(cat)}
                      className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                        musicCategory === cat ? 'bg-[#2c2c2c] text-white font-bold' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  {filteredMusic.map((trk) => (
                    <div
                      key={trk.id}
                      className="p-3 bg-[#141414] hover:bg-[#222222] border border-[#2e2e2e] rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
                      onClick={() => addAudioTrackToTimeline(trk, 0)}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-800/50 flex items-center justify-center text-emerald-400 shrink-0">
                          <Music size={14} />
                        </div>
                        <div className="truncate">
                          <div className="font-semibold text-neutral-200 text-xs truncate">{trk.title}</div>
                          <div className="text-[10px] text-neutral-500">
                            {trk.artist} · {trk.duration}s
                          </div>
                        </div>
                      </div>
                      <button className="w-6 h-6 rounded-full bg-[#1685ff] text-white flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Plus size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SOUND EFFECTS SECTION */}
            {audioSubTab === 'sfx' && (
              <div className="space-y-2">
                {SOUND_EFFECTS_LIBRARY.map((sfx) => (
                  <div
                    key={sfx.id}
                    className="p-2.5 bg-[#141414] hover:bg-[#222222] border border-[#2e2e2e] rounded-xl flex items-center justify-between transition-colors group cursor-pointer"
                    onClick={() => addAudioTrackToTimeline(sfx, 1)}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-7 h-7 rounded-lg bg-amber-950/60 border border-amber-800/50 flex items-center justify-center text-amber-400 shrink-0">
                        <Volume2 size={13} />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-neutral-200 text-xs truncate">{sfx.title}</div>
                        <div className="text-[10px] text-neutral-500">
                          {sfx.category} · {sfx.duration}s
                        </div>
                      </div>
                    </div>
                    <button className="w-6 h-6 rounded-full bg-[#1685ff] text-white flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* LIVE VOICEOVER RECORDING */}
            {audioSubTab === 'record' && (
              <div className="p-6 bg-[#141414] border border-[#2e2e2e] rounded-2xl flex flex-col items-center justify-center text-center space-y-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    isRecording
                      ? 'bg-rose-500 text-white ring-8 ring-rose-500/20 animate-pulse'
                      : 'bg-[#252525] text-neutral-300'
                  }`}
                >
                  <Mic size={28} />
                </div>

                <div>
                  <div className="font-bold text-sm text-white">
                    {isRecording ? `Recording... 00:0${recordSeconds}` : 'Record Voiceover'}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 max-w-[200px]">
                    {isRecording ? 'Speak into your microphone' : 'Record voice narration directly to the timeline'}
                  </p>
                </div>

                {isRecording ? (
                  <button
                    onClick={stopVoiceRecording}
                    className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs shadow-lg transition-colors"
                  >
                    Stop Recording
                  </button>
                ) : (
                  <button
                    onClick={startVoiceRecording}
                    className="px-6 py-2 bg-[#1685ff] hover:bg-[#0070eb] text-white font-bold rounded-xl text-xs shadow-lg transition-colors flex items-center gap-1.5"
                  >
                    <Radio size={13} />
                    <span>Start Recording</span>
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* ======================= TAB 3: TEXT ======================= */}
        {activeTab === 'text' && (
          <div className="space-y-4">
            {/* Add Default Text Button */}
            <button
              onClick={() => addTextOverlay('DEFAULT TITLE')}
              className="w-full py-3 bg-[#1685ff] hover:bg-[#0070eb] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
            >
              <Plus size={15} />
              <span>Add Default Text</span>
            </button>

            {/* Template Categories */}
            <div className="flex gap-1 overflow-x-auto scrollbar-none pb-1 text-[10px]">
              {['all', 'Trending', 'Titles', 'Social', 'Minimal'].map((c) => (
                <button
                  key={c}
                  onClick={() => setTextCategory(c as any)}
                  className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                    textCategory === c ? 'bg-[#2c2c2c] text-white font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Text Template Cards */}
            <div className="space-y-2.5">
              {filteredTextTemplates.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => addTextOverlay(tmpl.text, tmpl.id)}
                  className="p-3.5 bg-[#141414] hover:bg-[#222222] border border-[#2e2e2e] hover:border-[#1685ff] rounded-xl cursor-pointer transition-all group"
                >
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">
                      {tmpl.category}
                    </span>
                    <button className="text-[10px] font-bold text-[#1685ff] opacity-0 group-hover:opacity-100 transition-opacity">
                      + Add
                    </button>
                  </div>
                  <div
                    style={{
                      fontFamily: tmpl.fontFamily,
                      color: tmpl.color,
                      textShadow: tmpl.shadowColor ? `0 0 10px ${tmpl.shadowColor}` : undefined,
                    }}
                    className="text-lg font-black tracking-wide truncate"
                  >
                    {tmpl.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 4: AUTO CAPTIONS ======================= */}
        {activeTab === 'captions' && (
          <div className="space-y-4">
            {/* Automatic Speech Recognition Button */}
            <div className="p-4 bg-gradient-to-br from-[#1685ff]/15 to-purple-900/15 border border-[#1685ff]/40 rounded-2xl space-y-3">
              <div className="flex items-center gap-2 text-white font-bold text-xs">
                <Sparkles size={15} className="text-[#1685ff]" />
                <span>AI Auto-Captions</span>
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Automatically transcribe speech audio from your timeline and generate perfectly synchronized subtitle cues.
              </p>
              <button
                onClick={generateAutoCaptions}
                className="w-full py-2.5 bg-[#1685ff] hover:bg-[#0070eb] text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors"
              >
                <Wand2 size={13} />
                <span>Generate Auto-Captions</span>
              </button>
            </div>

            {/* SRT Import & Export */}
            <div className="grid grid-cols-2 gap-2">
              <input
                type="file"
                ref={srtInputRef}
                onChange={(e) => e.target.files?.[0] && importSrtFile(e.target.files[0])}
                accept=".srt"
                className="hidden"
              />
              <button
                onClick={() => srtInputRef.current?.click()}
                className="py-2 bg-[#141414] hover:bg-[#252525] border border-[#333] text-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Upload size={13} />
                <span>Import SRT</span>
              </button>
              <button
                onClick={exportSrtFile}
                className="py-2 bg-[#141414] hover:bg-[#252525] border border-[#333] text-neutral-300 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download size={13} />
                <span>Export SRT</span>
              </button>
            </div>

            {/* Subtitle Cue List */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold text-neutral-300">
                <span>Subtitle Cues ({subtitles.length})</span>
                <button
                  onClick={() => addSubtitle()}
                  className="text-[#1685ff] hover:underline text-[11px] font-bold"
                >
                  + Add Cue
                </button>
              </div>

              {subtitles.length === 0 ? (
                <div className="text-center py-6 text-neutral-500 text-xs italic">
                  No captions yet. Click Generate Auto-Captions above.
                </div>
              ) : (
                subtitles.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-2.5 bg-[#141414] border border-[#2e2e2e] rounded-xl space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono">
                      <span>
                        {sub.startTime.toFixed(1)}s → {sub.endTime.toFixed(1)}s
                      </span>
                      <button onClick={() => deleteSubtitle(sub.id)} className="text-neutral-500 hover:text-rose-400">
                        <Trash2 size={12} />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={sub.text}
                      onChange={(e) => updateSubtitle(sub.id, { text: e.target.value })}
                      className="w-full bg-[#1e1e1e] border border-[#333] rounded px-2 py-1 text-xs text-white outline-none focus:border-[#1685ff]"
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================= TAB 5: STICKERS ======================= */}
        {activeTab === 'stickers' && (
          <div className="space-y-4">
            {/* Custom PNG Sticker Uploader */}
            <input
              type="file"
              ref={stickerInputRef}
              onChange={handleCustomStickerUpload}
              accept="image/png,image/webp,image/svg+xml"
              className="hidden"
            />
            <button
              onClick={() => stickerInputRef.current?.click()}
              className="w-full py-2.5 bg-[#141414] hover:bg-[#252525] border border-[#333] text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Upload size={14} className="text-amber-400" />
              <span>Upload Custom PNG Sticker</span>
            </button>

            {/* Sticker Categories */}
            <div className="flex gap-1 bg-[#141414] border border-[#2e2e2e] p-1 rounded-xl text-[11px]">
              {(['all', 'Emoji', 'Social', 'Badges'] as const).map((c) => (
                <button
                  key={c}
                  onClick={() => setStickerCategory(c)}
                  className={`flex-1 py-1 rounded-lg capitalize font-semibold transition-colors ${
                    stickerCategory === c ? 'bg-[#282828] text-white' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>

            {/* Stickers Grid */}
            <div className="grid grid-cols-4 gap-2">
              {filteredStickers.map((stk) => (
                <button
                  key={stk.id}
                  onClick={() => addSticker(stk.content, stk.isImage, stk.name)}
                  className="h-16 bg-[#141414] hover:bg-[#252525] border border-[#2e2e2e] hover:border-amber-400/60 rounded-xl flex items-center justify-center text-3xl transition-transform hover:scale-105"
                  title={stk.name}
                >
                  {stk.content}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ======================= TAB 6: EFFECTS ======================= */}
        {activeTab === 'effects' && (
          <div className="space-y-3">
            <div className="text-[11px] text-neutral-400">
              Select a video clip on the timeline to apply real-time cinematic effects:
            </div>
            <div className="space-y-2">
              {VIDEO_EFFECTS_LIST.map((eff) => {
                const isApplied = selectedClip?.effect === eff.id;
                return (
                  <div
                    key={eff.id}
                    onClick={() => {
                      if (selectedClip) {
                        updateClip(selectedClip.id, { effect: eff.id });
                        showToast(`Applied ${eff.name}`);
                      } else {
                        showToast('Select a video clip first');
                      }
                    }}
                    className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                      isApplied
                        ? 'bg-[#1685ff]/15 border-[#1685ff] text-white shadow'
                        : 'bg-[#141414] border-[#2e2e2e] hover:bg-[#222222] text-neutral-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-xs flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: eff.color }} />
                        <span>{eff.name}</span>
                      </div>
                      <div className="text-[10px] text-neutral-500 mt-0.5">{eff.description}</div>
                    </div>
                    {isApplied && <Check size={14} className="text-[#1685ff]" />}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= TAB 7: TRANSITIONS ======================= */}
        {activeTab === 'transitions' && (
          <div className="space-y-3">
            <div className="text-[11px] text-neutral-400">
              Add seamless transitions between video clips on your timeline:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {TRANSITIONS_LIST.map((tr) => {
                const isSelected = selectedClip?.transition === tr.id;
                return (
                  <button
                    key={tr.id}
                    onClick={() => {
                      if (selectedClip) {
                        updateClip(selectedClip.id, { transition: tr.id, transitionDuration: 0.5 });
                        showToast(`Set transition: ${tr.name}`);
                      } else {
                        showToast('Select a clip to apply transition');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-purple-900/30 border-purple-500 text-white shadow'
                        : 'bg-[#141414] border-[#2e2e2e] hover:bg-[#222222] text-neutral-300'
                    }`}
                  >
                    <span className="font-bold text-xs">{tr.name}</span>
                    <span className="text-[9px] text-neutral-500 mt-1">Duration: 0.5s</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================= TAB 8: FILTERS ======================= */}
        {activeTab === 'filters' && (
          <div className="space-y-3">
            <div className="text-[11px] text-neutral-400">
              Color grading LUTs and aesthetic video filters:
            </div>
            <div className="grid grid-cols-2 gap-2">
              {VIDEO_FILTERS_LIST.map((f) => {
                const isSelected = selectedClip?.filter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => {
                      if (selectedClip) {
                        updateClip(selectedClip.id, { filter: f.id });
                        showToast(`Filter: ${f.name}`);
                      } else {
                        showToast('Select a clip first');
                      }
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-[#1685ff]/20 border-[#1685ff] text-white shadow'
                        : 'bg-[#141414] border-[#2e2e2e] hover:bg-[#222222] text-neutral-300'
                    }`}
                  >
                    <span className="font-bold text-xs">{f.name}</span>
                    {isSelected && <Check size={14} className="text-[#1685ff] mt-1" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
