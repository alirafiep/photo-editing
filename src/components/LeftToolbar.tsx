import React from 'react';
import {
  Move,
  Scan,
  Crop,
  Lasso,
  Paintbrush,
  Eraser,
  Type,
  Square,
  Sparkles,
  Pipette,
  Hand,
  ZoomIn,
  ArrowRightLeft,
  RotateCcw,
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { ToolType } from '../types/editor';

interface ToolItem {
  id: ToolType;
  label: string;
  shortcut: string;
  icon: React.FC<{ size?: number; className?: string }>;
}

const TOOLS: ToolItem[] = [
  { id: 'move', label: 'Move Tool', shortcut: 'V', icon: Move },
  { id: 'select', label: 'Marquee Selection Tool', shortcut: 'M', icon: Scan },
  { id: 'crop', label: 'Crop Tool', shortcut: 'C', icon: Crop },
  { id: 'lasso', label: 'Lasso Selection Tool', shortcut: 'L', icon: Lasso },
  { id: 'brush', label: 'Brush Tool', shortcut: 'B', icon: Paintbrush },
  { id: 'eraser', label: 'Eraser Tool', shortcut: 'E', icon: Eraser },
  { id: 'text', label: 'Horizontal Type Tool', shortcut: 'T', icon: Type },
  { id: 'shape', label: 'Rectangle / Shape Tool', shortcut: 'U', icon: Square },
  { id: 'gradient', label: 'Gradient Tool', shortcut: 'G', icon: Sparkles },
  { id: 'eyedropper', label: 'Eyedropper Tool', shortcut: 'I', icon: Pipette },
  { id: 'hand', label: 'Hand Tool', shortcut: 'H', icon: Hand },
  { id: 'zoom', label: 'Zoom Tool', shortcut: 'Z', icon: ZoomIn },
];

export const LeftToolbar: React.FC = () => {
  const {
    activeTool,
    setActiveTool,
    fgColor,
    bgColor,
    swapColors,
    resetColors,
    setShowColorPickerModal,
    setColorPickerTarget,
  } = useEditor();

  return (
    <aside className="w-12 bg-[#242424] border-r border-[#3a3a3a] flex flex-col items-center py-2 justify-between z-20 select-none shrink-0">
      {/* Tool Buttons */}
      <div className="flex flex-col items-center gap-1 w-full px-1">
        {TOOLS.map((tool) => {
          const Icon = tool.icon;
          const isActive = activeTool === tool.id;
          return (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-9 h-9 flex items-center justify-center rounded transition-all group relative ${
                isActive
                  ? 'bg-[#1685ff] text-white shadow-sm ring-1 ring-white/20'
                  : 'text-neutral-300 hover:text-white hover:bg-[#303030]'
              }`}
              title={`${tool.label} (${tool.shortcut})`}
            >
              <Icon size={17} />

              {/* Tooltip on hover */}
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#1a1a1a] text-white text-[11px] rounded shadow-lg border border-[#3a3a3a] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap flex items-center gap-1.5">
                <span>{tool.label}</span>
                <span className="text-[10px] bg-[#333333] px-1 rounded text-[#1685ff] font-mono">
                  {tool.shortcut}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Photoshop Foreground / Background Color Swatches */}
      <div className="flex flex-col items-center gap-1.5 pb-2">
        <div className="relative w-9 h-9">
          {/* Background swatch (behind) */}
          <div
            onClick={() => {
              setColorPickerTarget('bg');
              setShowColorPickerModal(true);
            }}
            className="absolute right-0.5 bottom-0.5 w-5 h-5 rounded border border-[#444] cursor-pointer shadow-sm hover:scale-105 transition-transform"
            style={{ backgroundColor: bgColor }}
            title="Set Background Color"
          />

          {/* Foreground swatch (front) */}
          <div
            onClick={() => {
              setColorPickerTarget('fg');
              setShowColorPickerModal(true);
            }}
            className="absolute left-0.5 top-0.5 w-5 h-5 rounded border border-white/40 cursor-pointer shadow-md hover:scale-105 transition-transform z-10"
            style={{ backgroundColor: fgColor }}
            title="Set Foreground Color"
          />
        </div>

        {/* Small Swap & Reset Color Buttons */}
        <div className="flex items-center gap-1 text-neutral-400">
          <button
            onClick={swapColors}
            className="p-1 hover:text-white hover:bg-[#303030] rounded transition-colors"
            title="Switch Foreground/Background Colors (X)"
          >
            <ArrowRightLeft size={11} />
          </button>
          <button
            onClick={resetColors}
            className="p-1 hover:text-white hover:bg-[#303030] rounded transition-colors"
            title="Default Foreground/Background Colors (D)"
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>
    </aside>
  );
};
