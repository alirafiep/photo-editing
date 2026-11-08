import React, { useState, useRef, useEffect } from 'react';
import {
  Undo2,
  Redo2,
  Download,
  Share2,
  MonitorDown,
  ChevronDown,
  Sparkles,
  Layers,
  Crop,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Sliders,
  FilePlus,
  FolderOpen,
  Save,
  Check,
  Home,
  Type,
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { useAuth } from '../context/AuthContext';
import { SAMPLE_PROJECTS } from '../utils/sampleData';
import { SnapEditLogo, SNAPEDIT_LOGO_SRC } from './common/SnapEditLogo';
import { UserProfileModal } from './common/UserProfileModal';

export const TopNav: React.FC = () => {
  const {
    undo,
    redo,
    historyIndex,
    history,
    zoom,
    setZoom,
    fitToScreen,
    zoomTo,
    activeProject,
    setShowNewModal,
    setShowPresetsModal,
    setShowFontModal,
    setShowExportModal,
    setShowResizeModal,
    setShowDesktopModal,
    setShowShareModal,
    openSampleProject,
    openImageFiles,
    addImageAsLayer,
    addLayer,
    duplicateLayer,
    deleteLayer,
    selectedLayerId,
    selectedLayer,
    updateLayer,
    mergeDown,
    flattenProject,
    autoEnhanceImage,
    setActiveSidebarTab,
    setSelection,
    showToast,
    onReturnToHome,
  } = useEditor();

  const { user, setShowAuthModal } = useAuth();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addLayerInputRef = useRef<HTMLInputElement>(null);
  const menuContainerRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(e.target as Node)
      ) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOpenFileInput = () => {
    fileInputRef.current?.click();
    setActiveMenu(null);
  };

  const handleAddLayerInput = () => {
    addLayerInputRef.current?.click();
    setActiveMenu(null);
  };

  const zoomPercent = Math.round(zoom * 100);

  return (
    <header className="h-11 bg-[#242424] border-b border-[#3a3a3a] px-3 flex items-center justify-between text-xs select-none relative z-50">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files && openImageFiles(e.target.files)}
        multiple
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />
      <input
        type="file"
        ref={addLayerInputRef}
        onChange={(e) =>
          e.target.files && e.target.files[0] && addImageAsLayer(e.target.files[0])
        }
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
      />

      {/* Left: Brand & Menu items */}
      <div className="flex items-center gap-1 md:gap-3" ref={menuContainerRef}>
        {/* Return to Home Studio */}
        {onReturnToHome && (
          <button
            onClick={onReturnToHome}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#2c2c2c] hover:bg-[#383838] text-white font-medium text-xs border border-[#3e3e3e] transition-colors"
            title="Return to SNAPEDIT Home & Projects"
          >
            <Home size={14} className="text-[#1685ff]" />
            <span className="hidden sm:inline text-[11px]">Home</span>
          </button>
        )}

        {/* SNAPEDIT Logo */}
        <div
          onClick={() => setShowNewModal(true)}
          className="flex items-center cursor-pointer pr-2 border-r border-[#3a3a3a] hover:opacity-90 transition-opacity"
          title="SNAPEDIT - Click for New Project"
        >
          <SnapEditLogo size="xs" showText={true} />
        </div>

        {/* Dropdown Menus */}
        <div className="flex items-center text-[#d0d0d0]">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeMenu === 'file' ? 'bg-[#383838] text-white' : 'hover:bg-[#303030]'
              }`}
            >
              File
            </button>
            {activeMenu === 'file' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-xl py-1 text-[12px] z-50">
                <button
                  onClick={() => {
                    setShowNewModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FilePlus size={14} /> New Project...
                  </span>
                  <span className="text-[10px] opacity-60">Ctrl+N</span>
                </button>
                <button
                  onClick={() => {
                    setShowPresetsModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2 text-[#1685ff]"
                >
                  <Maximize2 size={14} /> Canvas Presets (A0-A6, Letter...)
                </button>
                <button
                  onClick={() => {
                    setShowFontModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <Type size={14} /> Font Library & Import...
                </button>
                <div className="my-1 border-t border-[#3a3a3a]" />
                <button
                  onClick={handleOpenFileInput}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <FolderOpen size={14} /> Open Image...
                  </span>
                  <span className="text-[10px] opacity-60">Ctrl+O</span>
                </button>
                <button
                  onClick={handleAddLayerInput}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <Layers size={14} /> Add Image as Layer...
                </button>
                <div className="my-1 border-t border-[#3a3a3a]" />
                <div className="px-3 py-1 text-[10px] uppercase font-bold text-neutral-400">
                  Sample Projects
                </div>
                {SAMPLE_PROJECTS.map((sp) => (
                  <button
                    key={sp.id}
                    onClick={() => {
                      openSampleProject(sp);
                      setActiveMenu(null);
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white truncate"
                  >
                    {sp.title}
                  </button>
                ))}
                <div className="my-1 border-t border-[#3a3a3a]" />
                <button
                  onClick={() => {
                    setShowExportModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center justify-between"
                >
                  <span className="flex items-center gap-2">
                    <Download size={14} /> Export Image...
                  </span>
                  <span className="text-[10px] opacity-60">Ctrl+E</span>
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeMenu === 'edit' ? 'bg-[#383838] text-white' : 'hover:bg-[#303030]'
              }`}
            >
              Edit
            </button>
            {activeMenu === 'edit' && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-xl py-1 text-[12px] z-50">
                <button
                  onClick={() => {
                    undo();
                    setActiveMenu(null);
                  }}
                  disabled={historyIndex <= 0}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center justify-between disabled:opacity-40"
                >
                  <span>Undo</span>
                  <span className="text-[10px] opacity-60">Ctrl+Z</span>
                </button>
                <button
                  onClick={() => {
                    redo();
                    setActiveMenu(null);
                  }}
                  disabled={historyIndex >= history.length - 1}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center justify-between disabled:opacity-40"
                >
                  <span>Redo</span>
                  <span className="text-[10px] opacity-60">Ctrl+Y</span>
                </button>
                <div className="my-1 border-t border-[#3a3a3a]" />
                <button
                  onClick={() => {
                    if (selectedLayerId) deleteLayer(selectedLayerId);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center justify-between"
                >
                  <span>Delete</span>
                  <span className="text-[10px] opacity-60">Del</span>
                </button>
                <button
                  onClick={() => {
                    setSelection(null);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center justify-between"
                >
                  <span>Deselect</span>
                  <span className="text-[10px] opacity-60">Ctrl+D</span>
                </button>
              </div>
            )}
          </div>

          {/* Image Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'image' ? null : 'image')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeMenu === 'image' ? 'bg-[#383838] text-white' : 'hover:bg-[#303030]'
              }`}
            >
              Image
            </button>
            {activeMenu === 'image' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-xl py-1 text-[12px] z-50">
                <button
                  onClick={() => {
                    autoEnhanceImage();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <Sparkles size={14} className="text-[#1685ff]" /> Auto Enhance (AI)
                </button>
                <button
                  onClick={() => {
                    setActiveSidebarTab('adjustments');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <Sliders size={14} /> Adjustments Panel
                </button>
                <div className="my-1 border-t border-[#3a3a3a]" />
                <button
                  onClick={() => {
                    setShowResizeModal(true);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <Maximize2 size={14} /> Image / Canvas Size...
                </button>
                <div className="my-1 border-t border-[#3a3a3a]" />
                <button
                  onClick={() => {
                    if (selectedLayer) {
                      updateLayer(
                        selectedLayer.id,
                        { rotation: (selectedLayer.rotation + 90) % 360 },
                        true,
                        'Rotate 90° CW'
                      );
                    }
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <RotateCw size={14} /> Rotate 90° CW
                </button>
                <button
                  onClick={() => {
                    if (selectedLayer) {
                      updateLayer(
                        selectedLayer.id,
                        { rotation: (selectedLayer.rotation - 90 + 360) % 360 },
                        true,
                        'Rotate 90° CCW'
                      );
                    }
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <RotateCcw size={14} /> Rotate 90° CCW
                </button>
                <button
                  onClick={() => {
                    if (selectedLayer) {
                      updateLayer(
                        selectedLayer.id,
                        { flipH: !selectedLayer.flipH },
                        true,
                        'Flip Horizontal'
                      );
                    }
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <FlipHorizontal size={14} /> Flip Horizontal
                </button>
                <button
                  onClick={() => {
                    if (selectedLayer) {
                      updateLayer(
                        selectedLayer.id,
                        { flipV: !selectedLayer.flipV },
                        true,
                        'Flip Vertical'
                      );
                    }
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white flex items-center gap-2"
                >
                  <FlipVertical size={14} /> Flip Vertical
                </button>
              </div>
            )}
          </div>

          {/* Layer Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'layer' ? null : 'layer')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeMenu === 'layer' ? 'bg-[#383838] text-white' : 'hover:bg-[#303030]'
              }`}
            >
              Layer
            </button>
            {activeMenu === 'layer' && (
              <div className="absolute left-0 top-full mt-1 w-52 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-xl py-1 text-[12px] z-50">
                <button
                  onClick={() => {
                    addLayer('paint');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  New Paint Layer
                </button>
                <button
                  onClick={() => {
                    addLayer('text');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  New Text Layer
                </button>
                <button
                  onClick={() => {
                    addLayer('shape');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  New Shape Layer
                </button>
                <button
                  onClick={() => {
                    if (selectedLayerId) duplicateLayer(selectedLayerId);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  Duplicate Layer
                </button>
                <button
                  onClick={() => {
                    if (selectedLayerId) deleteLayer(selectedLayerId);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white text-rose-400"
                >
                  Delete Layer
                </button>
                <div className="my-1 border-t border-[#3a3a3a]" />
                <button
                  onClick={() => {
                    if (selectedLayerId) mergeDown(selectedLayerId);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  Merge Down
                </button>
                <button
                  onClick={() => {
                    flattenProject();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  Flatten Image
                </button>
              </div>
            )}
          </div>

          {/* Filter Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'filter' ? null : 'filter')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeMenu === 'filter' ? 'bg-[#383838] text-white' : 'hover:bg-[#303030]'
              }`}
            >
              Filter
            </button>
            {activeMenu === 'filter' && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-xl py-1 text-[12px] z-50">
                <button
                  onClick={() => {
                    setActiveSidebarTab('filters');
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white font-medium text-[#1685ff]"
                >
                  Open Filter Gallery...
                </button>
                <div className="my-1 border-t border-[#3a3a3a]" />
                <button
                  onClick={() => {
                    if (selectedLayer) {
                      updateLayer(
                        selectedLayer.id,
                        {
                          adjustments: {
                            ...selectedLayer.adjustments,
                            blur: (selectedLayer.adjustments.blur || 0) + 4,
                          },
                        },
                        true,
                        'Gaussian Blur'
                      );
                    }
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  Blur (+4px)
                </button>
                <button
                  onClick={() => {
                    if (selectedLayer) {
                      updateLayer(
                        selectedLayer.id,
                        {
                          adjustments: {
                            ...selectedLayer.adjustments,
                            sharpness: Math.min(
                              100,
                              (selectedLayer.adjustments.sharpness || 0) + 25
                            ),
                          },
                        },
                        true,
                        'Sharpen'
                      );
                    }
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  Sharpen
                </button>
                <button
                  onClick={() => {
                    if (selectedLayer) {
                      updateLayer(
                        selectedLayer.id,
                        {
                          adjustments: {
                            ...selectedLayer.adjustments,
                            grayscale: selectedLayer.adjustments.grayscale > 0 ? 0 : 100,
                          },
                        },
                        true,
                        'Black & White'
                      );
                    }
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  Black & White
                </button>
                <button
                  onClick={() => {
                    if (selectedLayer) {
                      updateLayer(
                        selectedLayer.id,
                        {
                          adjustments: {
                            ...selectedLayer.adjustments,
                            invert: selectedLayer.adjustments.invert > 0 ? 0 : 100,
                          },
                        },
                        true,
                        'Invert Colors'
                      );
                    }
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  Invert
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              className={`px-2.5 py-1 rounded transition-colors ${
                activeMenu === 'view' ? 'bg-[#383838] text-white' : 'hover:bg-[#303030]'
              }`}
            >
              View
            </button>
            {activeMenu === 'view' && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-[#2a2a2a] border border-[#3a3a3a] rounded-md shadow-xl py-1 text-[12px] z-50">
                <button
                  onClick={() => {
                    fitToScreen();
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  Fit on Screen (0)
                </button>
                <button
                  onClick={() => {
                    zoomTo(100);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  100% Actual Size
                </button>
                <button
                  onClick={() => {
                    zoomTo(200);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  200% Zoom
                </button>
                <button
                  onClick={() => {
                    zoomTo(50);
                    setActiveMenu(null);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-[#1685ff] hover:text-white"
                >
                  50% Zoom
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Center: Quick Undo/Redo & Zoom selector */}
      <div className="flex items-center gap-2">
        <button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-1 rounded text-neutral-300 hover:text-white hover:bg-[#303030] disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-1 rounded text-neutral-300 hover:text-white hover:bg-[#303030] disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={15} />
        </button>

        <div className="h-4 w-[1px] bg-[#3a3a3a] mx-1" />

        {/* Zoom Selector */}
        <div className="flex items-center bg-[#1e1e1e] border border-[#3a3a3a] rounded px-1.5 py-0.5">
          <button
            onClick={() => setZoom((z) => Math.max(0.1, z - 0.25))}
            className="text-neutral-400 hover:text-white px-1 text-xs"
            title="Zoom Out"
          >
            -
          </button>
          <span
            onClick={fitToScreen}
            className="text-[11px] font-mono font-medium text-neutral-200 px-1 cursor-pointer hover:text-[#1685ff]"
            title="Click to Fit to Screen"
          >
            {zoomPercent}%
          </span>
          <button
            onClick={() => setZoom((z) => Math.min(10, z + 0.25))}
            className="text-neutral-400 hover:text-white px-1 text-xs"
            title="Zoom In"
          >
            +
          </button>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Open in Desktop App */}
        <button
          onClick={() => setShowDesktopModal(true)}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-neutral-300 hover:text-white hover:bg-[#303030] rounded border border-transparent hover:border-[#3a3a3a] transition-colors"
          title="Install / Open in Desktop App"
        >
          <MonitorDown size={14} />
          <span className="text-[11px]">Desktop App</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-1 px-2.5 py-1 text-neutral-300 hover:text-white hover:bg-[#303030] rounded border border-[#3a3a3a] transition-colors"
          title="Share Project"
        >
          <Share2 size={13} />
          <span className="hidden sm:inline text-[11px]">Share</span>
        </button>

        {/* Download / Export Button */}
        <button
          onClick={() => setShowExportModal(true)}
          className="flex items-center gap-1.5 px-3 py-1 bg-[#1685ff] hover:bg-[#0070eb] text-white font-medium rounded shadow-sm transition-colors text-[11px]"
        >
          <Download size={13} />
          <span>Export</span>
        </button>

        {/* User Profile Avatar / Sign-in */}
        <div
          onClick={() => setShowProfileModal(true)}
          className="w-7 h-7 rounded-full overflow-hidden ml-1 shadow-inner ring-1 ring-white/20 border border-white/20 cursor-pointer hover:ring-2 hover:ring-[#1685ff] transition-all shrink-0 bg-[#161616]"
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
