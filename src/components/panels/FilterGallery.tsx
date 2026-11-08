import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { FILTER_PRESETS } from '../../utils/imageProcessing';

const CATEGORIES = [
  'All',
  'Cinematic',
  'Vintage',
  'Portrait',
  'Landscape',
  'Black & White',
  'Warm & Cool',
  'Artistic',
];

export const FilterGallery: React.FC = () => {
  const { selectedLayer, applyFilterPreset } = useEditor();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filtered =
    selectedCategory === 'All'
      ? FILTER_PRESETS
      : FILTER_PRESETS.filter((f) => f.category === selectedCategory);

  return (
    <div className="flex flex-col h-full text-xs text-[#e0e0e0]">
      {/* Category selector */}
      <div className="p-2 border-b border-[#3a3a3a] bg-[#222222] flex items-center gap-1 overflow-x-auto whitespace-nowrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-2 py-0.5 rounded text-[11px] transition-colors shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#1685ff] text-white font-medium'
                : 'text-neutral-400 hover:text-white hover:bg-[#333]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Filter Presets Grid */}
      <div className="flex-1 overflow-y-auto p-2.5 grid grid-cols-2 gap-2">
        {filtered.map((preset) => {
          const isApplied = selectedLayer?.filter === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => applyFilterPreset(preset.id)}
              className={`group flex flex-col p-2 rounded-lg cursor-pointer transition-all border text-left ${
                isApplied
                  ? 'bg-[#1685ff]/20 border-[#1685ff] ring-1 ring-[#1685ff]'
                  : 'bg-[#292929] border-[#3a3a3a] hover:border-neutral-500 hover:bg-[#303030]'
              }`}
            >
              {/* Filter color preview swatch gradient */}
              <div
                className="w-full h-14 rounded-md mb-2 overflow-hidden relative shadow-inner border border-white/10"
                style={{
                  background:
                    preset.id === 'cinematic_teal_orange'
                      ? 'linear-gradient(135deg, #0f3443 0%, #34e89e 50%, #f77737 100%)'
                      : preset.id === 'cinematic_cyberpunk'
                      ? 'linear-gradient(135deg, #05051a 0%, #00f2fe 50%, #fe0979 100%)'
                      : preset.id === 'vintage_sepia_1970'
                      ? 'linear-gradient(135deg, #704214 0%, #c49a45 60%, #faebd7 100%)'
                      : preset.id.includes('bw')
                      ? 'linear-gradient(135deg, #111111 0%, #888888 60%, #eeeeee 100%)'
                      : preset.id === 'artistic_duotone_neon'
                      ? 'linear-gradient(135deg, #0052d4 0%, #4364f7 50%, #6fb1fc 100%)'
                      : preset.id === 'wc_golden_amber'
                      ? 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)'
                      : preset.id === 'landscape_sunset'
                      ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
                      : 'linear-gradient(135deg, #2b5876 0%, #4e4376 100%)',
                }}
              >
                {isApplied && (
                  <div className="absolute top-1 right-1 w-4 h-4 bg-[#1685ff] text-white rounded-full flex items-center justify-center shadow">
                    <Check size={10} />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-200 text-xs truncate">
                  {preset.name}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 mt-0.5">
                {preset.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
