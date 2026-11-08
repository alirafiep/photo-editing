import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Sparkles,
  Scissors,
  Wand2,
  Film,
  Layers,
  Sliders,
  Type,
  FolderOpen,
  Clock,
  Trash2,
  Edit2,
  ArrowRight,
  Plus,
  Play,
  Upload,
  User,
  LogOut,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { PhotoProject, VideoProject, StudioMode } from '../types/editor';
import {
  getAllPhotoProjects,
  getAllVideoProjects,
  deletePhotoProject,
  deleteVideoProject,
  savePhotoProject,
  saveVideoProject,
} from '../utils/indexedDB';
import { createProjectFromSample, SAMPLE_PROJECTS } from '../utils/sampleData';
import { createDefaultVideoProject, createNewBlankVideoProject } from '../utils/videoProcessing';
import { SnapEditLogo, SNAPEDIT_LOGO_SRC } from './common/SnapEditLogo';
import { UserProfileModal } from './common/UserProfileModal';

interface HomeScreenProps {
  onSelectMode: (mode: 'photo' | 'video') => void;
  onOpenPhotoProject: (project: PhotoProject) => void;
  onOpenVideoProject: (project: VideoProject) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectMode,
  onOpenPhotoProject,
  onOpenVideoProject,
}) => {
  const { user, signInWithGoogle, signOut, showAuthModal, setShowAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState<'create' | 'photo_projects' | 'video_projects'>('create');
  const [photoProjects, setPhotoProjects] = useState<PhotoProject[]>([]);
  const [videoProjects, setVideoProjects] = useState<VideoProject[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Load saved projects from IndexedDB
  const loadProjects = async () => {
    const photos = await getAllPhotoProjects();
    const videos = await getAllVideoProjects();
    setPhotoProjects(photos);
    setVideoProjects(videos);
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeletePhoto = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this photo project?')) {
      await deletePhotoProject(id);
      loadProjects();
    }
  };

  const handleDeleteVideo = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('Delete this video project?')) {
      await deleteVideoProject(id);
      loadProjects();
    }
  };

  const handleRenamePhoto = async (id: string) => {
    if (!editName.trim()) return;
    const target = photoProjects.find((p) => p.id === id);
    if (target) {
      target.name = editName.trim();
      await savePhotoProject(target);
      loadProjects();
    }
    setEditingId(null);
  };

  const handleRenameVideo = async (id: string) => {
    if (!editName.trim()) return;
    const target = videoProjects.find((p) => p.id === id);
    if (target) {
      target.name = editName.trim();
      await saveVideoProject(target);
      loadProjects();
    }
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#e0e0e0] flex flex-col font-sans select-none">
      {/* Top Header */}
      <header className="h-16 bg-[#1c1c1c] border-b border-[#2d2d2d] px-6 flex items-center justify-between sticky top-0 z-40">
        <SnapEditLogo size="sm" showText showTagline />

        {/* Center Navigation Tabs */}
        <div className="hidden md:flex items-center bg-[#252525] border border-[#383838] p-1 rounded-xl gap-1 text-xs">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
              activeTab === 'create'
                ? 'bg-[#1685ff] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Create New
          </button>
          <button
            onClick={() => setActiveTab('photo_projects')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'photo_projects'
                ? 'bg-[#1685ff] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ImageIcon size={13} />
            <span>Photo Projects ({photoProjects.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('video_projects')}
            className={`px-4 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
              activeTab === 'video_projects'
                ? 'bg-[#1685ff] text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Film size={13} />
            <span>Video Projects ({videoProjects.length})</span>
          </button>
        </div>

        {/* User Account / Google Sign-In */}
        <div className="flex items-center gap-3">
          {user.isGuest ? (
            <button
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#252525] hover:bg-[#303030] border border-[#3a3a3a] text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Google Sign-In</span>
            </button>
          ) : (
            <div
              onClick={() => setShowProfileModal(true)}
              className="flex items-center gap-2.5 bg-[#252525] hover:bg-[#2b2b2b] border border-[#3a3a3a] px-3 py-1 rounded-lg cursor-pointer transition-colors"
            >
              <div className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-white/20 shrink-0">
                <img
                  src={user.photoUrl || SNAPEDIT_LOGO_SRC}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">
                  {user.name}
                </div>
                <div className="text-[10px] text-neutral-400">{user.email}</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  signOut();
                }}
                className="p-1 hover:text-rose-400 text-neutral-400 rounded transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut size={13} />
              </button>
            </div>
          )}

          {/* Profile Quick Button for Guests too */}
          {user.isGuest && (
            <div
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20 border border-white/10 cursor-pointer hover:ring-2 hover:ring-[#1685ff] transition-all shrink-0"
              title="Edit Profile"
            >
              <img
                src={user.photoUrl || SNAPEDIT_LOGO_SRC}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
      </header>

      {/* Main Home Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-6 sm:p-10 flex flex-col justify-center">
        {activeTab === 'create' && (
          <div className="space-y-10">
            {/* Hero Title */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight">
                What would you like to edit today?
              </h1>
              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Choose between the professional multi-layer Photo Studio or the timeline-based Video Studio.
              </p>
            </div>

            {/* THE TWO MAIN ATTRACTIVE CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* 1. PHOTO EDITING CARD */}
              <div
                onClick={() => onSelectMode('photo')}
                className="group relative bg-[#1e1e1e] hover:bg-[#232323] border border-[#353535] hover:border-[#1685ff] rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Background ambient glow */}
                <div className="absolute -top-24 -right-24 w-56 h-56 bg-sky-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-sky-500/20 transition-all" />

                <div>
                  {/* Visual Header & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-600 to-[#1685ff] flex items-center justify-center text-white shadow-lg ring-1 ring-white/20">
                      <ImageIcon size={28} />
                    </div>
                    <span className="px-3 py-1 bg-sky-950/70 text-sky-400 border border-sky-800/60 rounded-full text-[11px] font-semibold tracking-wide">
                      STUDIO ENGINE
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-white mb-2 group-hover:text-[#1685ff] transition-colors">
                    PHOTO EDITING
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                    Professional multi-layer photo editing workspace with AI Background Removal, 10+ precision Blur Tools, customizable canvas sizes (A0–A6, Tabloid, Letter), and custom font importing.
                  </p>

                  {/* Feature Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Scissors size={14} className="text-[#1685ff]" />
                      <span>AI Background Remover</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wand2 size={14} className="text-sky-400" />
                      <span>10 Dedicated Blur Tools</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Layers size={14} className="text-indigo-400" />
                      <span>Multi-Layer Photoshop Canvas</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Type size={14} className="text-cyan-400" />
                      <span>Import TTF, OTF, WOFF2</span>
                    </div>
                  </div>
                </div>

                {/* Primary Launch Action */}
                <div className="pt-4 border-t border-[#333] flex items-center justify-between text-white font-bold text-sm">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Launch Photo Studio
                  </span>
                  <div className="w-9 h-9 rounded-full bg-[#1685ff] group-hover:bg-[#0070eb] flex items-center justify-center transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>

              {/* 2. VIDEO EDITING CARD */}
              <div
                onClick={() => onSelectMode('video')}
                className="group relative bg-[#1e1e1e] hover:bg-[#232323] border border-[#353535] hover:border-emerald-500 rounded-2xl p-6 sm:p-8 cursor-pointer transition-all duration-200 hover:-translate-y-1.5 shadow-2xl flex flex-col justify-between overflow-hidden"
              >
                {/* Background ambient glow */}
                <div className="absolute -top-24 -right-24 w-56 h-56 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-all" />

                <div>
                  {/* Visual Header & Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg ring-1 ring-white/20">
                      <Film size={28} />
                    </div>
                    <span className="px-3 py-1 bg-emerald-950/70 text-emerald-400 border border-emerald-800/60 rounded-full text-[11px] font-semibold tracking-wide">
                      CAPCUT-INSPIRED
                    </span>
                  </div>

                  <h2 className="text-2xl font-black text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    VIDEO EDITING
                  </h2>
                  <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed mb-6">
                    Full-featured timeline video editor with multi-track video & audio, clip splitting (`C`), smooth transitions (Fade, Zoom, Glitch), auto speech captions, keyframe animations, and 4K export.
                  </p>

                  {/* Feature Highlights Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-neutral-300 mb-6">
                    <div className="flex items-center gap-2">
                      <Film size={14} className="text-emerald-400" />
                      <span>Multi-Track Video Timeline</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles size={14} className="text-teal-400" />
                      <span>Auto Speech-to-Text Captions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sliders size={14} className="text-emerald-300" />
                      <span>Cut, Trim & Split Clips</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Play size={14} className="text-teal-300" />
                      <span>Transitions & Audio Mixing</span>
                    </div>
                  </div>
                </div>

                {/* Primary Launch Action */}
                <div className="pt-4 border-t border-[#333] flex items-center justify-between text-white font-bold text-sm">
                  <span className="group-hover:translate-x-1 transition-transform">
                    Launch Video Studio
                  </span>
                  <div className="w-9 h-9 rounded-full bg-emerald-600 group-hover:bg-emerald-500 flex items-center justify-center transition-colors">
                    <ArrowRight size={18} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Recent Projects Preview Bar */}
            {(photoProjects.length > 0 || videoProjects.length > 0) && (
              <div className="pt-6 border-t border-[#2a2a2a]">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-neutral-300">
                    <Clock size={16} className="text-[#1685ff]" />
                    <span>Recent Projects</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setActiveTab('photo_projects')}
                      className="text-xs text-[#1685ff] hover:underline"
                    >
                      View All Photos ({photoProjects.length})
                    </button>
                    <span className="text-neutral-600">·</span>
                    <button
                      onClick={() => setActiveTab('video_projects')}
                      className="text-xs text-emerald-400 hover:underline"
                    >
                      View All Videos ({videoProjects.length})
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {photoProjects.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      onClick={() => onOpenPhotoProject(p)}
                      className="bg-[#1c1c1c] hover:bg-[#242424] border border-[#333] hover:border-[#1685ff] rounded-xl p-3 cursor-pointer transition-all shadow"
                    >
                      <div className="h-20 bg-[#111] rounded-lg mb-2 overflow-hidden flex items-center justify-center text-neutral-500">
                        {p.thumbnail || (p.layers[0]?.dataUrl) ? (
                          <img
                            src={p.thumbnail || p.layers[0].dataUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon size={24} />
                        )}
                      </div>
                      <div className="font-semibold text-white text-xs truncate">
                        {p.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        Photo · {p.width}×{p.height}
                      </div>
                    </div>
                  ))}

                  {videoProjects.slice(0, 2).map((v) => (
                    <div
                      key={v.id}
                      onClick={() => onOpenVideoProject(v)}
                      className="bg-[#1c1c1c] hover:bg-[#242424] border border-[#333] hover:border-emerald-500 rounded-xl p-3 cursor-pointer transition-all shadow"
                    >
                      <div className="h-20 bg-[#111] rounded-lg mb-2 overflow-hidden flex items-center justify-center text-neutral-500">
                        <Film size={24} className="text-emerald-500" />
                      </div>
                      <div className="font-semibold text-white text-xs truncate">
                        {v.name}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-0.5">
                        Video · {v.duration}s ({v.aspectRatio})
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* PHOTO PROJECTS LIBRARY TAB */}
        {activeTab === 'photo_projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <ImageIcon size={24} className="text-[#1685ff]" />
                  <span>Photo Projects</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Saved locally in IndexedDB. Open any project to continue editing.
                </p>
              </div>
              <button
                onClick={() => onSelectMode('photo')}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#1685ff] hover:bg-[#0070eb] text-white text-xs font-semibold rounded-lg shadow"
              >
                <Plus size={15} />
                <span>New Photo Project</span>
              </button>
            </div>

            {photoProjects.length === 0 ? (
              <div className="p-12 text-center bg-[#1c1c1c] rounded-2xl border border-[#333] space-y-3">
                <ImageIcon size={40} className="mx-auto text-neutral-600" />
                <div className="text-sm font-semibold text-white">No photo projects saved yet</div>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Start by launching the Photo Studio or picking a canvas size preset.
                </p>
                <button
                  onClick={() => onSelectMode('photo')}
                  className="px-4 py-2 bg-[#1685ff] text-white text-xs font-semibold rounded-lg"
                >
                  Create First Photo Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photoProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => onOpenPhotoProject(p)}
                    className="group bg-[#1c1c1c] hover:bg-[#232323] border border-[#333] hover:border-[#1685ff] rounded-xl overflow-hidden cursor-pointer transition-all shadow-md flex flex-col justify-between"
                  >
                    <div className="h-36 bg-[#111] overflow-hidden relative">
                      {p.layers[0]?.dataUrl ? (
                        <img
                          src={p.layers[0].dataUrl}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-neutral-600">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur rounded text-[10px] text-white font-mono">
                        {p.width} × {p.height}
                      </div>
                    </div>

                    <div className="p-3">
                      {editingId === p.id ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="text"
                            value={editName}
                            autoFocus
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRenamePhoto(p.id)}
                            className="bg-[#111] border border-[#1685ff] text-white text-xs px-2 py-1 rounded w-full outline-none"
                          />
                          <button
                            onClick={() => handleRenamePhoto(p.id)}
                            className="p-1 bg-[#1685ff] text-white rounded"
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-xs truncate flex-1">
                            {p.name}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(p.id);
                                setEditName(p.name);
                              }}
                              className="p-1 hover:text-[#1685ff] text-neutral-400"
                              title="Rename"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={(e) => handleDeletePhoto(e, p.id)}
                              className="p-1 hover:text-rose-400 text-neutral-400"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="text-[10px] text-neutral-400 mt-1">
                        Last edited {new Date(p.updatedAt).toLocaleDateString()} · {p.layers.length} layers
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIDEO PROJECTS LIBRARY TAB */}
        {activeTab === 'video_projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Film size={24} className="text-emerald-400" />
                  <span>Video Projects</span>
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Saved locally in IndexedDB. Open any project to continue editing your timeline.
                </p>
              </div>
              <button
                onClick={() => onSelectMode('video')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg shadow"
              >
                <Plus size={15} />
                <span>New Video Project</span>
              </button>
            </div>

            {videoProjects.length === 0 ? (
              <div className="p-12 text-center bg-[#1c1c1c] rounded-2xl border border-[#333] space-y-3">
                <Film size={40} className="mx-auto text-neutral-600" />
                <div className="text-sm font-semibold text-white">No video projects saved yet</div>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                  Launch the Video Studio to import clips, music and start building your timeline.
                </p>
                <button
                  onClick={() => onSelectMode('video')}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-lg"
                >
                  Create First Video Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {videoProjects.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => onOpenVideoProject(v)}
                    className="group bg-[#1c1c1c] hover:bg-[#232323] border border-[#333] hover:border-emerald-500 rounded-xl overflow-hidden cursor-pointer transition-all shadow-md flex flex-col justify-between"
                  >
                    <div className="h-36 bg-[#111] overflow-hidden relative flex items-center justify-center text-emerald-500">
                      <Film size={36} />
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur rounded text-[10px] text-white font-mono">
                        {v.duration}s · {v.aspectRatio}
                      </div>
                    </div>

                    <div className="p-3">
                      {editingId === v.id ? (
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="flex items-center gap-1"
                        >
                          <input
                            type="text"
                            value={editName}
                            autoFocus
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleRenameVideo(v.id)}
                            className="bg-[#111] border border-emerald-500 text-white text-xs px-2 py-1 rounded w-full outline-none"
                          />
                          <button
                            onClick={() => handleRenameVideo(v.id)}
                            className="p-1 bg-emerald-600 text-white rounded"
                          >
                            <Check size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-white text-xs truncate flex-1">
                            {v.name}
                          </span>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingId(v.id);
                                setEditName(v.name);
                              }}
                              className="p-1 hover:text-emerald-400 text-neutral-400"
                              title="Rename"
                            >
                              <Edit2 size={12} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteVideo(e, v.id)}
                              className="p-1 hover:text-rose-400 text-neutral-400"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      )}
                      <div className="text-[10px] text-neutral-400 mt-1">
                        Last edited {new Date(v.updatedAt).toLocaleDateString()} · {v.videoClips.length} clips
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-md bg-[#222] border border-[#383838] rounded-2xl p-6 text-[#e0e0e0] shadow-2xl space-y-5">
            <div className="text-center space-y-2">
              <SnapEditLogo size="md" showText={false} className="justify-center mx-auto mb-2" />
              <h3 className="text-xl font-bold text-white">Sign in to SNAPEDIT</h3>
              <p className="text-xs text-neutral-400">
                Save your photo and video projects across all your devices.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={signInWithGoogle}
                className="w-full py-2.5 px-4 bg-white hover:bg-neutral-100 text-neutral-900 rounded-xl font-semibold text-xs flex items-center justify-center gap-3 transition-colors shadow-md"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full py-2.5 px-4 bg-[#2f2f2f] hover:bg-[#383838] text-neutral-300 rounded-xl font-medium text-xs transition-colors"
              >
                Continue as Guest (Offline IndexedDB)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </div>
  );
};
