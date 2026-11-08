import React from 'react';
import { X, MonitorDown, Laptop, ShieldCheck, Zap, HardDrive } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const DesktopAppModal: React.FC = () => {
  const { showDesktopModal, setShowDesktopModal } = useEditor();

  if (!showDesktopModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#242424] border border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden text-[#e0e0e0]">
        <div className="h-11 px-4 bg-[#202020] border-b border-[#3a3a3a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MonitorDown size={15} className="text-[#1685ff]" />
            <span className="font-bold text-white text-xs">SNAPEDIT Desktop Experience</span>
          </div>
          <button
            onClick={() => setShowDesktopModal(false)}
            className="p-1 rounded hover:bg-[#333] hover:text-white text-neutral-400"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div className="flex items-center gap-3 p-3 bg-[#1e1e1e] rounded-lg border border-[#3a3a3a]">
            <div className="w-10 h-10 rounded-lg bg-[#1685ff] flex items-center justify-center font-bold text-white text-sm shrink-0">
              Se
            </div>
            <div>
              <div className="font-bold text-white">Install SNAPEDIT as App</div>
              <div className="text-[11px] text-neutral-400">
                Run standalone with full hardware acceleration and zero browser tabs.
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex items-start gap-2.5">
              <Zap size={14} className="text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-white">Full Keyboard Interception:</span>
                <span className="text-neutral-400 ml-1">
                  Enjoy shortcuts like Ctrl+S, Ctrl+W, and Spacebar navigation without browser collision.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <HardDrive size={14} className="text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-white">Local IndexedDB Storage:</span>
                <span className="text-neutral-400 ml-1">
                  All layers, adjustments, and projects are securely cached on your disk.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Laptop size={14} className="text-sky-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-white">Installation Step:</span>
                <span className="text-neutral-400 ml-1">
                  Click the install icon in your browser address bar (or Menu → "Install SNAPEDIT" / "Add to Desktop").
                </span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#3a3a3a] flex justify-end">
            <button
              onClick={() => setShowDesktopModal(false)}
              className="px-4 py-2 bg-[#1685ff] hover:bg-[#0070eb] text-white font-medium rounded text-xs transition-colors"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
