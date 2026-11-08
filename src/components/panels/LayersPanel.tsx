import React, { useState } from 'react';
import {
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Layers,
  Image as ImageIcon,
  Type,
  Square,
  Paintbrush,
  Combine,
  MoreVertical,
} from 'lucide-react';
import { useEditor } from '../../context/EditorContext';
import { BlendMode } from '../../types/editor';

const BLEND_MODES: { value: BlendMode; label: string }[] = [
  { value: 'source-over', label: 'Normal' },
  { value: 'multiply', label: 'Multiply' },
  { value: 'screen', label: 'Screen' },
  { value: 'overlay', label: 'Overlay' },
  { value: 'darken', label: 'Darken' },
  { value: 'lighten', label: 'Lighten' },
  { value: 'color-dodge', label: 'Color Dodge' },
  { value: 'color-burn', label: 'Color Burn' },
  { value: 'hard-light', label: 'Hard Light' },
  { value: 'soft-light', label: 'Soft Light' },
  { value: 'difference', label: 'Difference' },
  { value: 'exclusion', label: 'Exclusion' },
];

export const LayersPanel: React.FC = () => {
  const {
    activeProject,
    selectedLayerId,
    setSelectedLayerId,
    selectedLayer,
    updateLayer,
    addLayer,
    duplicateLayer,
    deleteLayer,
    reorderLayers,
    mergeDown,
    flattenProject,
    toggleLayerVisibility,
    toggleLayerLock,
    showToast,
  } = useEditor();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [layerToDelete, setLayerToDelete] = useState<string | null>(null);

  if (!activeProject) return null;

  // Layers are rendered in stack order: highest in stack is rendered on top
  // In Photoshop UI, the top of the list is the top layer (end of array)
  const displayLayers = [...activeProject.layers].reverse();

  const handleStartRename = (id: string, name: string) => {
    setEditingId(id);
    setEditingName(name);
  };

  const handleFinishRename = (id: string) => {
    if (editingName.trim()) {
      updateLayer(id, { name: editingName.trim() }, true, 'Rename Layer');
    }
    setEditingId(null);
  };

  const moveLayerUp = (id: string) => {
    const idx = activeProject.layers.findIndex((l) => l.id === id);
    if (idx < activeProject.layers.length - 1) {
      reorderLayers(idx, idx + 1);
    }
  };

  const moveLayerDown = (id: string) => {
    const idx = activeProject.layers.findIndex((l) => l.id === id);
    if (idx > 0) {
      reorderLayers(idx, idx - 1);
    }
  };

  const confirmDelete = (id: string) => {
    if (activeProject.layers.length <= 1) {
      showToast('Cannot delete the last layer');
      return;
    }
    setLayerToDelete(id);
  };

  return (
    <div className="flex flex-col h-full text-xs text-[#e0e0e0]">
      {/* Blend Mode & Opacity Header Bar */}
      <div className="p-2 border-b border-[#3a3a3a] bg-[#222222] flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 flex-1">
          <select
            value={selectedLayer?.blendMode || 'source-over'}
            disabled={!selectedLayer || selectedLayer.locked}
            onChange={(e) =>
              selectedLayer &&
              updateLayer(
                selectedLayer.id,
                { blendMode: e.target.value as BlendMode },
                true,
                'Change Blend Mode'
              )
            }
            className="w-full bg-[#1c1c1c] border border-[#3a3a3a] text-neutral-200 rounded px-2 py-1 outline-none text-[11px] disabled:opacity-40"
          >
            {BLEND_MODES.map((bm) => (
              <option key={bm.value} value={bm.value}>
                {bm.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 w-28">
          <span className="text-[10px] text-neutral-400">Opacity:</span>
          <input
            type="number"
            min="0"
            max="100"
            disabled={!selectedLayer || selectedLayer.locked}
            value={selectedLayer ? Math.round(selectedLayer.opacity * 100) : 100}
            onChange={(e) => {
              if (selectedLayer) {
                const val = Math.max(0, Math.min(100, parseInt(e.target.value) || 0));
                updateLayer(selectedLayer.id, { opacity: val / 100 });
              }
            }}
            className="w-12 bg-[#1c1c1c] border border-[#3a3a3a] rounded px-1 py-0.5 text-center font-mono text-[11px] outline-none disabled:opacity-40"
          />
          <span className="text-[10px] text-neutral-400">%</span>
        </div>
      </div>

      {/* Layer Stack List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
        {displayLayers.map((layer) => {
          const isSelected = layer.id === selectedLayerId;
          const originalIndex = activeProject.layers.findIndex((l) => l.id === layer.id);

          return (
            <div
              key={layer.id}
              onClick={() => setSelectedLayerId(layer.id)}
              onDoubleClick={() => handleStartRename(layer.id, layer.name)}
              className={`group flex items-center justify-between p-1.5 rounded transition-colors cursor-pointer border ${
                isSelected
                  ? 'bg-[#1685ff]/20 border-[#1685ff] text-white shadow-sm'
                  : 'bg-[#292929] border-transparent hover:bg-[#303030] text-neutral-300'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {/* Visibility Eye Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerVisibility(layer.id);
                  }}
                  className={`p-1 rounded hover:bg-[#3e3e3e] transition-colors ${
                    layer.visible ? 'text-neutral-200' : 'text-neutral-600'
                  }`}
                  title={layer.visible ? 'Hide Layer' : 'Show Layer'}
                >
                  {layer.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>

                {/* Layer Thumbnail & Type Icon */}
                <div className="w-8 h-8 rounded bg-[#1e1e1e] border border-[#3a3a3a] flex items-center justify-center shrink-0 overflow-hidden relative">
                  {layer.dataUrl ? (
                    <img
                      src={layer.dataUrl}
                      alt=""
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : layer.type === 'text' ? (
                    <Type size={14} className="text-sky-400" />
                  ) : layer.type === 'shape' ? (
                    <Square size={14} className="text-emerald-400" />
                  ) : (
                    <Paintbrush size={14} className="text-amber-400" />
                  )}
                </div>

                {/* Layer Name or Edit input */}
                {editingId === layer.id ? (
                  <input
                    type="text"
                    value={editingName}
                    autoFocus
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={() => handleFinishRename(layer.id)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleFinishRename(layer.id);
                      if (e.key === 'Escape') setEditingId(null);
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-[#1a1a1a] border border-[#1685ff] text-white rounded px-1.5 py-0.5 text-xs outline-none w-full"
                  />
                ) : (
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="truncate text-xs font-medium" title={layer.name}>
                      {layer.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 capitalize">
                      {layer.type} · {Math.round(layer.opacity * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Quick Actions (Lock, Order, Delete) */}
              <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLayerLock(layer.id);
                  }}
                  className={`p-1 rounded hover:bg-[#3e3e3e] transition-colors ${
                    layer.locked ? 'text-amber-400' : 'text-neutral-500 hover:text-neutral-300'
                  }`}
                  title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                >
                  {layer.locked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayerUp(layer.id);
                  }}
                  disabled={originalIndex === activeProject.layers.length - 1}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#3e3e3e] disabled:opacity-20"
                  title="Bring Forward"
                >
                  <ChevronUp size={12} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    moveLayerDown(layer.id);
                  }}
                  disabled={originalIndex === 0}
                  className="p-1 rounded text-neutral-400 hover:text-white hover:bg-[#3e3e3e] disabled:opacity-20"
                  title="Send Backward"
                >
                  <ChevronDown size={12} />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(layer.id);
                  }}
                  className="p-1 rounded text-neutral-500 hover:text-rose-400 hover:bg-[#3e3e3e]"
                  title="Delete Layer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Banner */}
      {layerToDelete && (
        <div className="p-2 bg-rose-950/80 border-t border-rose-800 text-[11px] flex items-center justify-between">
          <span className="text-rose-200">Delete selected layer?</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                deleteLayer(layerToDelete);
                setLayerToDelete(null);
              }}
              className="px-2 py-0.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium"
            >
              Delete
            </button>
            <button
              onClick={() => setLayerToDelete(null)}
              className="px-2 py-0.5 bg-[#3a3a3a] text-neutral-300 rounded"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Layers Panel Bottom Action Bar */}
      <div className="p-2 border-t border-[#3a3a3a] bg-[#222222] flex items-center justify-between text-neutral-300">
        <div className="flex items-center gap-1">
          <button
            onClick={() => addLayer('paint')}
            className="p-1.5 hover:text-white hover:bg-[#333] rounded transition-colors"
            title="Create New Layer"
          >
            <Plus size={15} />
          </button>
          <button
            onClick={() => selectedLayerId && duplicateLayer(selectedLayerId)}
            disabled={!selectedLayerId}
            className="p-1.5 hover:text-white hover:bg-[#333] rounded transition-colors disabled:opacity-30"
            title="Duplicate Layer"
          >
            <Copy size={14} />
          </button>
          <button
            onClick={() => selectedLayerId && confirmDelete(selectedLayerId)}
            disabled={!selectedLayerId || activeProject.layers.length <= 1}
            className="p-1.5 hover:text-rose-400 hover:bg-[#333] rounded transition-colors disabled:opacity-30"
            title="Delete Layer"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => selectedLayerId && mergeDown(selectedLayerId)}
            disabled={!selectedLayerId || activeProject.layers.length <= 1}
            className="p-1.5 hover:text-white hover:bg-[#333] rounded transition-colors disabled:opacity-30"
            title="Merge Down"
          >
            <Combine size={14} />
          </button>
          <button
            onClick={flattenProject}
            disabled={activeProject.layers.length <= 1}
            className="px-2 py-1 bg-[#333] hover:bg-[#404040] hover:text-white rounded text-[10px] transition-colors disabled:opacity-30"
            title="Flatten Image"
          >
            Flatten
          </button>
        </div>
      </div>
    </div>
  );
};
