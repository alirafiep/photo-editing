import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import {
  PhotoProject as Project,
  Layer,
  ToolType,
  ToolSettings,
  LayerAdjustments,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_TEXT_CONFIG,
  DEFAULT_SHAPE_CONFIG,
  SelectionArea,
  CropArea,
  HistoryItem,
  LayerType,
} from '../types/editor';
import {
  SAMPLE_PROJECTS,
  createProjectFromSample,
  createBlankProject,
  SampleTemplate,
} from '../utils/sampleData';
import {
  FILTER_PRESETS,
  removeBackgroundLocally,
  inpaintObjectLocally,
  exportCanvasImage,
} from '../utils/imageProcessing';
import { saveProjectToDB, getAllProjectsFromDB } from '../utils/indexedDB';

const INITIAL_TOOL_SETTINGS: ToolSettings = {
  brush: {
    size: 24,
    hardness: 80,
    opacity: 100,
    flow: 100,
    style: 'round',
  },
  eraser: {
    size: 32,
    hardness: 80,
    opacity: 100,
  },
  text: { ...DEFAULT_TEXT_CONFIG },
  shape: { ...DEFAULT_SHAPE_CONFIG },
  selection: {
    mode: 'rect',
    feather: 0,
  },
  crop: {
    aspect: 'free',
  },
  gradient: {
    type: 'linear',
    preset: 'sunrise',
  },
  eyedropper: {
    sampleSize: 1,
  },
  blur: {
    toolType: 'gaussian',
    intensity: 30,
    radius: 12,
    brushSize: 60,
    brushHardness: 50,
    opacity: 100,
    isEraserRestore: false,
    preserveSubject: false,
  },
};

interface EditorContextType {
  projects: Project[];
  activeProject: Project | null;
  activeProjectId: string | null;
  setActiveProjectId: (id: string) => void;
  closeProject: (id: string) => void;
  createNewProject: (name: string, width: number, height: number, bg?: string) => void;
  openSampleProject: (sample: SampleTemplate) => void;
  openImageFiles: (files: FileList | File[]) => void;
  addImageAsLayer: (fileOrUrl: File | string) => void;
  openProject: (project: Project) => void;

  activeTool: ToolType;
  setActiveTool: (tool: ToolType) => void;
  toolSettings: ToolSettings;
  updateToolSettings: <K extends keyof ToolSettings>(key: K, settings: Partial<ToolSettings[K]>) => void;

  fgColor: string;
  bgColor: string;
  setFgColor: (color: string) => void;
  setBgColor: (color: string) => void;
  swapColors: () => void;
  resetColors: () => void;

  selectedLayer: Layer | null;
  selectedLayerId: string | null;
  setSelectedLayerId: (id: string | null) => void;
  addLayer: (type: LayerType, name?: string, dataUrl?: string) => void;
  duplicateLayer: (id: string) => void;
  deleteLayer: (id: string) => void;
  updateLayer: (id: string, updates: Partial<Layer>, recordHistory?: boolean, desc?: string) => void;
  reorderLayers: (startIndex: number, endIndex: number) => void;
  mergeDown: (id: string) => void;
  flattenProject: () => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;

  updateAdjustments: (adjustments: Partial<LayerAdjustments>) => void;
  resetAdjustments: () => void;
  applyFilterPreset: (filterId: string) => void;
  autoEnhanceImage: () => Promise<void>;
  removeBackground: () => Promise<void>;
  removeObject: () => Promise<void>;

  history: HistoryItem[];
  historyIndex: number;
  undo: () => void;
  redo: () => void;
  jumpToHistory: (index: number) => void;
  recordHistory: (description: string, newLayers?: Layer[]) => void;

  zoom: number;
  setZoom: React.Dispatch<React.SetStateAction<number>>;
  pan: { x: number; y: number };
  setPan: React.Dispatch<React.SetStateAction<{ x: number; y: number }>>;
  fitToScreen: () => void;
  zoomTo: (percentage: number) => void;

  selection: SelectionArea | null;
  setSelection: (sel: SelectionArea | null) => void;
  cropArea: CropArea | null;
  setCropArea: (crop: CropArea | null) => void;
  applyCrop: () => void;
  cancelCrop: () => void;
  deleteSelection: () => void;

  activeSidebarTab: 'layers' | 'properties' | 'adjustments' | 'blur' | 'history' | 'filters';
  setActiveSidebarTab: (tab: 'layers' | 'properties' | 'adjustments' | 'blur' | 'history' | 'filters') => void;

  showNewModal: boolean;
  setShowNewModal: (show: boolean) => void;
  showPresetsModal: boolean;
  setShowPresetsModal: (show: boolean) => void;
  showFontModal: boolean;
  setShowFontModal: (show: boolean) => void;
  showExportModal: boolean;
  setShowExportModal: (show: boolean) => void;
  showResizeModal: boolean;
  setShowResizeModal: (show: boolean) => void;
  showDesktopModal: boolean;
  setShowDesktopModal: (show: boolean) => void;
  showShareModal: boolean;
  setShowShareModal: (show: boolean) => void;
  showColorPickerModal: boolean;
  setShowColorPickerModal: (show: boolean) => void;
  colorPickerTarget: 'fg' | 'bg';
  setColorPickerTarget: (target: 'fg' | 'bg') => void;

  isProcessingAI: boolean;
  aiStatusMessage: string;
  showToast: (msg: string) => void;
  toastMessage: string | null;
  onReturnToHome?: () => void;
  setOnReturnToHome: (cb: () => void) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>(() => {
    // Start with the first sample project so user immediately has an impressive workspace
    const initial = createProjectFromSample(SAMPLE_PROJECTS[0]);
    return [initial];
  });
  const [activeProjectId, setActiveProjectId] = useState<string | null>(() => {
    return projects[0]?.id || null;
  });

  const [activeTool, setActiveTool] = useState<ToolType>('move');
  const [toolSettings, setToolSettings] = useState<ToolSettings>(INITIAL_TOOL_SETTINGS);

  const [fgColor, setFgColor] = useState<string>('#ffffff');
  const [bgColor, setBgColor] = useState<string>('#000000');

  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const [selection, setSelection] = useState<SelectionArea | null>(null);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);

  const [activeSidebarTab, setActiveSidebarTab] = useState<
    'layers' | 'properties' | 'adjustments' | 'blur' | 'history' | 'filters'
  >('layers');

  // Modals state
  const [showNewModal, setShowNewModal] = useState<boolean>(false);
  const [showPresetsModal, setShowPresetsModal] = useState<boolean>(false);
  const [showFontModal, setShowFontModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [showResizeModal, setShowResizeModal] = useState<boolean>(false);
  const [showDesktopModal, setShowDesktopModal] = useState<boolean>(false);
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [showColorPickerModal, setShowColorPickerModal] = useState<boolean>(false);
  const [colorPickerTarget, setColorPickerTarget] = useState<'fg' | 'bg'>('fg');

  // Callback to return to home screen
  const [onReturnToHomeCb, setOnReturnToHomeCb] = useState<(() => void) | undefined>(undefined);
  const setOnReturnToHome = useCallback((cb: () => void) => {
    setOnReturnToHomeCb(() => cb);
  }, []);

  // AI & Feedback
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [aiStatusMessage, setAiStatusMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3200);
  }, []);

  // History tracking per active project
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const activeProject = projects.find((p) => p.id === activeProjectId) || null;
  const selectedLayer =
    activeProject?.layers.find((l) => l.id === activeProject.selectedLayerId) ||
    activeProject?.layers[activeProject.layers.length - 1] ||
    null;
  const selectedLayerId = activeProject?.selectedLayerId || null;

  // Initialize history when active project changes
  const prevProjIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (activeProject && activeProject.id !== prevProjIdRef.current) {
      prevProjIdRef.current = activeProject.id;
      const initialItem: HistoryItem = {
        id: 'hist_' + Date.now(),
        description: 'Open ' + activeProject.name,
        layers: JSON.parse(JSON.stringify(activeProject.layers)),
        selectedLayerId: activeProject.selectedLayerId,
        width: activeProject.width,
        height: activeProject.height,
        timestamp: Date.now(),
      };
      setHistory([initialItem]);
      setHistoryIndex(0);
    }
  }, [activeProject]);

  // Debounced Auto-save to IndexedDB
  useEffect(() => {
    if (!activeProject) return;
    const timer = setTimeout(() => {
      saveProjectToDB(activeProject);
    }, 1200);
    return () => clearTimeout(timer);
  }, [activeProject]);

  const recordHistory = useCallback(
    (description: string, newLayers?: Layer[]) => {
      if (!activeProject) return;
      const layersToRecord = newLayers || activeProject.layers;
      const newItem: HistoryItem = {
        id: 'hist_' + Date.now() + Math.random().toString(36).substring(2, 5),
        description,
        layers: JSON.parse(JSON.stringify(layersToRecord)),
        selectedLayerId: activeProject.selectedLayerId,
        width: activeProject.width,
        height: activeProject.height,
        timestamp: Date.now(),
      };

      setHistory((prev) => {
        const sliced = prev.slice(0, historyIndex + 1);
        return [...sliced, newItem].slice(-40); // Keep last 40 history states
      });
      setHistoryIndex((prev) => Math.min(prev + 1, 39));
    },
    [activeProject, historyIndex]
  );

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const targetState = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === activeProjectId) {
            return {
              ...p,
              layers: JSON.parse(JSON.stringify(targetState.layers)),
              selectedLayerId: targetState.selectedLayerId,
              width: targetState.width,
              height: targetState.height,
            };
          }
          return p;
        })
      );
      showToast(`Undo: ${history[historyIndex].description}`);
    }
  }, [historyIndex, history, activeProjectId, showToast]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const targetState = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id === activeProjectId) {
            return {
              ...p,
              layers: JSON.parse(JSON.stringify(targetState.layers)),
              selectedLayerId: targetState.selectedLayerId,
              width: targetState.width,
              height: targetState.height,
            };
          }
          return p;
        })
      );
      showToast(`Redo: ${targetState.description}`);
    }
  }, [historyIndex, history, activeProjectId, showToast]);

  const jumpToHistory = useCallback(
    (index: number) => {
      if (index >= 0 && index < history.length) {
        const targetState = history[index];
        setHistoryIndex(index);
        setProjects((prev) =>
          prev.map((p) => {
            if (p.id === activeProjectId) {
              return {
                ...p,
                layers: JSON.parse(JSON.stringify(targetState.layers)),
                selectedLayerId: targetState.selectedLayerId,
                width: targetState.width,
                height: targetState.height,
              };
            }
            return p;
          })
        );
      }
    },
    [history, activeProjectId]
  );

  const updateToolSettings = useCallback(
    <K extends keyof ToolSettings>(key: K, settings: Partial<ToolSettings[K]>) => {
      setToolSettings((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          ...settings,
        },
      }));
    },
    []
  );

  const setSelectedLayerId = useCallback(
    (id: string | null) => {
      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjectId ? { ...p, selectedLayerId: id } : p))
      );
    },
    [activeProjectId]
  );

  const updateLayer = useCallback(
    (id: string, updates: Partial<Layer>, shouldRecord: boolean = false, desc: string = 'Edit Layer') => {
      setProjects((prev) =>
        prev.map((p) => {
          if (p.id !== activeProjectId) return p;
          const nextLayers = p.layers.map((l) => (l.id === id ? { ...l, ...updates } : l));
          if (shouldRecord) {
            recordHistory(desc, nextLayers);
          }
          return {
            ...p,
            layers: nextLayers,
          };
        })
      );
    },
    [activeProjectId, recordHistory]
  );

  const addLayer = useCallback(
    (type: LayerType, customName?: string, dataUrl?: string) => {
      if (!activeProject) return;
      const count = activeProject.layers.filter((l) => l.type === type).length + 1;
      const typeLabel =
        type === 'image' ? 'Image' : type === 'text' ? 'Text' : type === 'shape' ? 'Shape' : 'Paint Layer';
      const name = customName || `${typeLabel} ${count}`;
      const newId = 'layer_' + Math.random().toString(36).substring(2, 9);

      let w = Math.round(activeProject.width * 0.5);
      let h = Math.round(activeProject.height * 0.5);
      let x = Math.round((activeProject.width - w) / 2);
      let y = Math.round((activeProject.height - h) / 2);

      if (type === 'text') {
        w = 400;
        h = 100;
        x = Math.round((activeProject.width - w) / 2);
        y = Math.round((activeProject.height - h) / 2);
      } else if (type === 'shape') {
        w = 300;
        h = 200;
        x = Math.round((activeProject.width - w) / 2);
        y = Math.round((activeProject.height - h) / 2);
      } else if (type === 'paint') {
        w = activeProject.width;
        h = activeProject.height;
        x = 0;
        y = 0;
        // Create blank transparent canvas for painting
        const pCanvas = document.createElement('canvas');
        pCanvas.width = w;
        pCanvas.height = h;
        dataUrl = pCanvas.toDataURL('image/png');
      }

      const newLayer: Layer = {
        id: newId,
        name,
        type,
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x,
        y,
        width: w,
        height: h,
        rotation: 0,
        flipH: false,
        flipV: false,
        dataUrl: dataUrl || '',
        textConfig: type === 'text' ? { ...toolSettings.text } : undefined,
        shapeConfig: type === 'shape' ? { ...toolSettings.shape } : undefined,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        filter: null,
      };

      const nextLayers = [...activeProject.layers, newLayer];
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, layers: nextLayers, selectedLayerId: newId }
            : p
        )
      );
      recordHistory(`New ${typeLabel}`, nextLayers);
      showToast(`Added ${name}`);
    },
    [activeProject, activeProjectId, toolSettings, recordHistory, showToast]
  );

  const duplicateLayer = useCallback(
    (id: string) => {
      if (!activeProject) return;
      const target = activeProject.layers.find((l) => l.id === id);
      if (!target) return;

      const newId = 'layer_' + Math.random().toString(36).substring(2, 9);
      const cloned: Layer = {
        ...JSON.parse(JSON.stringify(target)),
        id: newId,
        name: `${target.name} (Copy)`,
        x: target.x + 20,
        y: target.y + 20,
      };

      const targetIdx = activeProject.layers.findIndex((l) => l.id === id);
      const nextLayers = [...activeProject.layers];
      nextLayers.splice(targetIdx + 1, 0, cloned);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, layers: nextLayers, selectedLayerId: newId }
            : p
        )
      );
      recordHistory(`Duplicate ${target.name}`, nextLayers);
      showToast(`Duplicated layer`);
    },
    [activeProject, activeProjectId, recordHistory, showToast]
  );

  const deleteLayer = useCallback(
    (id: string) => {
      if (!activeProject || activeProject.layers.length <= 1) {
        showToast('Cannot delete the only layer');
        return;
      }
      const target = activeProject.layers.find((l) => l.id === id);
      const nextLayers = activeProject.layers.filter((l) => l.id !== id);
      const nextSelectedId =
        activeProject.selectedLayerId === id
          ? nextLayers[nextLayers.length - 1].id
          : activeProject.selectedLayerId;

      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, layers: nextLayers, selectedLayerId: nextSelectedId }
            : p
        )
      );
      recordHistory(`Delete ${target?.name || 'Layer'}`, nextLayers);
      showToast(`Deleted layer`);
    },
    [activeProject, activeProjectId, recordHistory, showToast]
  );

  const reorderLayers = useCallback(
    (startIndex: number, endIndex: number) => {
      if (!activeProject) return;
      const result = Array.from(activeProject.layers);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);

      setProjects((prev) =>
        prev.map((p) => (p.id === activeProjectId ? { ...p, layers: result } : p))
      );
      recordHistory(`Reorder Layers`, result);
    },
    [activeProject, activeProjectId, recordHistory]
  );

  const mergeDown = useCallback(
    async (id: string) => {
      if (!activeProject) return;
      const idx = activeProject.layers.findIndex((l) => l.id === id);
      if (idx <= 0) {
        showToast('No layer below to merge with');
        return;
      }

      const topLayer = activeProject.layers[idx];
      const botLayer = activeProject.layers[idx - 1];

      // Render both layers onto combined canvas
      const mergedCanvas = document.createElement('canvas');
      mergedCanvas.width = activeProject.width;
      mergedCanvas.height = activeProject.height;
      const ctx = mergedCanvas.getContext('2d');
      if (!ctx) return;

      const { renderLayer } = await import('../utils/imageProcessing');
      await renderLayer(ctx, botLayer);
      await renderLayer(ctx, topLayer);

      const mergedDataUrl = mergedCanvas.toDataURL('image/png');
      const mergedLayer: Layer = {
        id: botLayer.id,
        name: `${botLayer.name} (Merged)`,
        type: 'image',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: 0,
        y: 0,
        width: activeProject.width,
        height: activeProject.height,
        rotation: 0,
        flipH: false,
        flipV: false,
        dataUrl: mergedDataUrl,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        filter: null,
      };

      const nextLayers = activeProject.layers.filter(
        (l) => l.id !== topLayer.id && l.id !== botLayer.id
      );
      nextLayers.splice(idx - 1, 0, mergedLayer);

      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, layers: nextLayers, selectedLayerId: mergedLayer.id }
            : p
        )
      );
      recordHistory(`Merge Down`, nextLayers);
      showToast('Merged layers');
    },
    [activeProject, activeProjectId, recordHistory, showToast]
  );

  const flattenProject = useCallback(async () => {
    if (!activeProject) return;
    try {
      const flattenedUrl = await exportCanvasImage(
        activeProject.layers,
        activeProject.width,
        activeProject.height,
        'png',
        1,
        1,
        false
      );

      const flatLayer: Layer = {
        id: 'layer_flat_' + Date.now(),
        name: 'Background (Flattened)',
        type: 'image',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: 0,
        y: 0,
        width: activeProject.width,
        height: activeProject.height,
        rotation: 0,
        flipH: false,
        flipV: false,
        dataUrl: flattenedUrl,
        adjustments: { ...DEFAULT_ADJUSTMENTS },
        filter: null,
      };

      const nextLayers = [flatLayer];
      setProjects((prev) =>
        prev.map((p) =>
          p.id === activeProjectId
            ? { ...p, layers: nextLayers, selectedLayerId: flatLayer.id }
            : p
        )
      );
      recordHistory('Flatten Image', nextLayers);
      showToast('Image flattened to single layer');
    } catch (e) {
      console.error(e);
    }
  }, [activeProject, activeProjectId, recordHistory, showToast]);

  const toggleLayerVisibility = useCallback(
    (id: string) => {
      if (!activeProject) return;
      const target = activeProject.layers.find((l) => l.id === id);
      if (!target) return;
      updateLayer(id, { visible: !target.visible });
    },
    [activeProject, updateLayer]
  );

  const toggleLayerLock = useCallback(
    (id: string) => {
      if (!activeProject) return;
      const target = activeProject.layers.find((l) => l.id === id);
      if (!target) return;
      updateLayer(id, { locked: !target.locked });
    },
    [activeProject, updateLayer]
  );

  const updateAdjustments = useCallback(
    (adjustments: Partial<LayerAdjustments>) => {
      if (!selectedLayer || selectedLayer.locked) return;
      const updated = {
        ...selectedLayer.adjustments,
        ...adjustments,
      };
      updateLayer(selectedLayer.id, { adjustments: updated });
    },
    [selectedLayer, updateLayer]
  );

  const resetAdjustments = useCallback(() => {
    if (!selectedLayer || selectedLayer.locked) return;
    updateLayer(
      selectedLayer.id,
      { adjustments: { ...DEFAULT_ADJUSTMENTS }, filter: null },
      true,
      'Reset Adjustments'
    );
    showToast('Adjustments reset');
  }, [selectedLayer, updateLayer, showToast]);

  const applyFilterPreset = useCallback(
    (filterId: string) => {
      if (!selectedLayer || selectedLayer.locked) return;
      const preset = FILTER_PRESETS.find((f) => f.id === filterId);
      if (!preset) return;

      const newAdjustments = {
        ...DEFAULT_ADJUSTMENTS,
        ...preset.adjustments,
      };

      updateLayer(
        selectedLayer.id,
        { adjustments: newAdjustments, filter: filterId },
        true,
        `Apply Filter: ${preset.name}`
      );
      showToast(`Applied filter: ${preset.name}`);
    },
    [selectedLayer, updateLayer, showToast]
  );

  const autoEnhanceImage = useCallback(async () => {
    if (!selectedLayer || !selectedLayer.dataUrl) {
      showToast('Select an image layer to enhance');
      return;
    }

    setIsProcessingAI(true);
    setAiStatusMessage('AI Analyzing image dynamic range, color balance and tone...');

    try {
      const res = await fetch('/api/gemini/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: selectedLayer.dataUrl }),
      });
      const data = await res.json();

      if (data.success && data.adjustments) {
        updateLayer(
          selectedLayer.id,
          { adjustments: { ...selectedLayer.adjustments, ...data.adjustments } },
          true,
          'AI Auto Enhance'
        );
        showToast(data.message || 'Auto Enhancement Applied');
      } else {
        // Fallback enhancement
        updateLayer(
          selectedLayer.id,
          {
            adjustments: {
              ...selectedLayer.adjustments,
              brightness: 6,
              contrast: 15,
              saturation: 12,
              exposure: 4,
              shadows: 14,
              highlights: -8,
              sharpness: 25,
            },
          },
          true,
          'Auto Enhance'
        );
        showToast('Auto enhancement applied');
      }
    } catch (err) {
      console.error(err);
      updateLayer(
        selectedLayer.id,
        {
          adjustments: {
            ...selectedLayer.adjustments,
            brightness: 6,
            contrast: 15,
            saturation: 12,
            exposure: 4,
            shadows: 14,
            highlights: -8,
            sharpness: 25,
          },
        },
        true,
        'Auto Enhance'
      );
      showToast('Auto enhancement applied');
    } finally {
      setIsProcessingAI(false);
      setAiStatusMessage('');
    }
  }, [selectedLayer, updateLayer, showToast]);

  const removeBackground = useCallback(async () => {
    if (!selectedLayer || !selectedLayer.dataUrl) {
      showToast('Select an image layer first');
      return;
    }

    setIsProcessingAI(true);
    setAiStatusMessage('Processing AI background extraction & edge alpha smoothing...');

    try {
      const cutoutDataUrl = await removeBackgroundLocally(selectedLayer.dataUrl);
      updateLayer(
        selectedLayer.id,
        { dataUrl: cutoutDataUrl },
        true,
        'Remove Background'
      );
      showToast('Background removed successfully!');
    } catch (err) {
      console.error('Remove background error:', err);
      showToast('Failed to remove background');
    } finally {
      setIsProcessingAI(false);
      setAiStatusMessage('');
    }
  }, [selectedLayer, updateLayer, showToast]);

  const removeObject = useCallback(async () => {
    if (!selectedLayer || !selectedLayer.dataUrl) {
      showToast('Select an image layer');
      return;
    }
    if (!selection) {
      showToast('Draw a selection (Marquee or Lasso) over the object first');
      return;
    }

    setIsProcessingAI(true);
    setAiStatusMessage('Content-aware inpainting & texture blending...');

    try {
      const inpaintedUrl = await inpaintObjectLocally(
        selectedLayer.dataUrl,
        selection,
        selectedLayer.x,
        selectedLayer.y
      );
      updateLayer(selectedLayer.id, { dataUrl: inpaintedUrl }, true, 'Remove Object');
      setSelection(null);
      showToast('Object removed cleanly!');
    } catch (err) {
      console.error(err);
      showToast('Failed to remove object');
    } finally {
      setIsProcessingAI(false);
      setAiStatusMessage('');
    }
  }, [selectedLayer, selection, updateLayer, showToast]);

  const deleteSelection = useCallback(() => {
    if (!selectedLayer || !selectedLayer.dataUrl || !selection) return;

    const img = new Image();
    img.src = selectedLayer.dataUrl;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      const selX = Math.max(0, selection.x - selectedLayer.x);
      const selY = Math.max(0, selection.y - selectedLayer.y);
      const selW = Math.min(canvas.width - selX, selection.width);
      const selH = Math.min(canvas.height - selY, selection.height);

      ctx.clearRect(selX, selY, selW, selH);
      updateLayer(selectedLayer.id, { dataUrl: canvas.toDataURL('image/png') }, true, 'Clear Selection');
      setSelection(null);
      showToast('Cleared selected area');
    };
  }, [selectedLayer, selection, updateLayer, showToast]);

  const applyCrop = useCallback(() => {
    if (!activeProject || !cropArea) return;
    const { x, y, width, height } = cropArea;

    if (width <= 10 || height <= 10) {
      setCropArea(null);
      return;
    }

    // Offset all layers so (x, y) becomes (0, 0)
    const croppedLayers = activeProject.layers.map((l) => ({
      ...l,
      x: l.x - x,
      y: l.y - y,
    }));

    setProjects((prev) =>
      prev.map((p) =>
        p.id === activeProjectId
          ? {
              ...p,
              width: Math.round(width),
              height: Math.round(height),
              layers: croppedLayers,
            }
          : p
      )
    );
    recordHistory('Crop Canvas', croppedLayers);
    setCropArea(null);
    setActiveTool('move');
    showToast(`Cropped to ${Math.round(width)} × ${Math.round(height)} px`);
  }, [activeProject, cropArea, activeProjectId, recordHistory, showToast]);

  const cancelCrop = useCallback(() => {
    setCropArea(null);
    setActiveTool('move');
  }, []);

  const swapColors = useCallback(() => {
    setFgColor((prevFg) => {
      setBgColor(prevFg);
      return bgColor;
    });
  }, [bgColor]);

  const resetColors = useCallback(() => {
    setFgColor('#ffffff');
    setBgColor('#000000');
  }, []);

  const fitToScreen = useCallback(() => {
    if (!activeProject) return;
    const container = document.getElementById('canvas-viewport-container');
    if (!container) return;

    const availableW = container.clientWidth - 80;
    const availableH = container.clientHeight - 80;
    const scaleW = availableW / activeProject.width;
    const scaleH = availableH / activeProject.height;
    const optimalZoom = Math.min(scaleW, scaleH, 1.5);

    setZoom(Math.max(0.05, Math.round(optimalZoom * 100) / 100));
    setPan({ x: 0, y: 0 });
  }, [activeProject]);

  const zoomTo = useCallback((percentage: number) => {
    setZoom(percentage / 100);
  }, []);

  const createNewProject = useCallback(
    (name: string, width: number, height: number, bg: string = '#ffffff') => {
      const newProj = createBlankProject(name, width, height, bg);
      setProjects((prev) => [...prev, newProj]);
      setActiveProjectId(newProj.id);
      setShowNewModal(false);
      showToast(`Created ${name}`);
    },
    [showToast]
  );

  const openSampleProject = useCallback(
    (sample: SampleTemplate) => {
      const newProj = createProjectFromSample(sample);
      setProjects((prev) => [...prev, newProj]);
      setActiveProjectId(newProj.id);
      setShowNewModal(false);
      showToast(`Loaded ${sample.title}`);
    },
    [showToast]
  );

  const openProject = useCallback(
    (proj: Project) => {
      setProjects((prev) => {
        const idx = prev.findIndex((p) => p.id === proj.id);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = proj;
          return updated;
        }
        return [proj, ...prev];
      });
      setActiveProjectId(proj.id);
      showToast(`Opened ${proj.name}`);
    },
    [showToast]
  );

  const openImageFiles = useCallback(
    (files: FileList | File[]) => {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const img = new Image();
          img.onload = () => {
            const newProj: Project = {
              id: 'proj_' + Math.random().toString(36).substring(2, 9),
              type: 'photo',
              name: file.name.replace(/\.[^/.]+$/, ''),
              width: img.width,
              height: img.height,
              dpi: 300,
              zoom: 1,
              panX: 0,
              panY: 0,
              createdAt: Date.now(),
              updatedAt: Date.now(),
              selectedLayerId: 'layer_bg',
              layers: [
                {
                  id: 'layer_bg',
                  name: file.name,
                  type: 'image',
                  visible: true,
                  locked: false,
                  opacity: 1,
                  blendMode: 'source-over',
                  x: 0,
                  y: 0,
                  width: img.width,
                  height: img.height,
                  rotation: 0,
                  flipH: false,
                  flipV: false,
                  dataUrl,
                  adjustments: { ...DEFAULT_ADJUSTMENTS },
                  filter: null,
                },
              ],
            };
            setProjects((prev) => [...prev, newProj]);
            setActiveProjectId(newProj.id);
            setShowNewModal(false);
            showToast(`Opened ${file.name}`);
          };
          img.src = dataUrl;
        };
        reader.readAsDataURL(file);
      });
    },
    [showToast]
  );

  const addImageAsLayer = useCallback(
    (fileOrUrl: File | string) => {
      if (typeof fileOrUrl === 'string') {
        const img = new Image();
        img.onload = () => {
          addLayer('image', 'Imported Image', fileOrUrl);
        };
        img.src = fileOrUrl;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          addLayer('image', fileOrUrl.name, dataUrl);
        };
        reader.readAsDataURL(fileOrUrl);
      }
    },
    [addLayer]
  );

  const closeProject = useCallback(
    (id: string) => {
      setProjects((prev) => {
        const next = prev.filter((p) => p.id !== id);
        if (next.length === 0) {
          // Open welcome modal when all tabs closed
          setShowNewModal(true);
          setActiveProjectId(null);
        } else if (activeProjectId === id) {
          setActiveProjectId(next[next.length - 1].id);
        }
        return next;
      });
    },
    [activeProjectId]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const ctrlOrCmd = e.ctrlKey || e.metaKey;

      if (ctrlOrCmd && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) redo();
        else undo();
        return;
      }

      if (ctrlOrCmd && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
        return;
      }

      if (ctrlOrCmd && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (activeProject) {
          saveProjectToDB(activeProject);
          showToast('Project saved to local database');
        }
        return;
      }

      if (ctrlOrCmd && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        setSelection(null);
        showToast('Deselected');
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selection) {
          e.preventDefault();
          deleteSelection();
          return;
        }
        if (selectedLayerId && !selectedLayer?.locked) {
          e.preventDefault();
          deleteLayer(selectedLayerId);
          return;
        }
      }

      if (e.key.toLowerCase() === 'x') {
        swapColors();
        return;
      }

      if (e.key.toLowerCase() === 'd') {
        resetColors();
        return;
      }

      // Single-key Tool Selectors
      switch (e.key.toLowerCase()) {
        case 'v':
          setActiveTool('move');
          break;
        case 'm':
          setActiveTool('select');
          break;
        case 'c':
          setActiveTool('crop');
          break;
        case 'l':
          setActiveTool('lasso');
          break;
        case 'b':
          setActiveTool('brush');
          break;
        case 'e':
          setActiveTool('eraser');
          break;
        case 't':
          setActiveTool('text');
          break;
        case 'u':
          setActiveTool('shape');
          break;
        case 'g':
          setActiveTool('gradient');
          break;
        case 'i':
          setActiveTool('eyedropper');
          break;
        case 'h':
          setActiveTool('hand');
          break;
        case 'z':
          setActiveTool('zoom');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    undo,
    redo,
    activeProject,
    showToast,
    selection,
    deleteSelection,
    selectedLayerId,
    selectedLayer,
    deleteLayer,
    swapColors,
    resetColors,
  ]);

  return (
    <EditorContext.Provider
      value={{
        projects,
        activeProject,
        activeProjectId,
        setActiveProjectId,
        closeProject,
        createNewProject,
        openSampleProject,
        openProject,
        openImageFiles,
        addImageAsLayer,

        activeTool,
        setActiveTool,
        toolSettings,
        updateToolSettings,

        fgColor,
        bgColor,
        setFgColor,
        setBgColor,
        swapColors,
        resetColors,

        selectedLayer,
        selectedLayerId,
        setSelectedLayerId,
        addLayer,
        duplicateLayer,
        deleteLayer,
        updateLayer,
        reorderLayers,
        mergeDown,
        flattenProject,
        toggleLayerVisibility,
        toggleLayerLock,

        updateAdjustments,
        resetAdjustments,
        applyFilterPreset,
        autoEnhanceImage,
        removeBackground,
        removeObject,

        history,
        historyIndex,
        undo,
        redo,
        jumpToHistory,
        recordHistory,

        zoom,
        setZoom,
        pan,
        setPan,
        fitToScreen,
        zoomTo,

        selection,
        setSelection,
        cropArea,
        setCropArea,
        applyCrop,
        cancelCrop,
        deleteSelection,

        activeSidebarTab,
        setActiveSidebarTab,

        showNewModal,
        setShowNewModal,
        showPresetsModal,
        setShowPresetsModal,
        showFontModal,
        setShowFontModal,
        showExportModal,
        setShowExportModal,
        showResizeModal,
        setShowResizeModal,
        showDesktopModal,
        setShowDesktopModal,
        showShareModal,
        setShowShareModal,
        showColorPickerModal,
        setShowColorPickerModal,
        colorPickerTarget,
        setColorPickerTarget,

        isProcessingAI,
        aiStatusMessage,
        showToast,
        toastMessage,
        onReturnToHome: onReturnToHomeCb,
        setOnReturnToHome,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
};
