import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { EditorProvider, useEditor } from './context/EditorContext';
import { VideoProvider, useVideo } from './context/VideoContext';
import { HomeScreen } from './components/HomeScreen';
import { VideoStudio } from './components/VideoStudio';
import { TopNav } from './components/TopNav';
import { ContextBar } from './components/ContextBar';
import { LeftToolbar } from './components/LeftToolbar';
import { CanvasArea } from './components/CanvasArea';
import { RightSidebar } from './components/RightSidebar';
import { NewProjectModal } from './components/modals/NewProjectModal';
import { ExportModal } from './components/modals/ExportModal';
import { ResizeModal } from './components/modals/ResizeModal';
import { DesktopAppModal } from './components/modals/DesktopAppModal';
import { ShareModal } from './components/modals/ShareModal';
import { ColorPickerModal } from './components/modals/ColorPickerModal';
import { CanvasPresetsModal } from './components/modals/CanvasPresetsModal';
import { FontLibraryModal } from './components/modals/FontLibraryModal';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { StudioMode, PhotoProject, VideoProject } from './types/editor';

interface PhotoStudioProps {
  onBackToHome: () => void;
}

const PhotoStudio: React.FC<PhotoStudioProps> = ({ onBackToHome }) => {
  const {
    activeProject,
    zoom,
    selectedLayer,
    activeTool,
    toolSettings,
    updateToolSettings,
    isProcessingAI,
    aiStatusMessage,
    toastMessage,
    showPresetsModal,
    setShowPresetsModal,
    showFontModal,
    setShowFontModal,
    createNewProject,
    setOnReturnToHome,
  } = useEditor();

  useEffect(() => {
    setOnReturnToHome(onBackToHome);
  }, [onBackToHome, setOnReturnToHome]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#181818] text-[#e0e0e0] font-sans">
      {/* 1. Top Navigation Bar */}
      <TopNav />

      {/* 2. Contextual Tool Options Bar */}
      <ContextBar />

      {/* 3. Middle Studio Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Vertical Toolbar */}
        <LeftToolbar />

        {/* Center Canvas Area with Document Tabs */}
        <CanvasArea />

        {/* Right Tabbed Sidebar (Layers, Properties, Adjustments, Blur Tools, History, Filters) */}
        <RightSidebar />
      </div>

      {/* 4. Bottom Photoshop Status Bar */}
      <footer className="h-6 bg-[#202020] border-t border-[#3a3a3a] px-3 flex items-center justify-between text-[11px] text-neutral-400 select-none z-10">
        <div className="flex items-center gap-4">
          {activeProject ? (
            <>
              <span className="font-mono text-neutral-300">
                {activeProject.width} × {activeProject.height} px ({Math.round(zoom * 100)}%)
              </span>
              <span className="text-neutral-500">·</span>
              <span>sRGB 8-bit</span>
              <span className="text-neutral-500">·</span>
              <span>{activeProject.layers.length} Layers</span>
            </>
          ) : (
            <span>No active document</span>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="capitalize">Tool: {activeTool}</span>
          {selectedLayer && (
            <>
              <span className="text-neutral-500">·</span>
              <span className="text-neutral-300 truncate max-w-[200px]">
                Selected: {selectedLayer.name}
              </span>
            </>
          )}
        </div>
      </footer>

      {/* Photo Studio Modals */}
      <NewProjectModal />
      <ExportModal />
      <ResizeModal />
      <DesktopAppModal />
      <ShareModal />
      <ColorPickerModal />
      <CanvasPresetsModal
        isOpen={showPresetsModal}
        onClose={() => setShowPresetsModal(false)}
        onSelectDimensions={(name, w, h) => createNewProject(name, w, h)}
      />
      <FontLibraryModal
        isOpen={showFontModal}
        onClose={() => setShowFontModal(false)}
        onSelectFont={(font) => updateToolSettings('text', { fontFamily: font })}
        currentFont={toolSettings.text.fontFamily}
      />

      {/* AI Processing Overlay */}
      {isProcessingAI && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-[#242424] border border-[#1685ff]/50 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-full bg-[#1685ff]/20 text-[#1685ff] flex items-center justify-center mx-auto ring-4 ring-[#1685ff]/10">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-white mb-1">
                <Sparkles size={16} className="text-[#1685ff]" />
                <span>SNAPEDIT AI Processing</span>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {aiStatusMessage || 'Enhancing photo lighting and rendering pixels...'}
              </p>
            </div>
            <div className="text-[10px] text-neutral-500">
              Powered by Google Gemini 3.8 & High-Performance Canvas Engine
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-9 left-1/2 -translate-x-1/2 z-50 bg-[#222222]/95 border border-[#3a3a3a] text-white px-4 py-2 rounded-lg shadow-2xl flex items-center gap-2 text-xs backdrop-blur pointer-events-none transition-all">
          <CheckCircle2 size={14} className="text-[#1685ff]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

const StudioRouter: React.FC = () => {
  const [mode, setMode] = useState<StudioMode>('home');
  const { openProject } = useEditor();
  const { loadVideoProject } = useVideo();

  const handleOpenPhoto = (proj: PhotoProject) => {
    openProject(proj);
    setMode('photo');
  };

  const handleOpenVideo = (proj: VideoProject) => {
    loadVideoProject(proj);
    setMode('video');
  };

  if (mode === 'photo') {
    return <PhotoStudio onBackToHome={() => setMode('home')} />;
  }

  if (mode === 'video') {
    return <VideoStudio onBackToHome={() => setMode('home')} />;
  }

  return (
    <HomeScreen
      onSelectMode={(selectedMode) => setMode(selectedMode)}
      onOpenPhotoProject={handleOpenPhoto}
      onOpenVideoProject={handleOpenVideo}
    />
  );
};

export default function App() {
  return (
    <AuthProvider>
      <EditorProvider>
        <VideoProvider>
          <StudioRouter />
        </VideoProvider>
      </EditorProvider>
    </AuthProvider>
  );
}
