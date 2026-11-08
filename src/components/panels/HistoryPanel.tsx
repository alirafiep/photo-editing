import React from 'react';
import { Undo2, Redo2, History as HistoryIcon, Clock } from 'lucide-react';
import { useEditor } from '../../context/EditorContext';

export const HistoryPanel: React.FC = () => {
  const { history, historyIndex, jumpToHistory, undo, redo } = useEditor();

  return (
    <div className="flex flex-col h-full text-xs text-[#e0e0e0]">
      {/* Header with Undo / Redo controls */}
      <div className="p-2 border-b border-[#3a3a3a] bg-[#222222] flex items-center justify-between">
        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
          <HistoryIcon size={13} />
          <span>Action History</span>
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            className="p-1 hover:bg-[#333] hover:text-white rounded disabled:opacity-30 text-neutral-300"
            title="Step Backward (Ctrl+Z)"
          >
            <Undo2 size={13} />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            className="p-1 hover:bg-[#333] hover:text-white rounded disabled:opacity-30 text-neutral-300"
            title="Step Forward (Ctrl+Y)"
          >
            <Redo2 size={13} />
          </button>
        </div>
      </div>

      {/* History Steps List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
        {history.map((item, index) => {
          const isCurrent = index === historyIndex;
          const isFuture = index > historyIndex;

          return (
            <div
              key={item.id}
              onClick={() => jumpToHistory(index)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors text-xs ${
                isCurrent
                  ? 'bg-[#1685ff] text-white font-medium shadow-sm'
                  : isFuture
                  ? 'text-neutral-500 hover:bg-[#282828] hover:text-neutral-300 opacity-60'
                  : 'text-neutral-300 hover:bg-[#2e2e2e] hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isCurrent ? 'bg-white' : isFuture ? 'bg-neutral-600' : 'bg-[#1685ff]'
                  }`}
                />
                <span className="truncate">{item.description}</span>
              </div>
              <span className="text-[10px] font-mono opacity-50 shrink-0 ml-2">
                #{index + 1}
              </span>
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-[#3a3a3a] bg-[#222222] text-[10px] text-neutral-500 text-center">
        Click any action above to restore that document state.
      </div>
    </div>
  );
};
