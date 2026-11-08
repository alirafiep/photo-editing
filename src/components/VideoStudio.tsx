import React, { useState } from 'react';
import { useVideo } from '../context/VideoContext';
import { VideoTopNav } from './video/VideoTopNav';
import { VideoLeftPanel } from './video/VideoLeftPanel';
import { VideoPlayer } from './video/VideoPlayer';
import { VideoPropertiesPanel } from './video/VideoPropertiesPanel';
import { VideoTimeline } from './video/VideoTimeline';
import { VideoExportModal } from './video/VideoExportModal';
import { NewVideoProjectModal } from './modals/NewVideoProjectModal';
import { CheckCircle2 } from 'lucide-react';

interface VideoStudioProps {
  onBackToHome: () => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({ onBackToHome }) => {
  const { toastMsg } = useVideo();
  const [showExportModal, setShowExportModal] = useState(false);
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#141414] text-[#e0e0e0] font-sans">
      {/* 1. CapCut-Style Top Navigation Bar */}
      <VideoTopNav
        onBackToHome={onBackToHome}
        onOpenExport={() => setShowExportModal(true)}
        onOpenNewProject={() => setShowNewProjectModal(true)}
      />

      {/* 2. Middle 3-Column Studio Workspace: Left Panel + Center Player + Right Properties Inspector */}
      <div className="flex-1 flex overflow-hidden relative">
        <VideoLeftPanel />
        <VideoPlayer />
        <VideoPropertiesPanel />
      </div>

      {/* 3. Bottom Multi-Track Timeline */}
      <VideoTimeline />

      {/* Export Modal */}
      <VideoExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
      />

      {/* New Project (Black Canvas) Modal */}
      <NewVideoProjectModal
        isOpen={showNewProjectModal}
        onClose={() => setShowNewProjectModal(false)}
      />

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 bg-[#202020]/95 border border-[#383838] text-white px-4 py-2 rounded-xl shadow-2xl flex items-center gap-2 text-xs backdrop-blur pointer-events-none transition-all">
          <CheckCircle2 size={14} className="text-[#1685ff]" />
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
};
