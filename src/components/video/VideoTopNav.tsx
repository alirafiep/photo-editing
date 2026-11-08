import React, { useState } from 'react';
import {
  ChevronLeft,
  Film,
  Download,
  Plus,
  Monitor,
  Smartphone,
  Square,
  Edit2,
  Check,
  Sparkles,
} from 'lucide-react';
import { useVideo } from '../../context/VideoContext';
import { useAuth } from '../../context/AuthContext';
import { SnapEditLogo, SNAPEDIT_LOGO_SRC } from '../common/SnapEditLogo';
import { UserProfileModal } from '../common/UserProfileModal';

interface VideoTopNavProps {
  onBackToHome: () => void;
  onOpenExport: () => void;
  onOpenNewProject: () => void;
}

export const VideoTopNav: React.FC<VideoTopNavProps> = ({
  onBackToHome,
  onOpenExport,
  onOpenNewProject,
}) => {
  const { project, setProject, showToast } = useVideo();
  const { user, setShowAuthModal } = useAuth();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(project.name);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleFinishTitle = () => {
    if (title.trim()) {
      setProject((p) => ({ ...p, name: title.trim() }));
      showToast('Renamed project');
    }
    setIsEditingTitle(false);
  };

  const setAspect = (ratio: '16:9' | '9:16' | '1:1' | '4:5' | '4:3') => {
    let w = 1920;
    let h = 1080;
    if (ratio === '9:16') {
      w = 1080;
      h = 1920;
    } else if (ratio === '1:1') {
      w = 1080;
      h = 1080;
    } else if (ratio === '4:5') {
      w = 1080;
      h = 1350;
    } else if (ratio === '4:3') {
      w = 1440;
      h = 1080;
    }
    setProject((p) => ({ ...p, aspectRatio: ratio, width: w, height: h }));
    showToast(`Aspect ratio set to ${ratio}`);
  };

  return (
    <header className="h-12 bg-[#181818] border-b border-[#2e2e2e] px-3.5 flex items-center justify-between text-xs text-[#e0e0e0] select-none z-30 shrink-0">
      {/* Left: Home Button + SNAPEDIT Brand Logo + Project Name */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToHome}
          className="flex items-center gap-1.5 px-2.5 py-1 bg-[#252525] hover:bg-[#303030] text-neutral-300 hover:text-white rounded-lg transition-colors border border-[#383838]"
          title="Return to SNAPEDIT Home & Projects"
        >
          <ChevronLeft size={15} />
          <span className="font-semibold text-xs">Home</span>
        </button>

        <div className="w-[1px] h-5 bg-[#333]" />

        {/* Official Brand Logo */}
        <SnapEditLogo size="xs" showText={false} onClick={onBackToHome} />

        {/* Project Name (Editable) */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={title}
                autoFocus
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleFinishTitle}
                onKeyDown={(e) => e.key === 'Enter' && handleFinishTitle()}
                className="bg-[#111] border border-[#1685ff] text-white rounded-md px-2 py-0.5 text-xs outline-none"
              />
              <button onClick={handleFinishTitle} className="p-1 text-[#1685ff]">
                <Check size={13} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 cursor-pointer hover:text-white font-bold text-xs group"
              title="Click to rename project"
            >
              <span className="truncate max-w-[180px]">{project.name}</span>
              <Edit2 size={11} className="text-neutral-500 group-hover:text-neutral-300" />
            </div>
          )}
        </div>

        {/* Requirement 4: New Black Canvas Project Button */}
        <button
          onClick={onOpenNewProject}
          className="hidden sm:flex items-center gap-1 px-2.5 py-1 bg-[#222222] hover:bg-[#2c2c2c] text-neutral-300 hover:text-white border border-[#383838] rounded-lg transition-colors font-medium text-[11px]"
          title="Open New Black Canvas Project"
        >
          <Plus size={13} className="text-[#1685ff]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Center: Aspect Ratio & Canvas Resolution Controls */}
      <div className="hidden md:flex items-center gap-1 bg-[#141414] border border-[#2e2e2e] p-1 rounded-xl text-[11px]">
        {(['16:9', '9:16', '1:1', '4:5', '4:3'] as const).map((r) => (
          <button
            key={r}
            onClick={() => setAspect(r)}
            className={`px-2.5 py-0.5 rounded-lg font-bold transition-colors ${
              project.aspectRatio === r
                ? 'bg-[#1685ff] text-white shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Right: Export & Profile */}
      <div className="flex items-center gap-2.5">
        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-[#1685ff] to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-md shadow-[#1685ff]/20 text-xs transition-all"
        >
          <Download size={13} />
          <span>Export</span>
        </button>

        {/* User Profile Avatar */}
        <div
          onClick={() => setShowProfileModal(true)}
          className="w-7 h-7 rounded-full overflow-hidden bg-[#161616] text-white font-bold flex items-center justify-center text-xs shadow-inner ring-1 ring-white/20 cursor-pointer hover:ring-2 hover:ring-[#1685ff] transition-all shrink-0"
          title={`Profile: ${user.name} (${user.isGuest ? 'Guest - Click to edit profile' : user.email})`}
        >
          <img
            src={user.photoUrl || SNAPEDIT_LOGO_SRC}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      <UserProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </header>
  );
};
