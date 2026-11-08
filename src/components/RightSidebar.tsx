import React, { useState } from 'react';
import {
  Layers,
  Sliders,
  Sparkles,
  History,
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  Wand2,
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { LayersPanel } from './panels/LayersPanel';
import { PropertiesPanel } from './panels/PropertiesPanel';
import { AdjustmentsPanel } from './panels/AdjustmentsPanel';
import { HistoryPanel } from './panels/HistoryPanel';
import { FilterGallery } from './panels/FilterGallery';
import { BlurPanel } from './panels/BlurPanel';

export const RightSidebar: React.FC = () => {
  const { activeSidebarTab, setActiveSidebarTab } = useEditor();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const TABS = [
    { id: 'layers', label: 'Layers', icon: Layers },
    { id: 'properties', label: 'Properties', icon: SlidersHorizontal },
    { id: 'adjustments', label: 'Adjust', icon: Sliders },
    { id: 'blur', label: 'Blur Tools', icon: Wand2 },
    { id: 'filters', label: 'Filters', icon: Sparkles },
    { id: 'history', label: 'History', icon: History },
  ] as const;

  return (
    <aside
      className={`bg-[#242424] border-l border-[#3a3a3a] flex flex-col z-20 select-none transition-all duration-150 ${
        isCollapsed ? 'w-10' : 'w-72 lg:w-80'
      }`}
    >
      {/* Tab Navigation Header */}
      <div className="h-9 bg-[#202020] border-b border-[#3a3a3a] flex items-center justify-between px-1">
        {!isCollapsed && (
          <div className="flex items-center gap-0.5 overflow-x-auto whitespace-nowrap flex-1 scrollbar-none">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSidebarTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSidebarTab(tab.id as any)}
                  className={`px-2 py-1 rounded text-[10px] font-medium flex items-center gap-1 transition-colors ${
                    isActive
                      ? 'bg-[#2e2e2e] text-white border-b-2 border-[#1685ff]'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-[#282828]'
                  }`}
                >
                  <Icon size={11} className={isActive ? 'text-[#1685ff]' : ''} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Collapse toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-[#333] hover:text-white rounded text-neutral-400 transition-colors ml-auto shrink-0"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
        </button>
      </div>

      {/* Main Panel Body */}
      {isCollapsed ? (
        <div className="flex flex-col items-center py-3 gap-3">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSidebarTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveSidebarTab(tab.id as any);
                  setIsCollapsed(false);
                }}
                className={`p-2 rounded hover:bg-[#333] transition-colors ${
                  isActive ? 'text-[#1685ff] bg-[#303030]' : 'text-neutral-400'
                }`}
                title={tab.label}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      ) : (
        <div className="flex-1 overflow-hidden bg-[#242424]">
          {activeSidebarTab === 'layers' && <LayersPanel />}
          {activeSidebarTab === 'properties' && <PropertiesPanel />}
          {activeSidebarTab === 'adjustments' && <AdjustmentsPanel />}
          {activeSidebarTab === 'blur' && <BlurPanel />}
          {activeSidebarTab === 'filters' && <FilterGallery />}
          {activeSidebarTab === 'history' && <HistoryPanel />}
        </div>
      )}
    </aside>
  );
};
