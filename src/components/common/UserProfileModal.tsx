import React, { useState, useRef } from 'react';
import { Camera, Check, RotateCcw, Upload, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SNAPEDIT_LOGO_SRC, SnapEditLogo } from './SnapEditLogo';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfilePicture, updateProfileName, signInWithGoogle, signOut } = useAuth();
  const [name, setName] = useState(user.name);
  const [isSaved, setIsSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateProfilePicture(reader.result);
          setIsSaved(true);
          setTimeout(() => setIsSaved(false), 2000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateProfileName(name.trim());
      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-[#222] border border-[#3a3a3a] rounded-2xl p-6 text-[#e0e0e0] shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#333] transition-colors"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <SnapEditLogo size="sm" showText showTagline className="justify-center mb-2" />
          <h2 className="text-xl font-bold text-white mt-1">Creator Profile</h2>
          <p className="text-xs text-neutral-400">
            Customize your studio profile avatar and workspace identity
          </p>
        </div>

        {/* Circular Avatar with change button */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#1685ff]/30 shadow-xl border border-white/10 bg-[#161616]">
              <img
                src={user.photoUrl || SNAPEDIT_LOGO_SRC}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 rounded-full bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white text-[11px] font-semibold transition-opacity gap-1 cursor-pointer"
            >
              <Camera size={20} />
              <span>Change</span>
            </button>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="hidden"
          />

          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1 bg-[#2e2e2e] hover:bg-[#383838] border border-[#404040] text-neutral-200 text-xs rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Upload size={12} />
              <span>Upload Custom Photo</span>
            </button>
            <button
              type="button"
              onClick={() => updateProfilePicture(SNAPEDIT_LOGO_SRC)}
              className="px-2.5 py-1 bg-[#242424] hover:bg-[#2e2e2e] border border-[#383838] text-neutral-400 hover:text-white text-xs rounded-lg flex items-center gap-1 transition-colors"
              title="Reset to SNAPEDIT Aperture Icon"
            >
              <RotateCcw size={12} />
              <span>Default</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 bg-[#191919] border border-[#383838] focus:border-[#1685ff] rounded-xl text-white text-sm outline-none transition-colors"
              placeholder="Your Name or Studio handle"
              maxLength={40}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Account Status
            </label>
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#1a1a1a] border border-[#333] rounded-xl text-xs">
              <span className="text-neutral-300">
                {user.isGuest ? 'Guest Access (IndexedDB Storage)' : 'Signed in with Google'}
              </span>
              {user.isGuest ? (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="text-xs text-[#1685ff] hover:underline font-semibold"
                >
                  Link Google
                </button>
              ) : (
                <button
                  type="button"
                  onClick={signOut}
                  className="text-xs text-rose-400 hover:underline font-semibold"
                >
                  Sign Out
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#333]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#2d2d2d] hover:bg-[#383838] text-neutral-300 rounded-xl text-xs font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#1685ff] hover:bg-[#0070eb] text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg"
            >
              {isSaved ? <Check size={14} /> : null}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
