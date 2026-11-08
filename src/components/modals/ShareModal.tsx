import React, { useState } from 'react';
import { X, Share2, Copy, Check, Globe } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const ShareModal: React.FC = () => {
  const { showShareModal, setShowShareModal, activeProject, showToast } = useEditor();
  const [copied, setCopied] = useState(false);

  if (!showShareModal || !activeProject) return null;

  const shareUrl = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    showToast('Studio link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#242424] border border-[#3a3a3a] rounded-xl shadow-2xl overflow-hidden text-[#e0e0e0]">
        <div className="h-11 px-4 bg-[#202020] border-b border-[#3a3a3a] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 size={15} className="text-[#1685ff]" />
            <span className="font-bold text-white text-xs">Share Photo Project</span>
          </div>
          <button
            onClick={() => setShowShareModal(false)}
            className="p-1 rounded hover:bg-[#333] hover:text-white text-neutral-400"
          >
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs">
          <div>
            <span className="font-medium text-white">{activeProject.name}</span>
            <p className="text-neutral-400 mt-0.5">
              Share your project workspace with team members or open on another device.
            </p>
          </div>

          <div className="flex items-center bg-[#1c1c1c] border border-[#3a3a3a] rounded-lg p-1.5 gap-2">
            <Globe size={14} className="text-neutral-400 ml-1.5 shrink-0" />
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="w-full bg-transparent text-neutral-200 outline-none text-xs font-mono select-all"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1 bg-[#1685ff] hover:bg-[#0070eb] text-white rounded text-xs font-medium shrink-0 transition-colors"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#3a3a3a] flex justify-end">
            <button
              onClick={() => setShowShareModal(false)}
              className="px-4 py-1.5 bg-[#333] hover:bg-[#404040] text-neutral-300 rounded text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
