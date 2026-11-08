import React, { useState, useEffect, useRef } from 'react';
import { X, Search, Upload, Check, Type, Sparkles } from 'lucide-react';
import { getAllAvailableFonts, importCustomFontFile, FontItem } from '../../utils/fontManager';
import { useEditor } from '../../context/EditorContext';

interface FontLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFont: (fontFamily: string) => void;
  currentFont: string;
}

export const FontLibraryModal: React.FC<FontLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectFont,
  currentFont,
}) => {
  const { showToast } = useEditor();
  const [fonts, setFonts] = useState<FontItem[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [previewText, setPreviewText] = useState('Sphinx of black quartz, judge my vow');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFonts(getAllAvailableFonts());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFontUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imported = await importCustomFontFile(file);
      setFonts(getAllAvailableFonts());
      onSelectFont(imported.name);
      showToast(`Imported & applied font: "${imported.name}"`);
    } catch (err: any) {
      console.error(err);
      showToast('Failed to load font file. Please verify TTF/OTF format.');
    }
  };

  const filteredFonts = fonts.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === 'all' || f.category === category || (category === 'custom' && f.isCustom);
    return matchesSearch && matchesCat;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-3xl bg-[#222222] border border-[#383838] rounded-2xl shadow-2xl overflow-hidden flex flex-col text-[#e0e0e0] max-h-[85vh]">
        {/* Header */}
        <div className="h-12 px-5 bg-[#1b1b1b] border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Type size={16} className="text-[#1685ff]" />
            <span className="font-bold text-white text-sm">Professional Font Library</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-[#333] hover:text-white text-neutral-400"
          >
            <X size={16} />
          </button>
        </div>

        {/* Toolbar: Search, Category, Import Button */}
        <div className="p-4 bg-[#1e1e1e] border-b border-[#333] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center bg-[#181818] border border-[#383838] rounded-lg px-2.5 py-1.5 w-64 text-xs">
            <Search size={14} className="text-neutral-400 mr-2 shrink-0" />
            <input
              type="text"
              placeholder="Search fonts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-white outline-none placeholder:text-neutral-500"
            />
          </div>

          <div className="flex items-center gap-1 overflow-x-auto text-xs">
            {['all', 'sans-serif', 'serif', 'display', 'handwriting', 'monospace', 'custom'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                    category === cat
                      ? 'bg-[#1685ff] text-white font-medium'
                      : 'text-neutral-400 hover:text-white hover:bg-[#282828]'
                  }`}
                >
                  {cat === 'all' ? 'All Fonts' : cat}
                </button>
              )
            )}
          </div>

          {/* Import External Font File Button */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFontUpload}
            accept=".ttf,.otf,.woff2"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2a2a2a] hover:bg-[#353535] text-white border border-[#444] rounded-lg text-xs font-semibold shadow-sm transition-colors"
          >
            <Upload size={13} className="text-[#1685ff]" />
            <span>Import Font (TTF/OTF)</span>
          </button>
        </div>

        {/* Font Cards Grid */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {filteredFonts.length === 0 ? (
            <div className="text-center py-10 text-neutral-500 text-xs">
              No matching fonts found. Try importing a custom font file.
            </div>
          ) : (
            filteredFonts.map((font) => {
              const isSelected = currentFont.toLowerCase() === font.name.toLowerCase();
              return (
                <div
                  key={font.name}
                  onClick={() => {
                    onSelectFont(font.name);
                    onClose();
                  }}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#1685ff]/20 border-[#1685ff] shadow-md'
                      : 'bg-[#1a1a1a] border-[#333] hover:bg-[#252525] hover:border-neutral-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs">{font.name}</span>
                      {font.isCustom && (
                        <span className="px-1.5 py-0.2 bg-indigo-900/60 text-indigo-300 text-[9px] rounded uppercase font-bold">
                          Imported
                        </span>
                      )}
                    </div>
                    {isSelected && <Check size={14} className="text-[#1685ff]" />}
                  </div>

                  {/* Live Rendered Font Preview */}
                  <div
                    style={{ fontFamily: font.name }}
                    className="text-xl text-neutral-200 truncate py-1"
                  >
                    {previewText}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
