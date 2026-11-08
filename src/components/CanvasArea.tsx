import React, {
  useRef,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import {
  X,
  Plus,
  RotateCw,
  Sparkles,
  Maximize2,
  ZoomIn,
  Move,
  Check,
} from 'lucide-react';
import { useEditor } from '../context/EditorContext';
import { renderLayer, getCachedImage } from '../utils/imageProcessing';
import { Layer } from '../types/editor';

type HandleType =
  | 'tl'
  | 'tm'
  | 'tr'
  | 'ml'
  | 'mr'
  | 'bl'
  | 'bm'
  | 'br'
  | 'rot'
  | null;

export const CanvasArea: React.FC = () => {
  const {
    projects,
    activeProject,
    activeProjectId,
    setActiveProjectId,
    closeProject,
    setShowNewModal,
    activeTool,
    toolSettings,
    selectedLayer,
    updateLayer,
    addLayer,
    zoom,
    setZoom,
    pan,
    setPan,
    fitToScreen,
    fgColor,
    bgColor,
    setFgColor,
    selection,
    setSelection,
    cropArea,
    setCropArea,
    applyCrop,
    cancelCrop,
    openImageFiles,
    addImageAsLayer,
    showToast,
  } = useEditor();

  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Interaction tracking
  const [isPanning, setIsPanning] = useState(false);
  const [spacePressed, setSpacePressed] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null);

  // Layer transform tracking
  const [activeHandle, setActiveHandle] = useState<HandleType>(null);
  const [transformInitial, setTransformInitial] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    mouseX: number;
    mouseY: number;
  } | null>(null);

  // Drawing state for Brush / Eraser
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingLayerCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Selection / Crop drag state
  const [selectionStart, setSelectionStart] = useState<{ x: number; y: number } | null>(null);
  const [gradientStart, setGradientStart] = useState<{ x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Initial fit to screen on project load
  useEffect(() => {
    if (activeProject) {
      fitToScreen();
    }
  }, [activeProject?.id]);

  // Spacebar pan toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spacePressed) {
        const target = e.target as HTMLElement;
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          setSpacePressed(true);
        }
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [spacePressed]);

  // Clipboard paste support for images
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            addImageAsLayer(file);
            showToast('Pasted image from clipboard');
          }
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addImageAsLayer, showToast]);

  // Main canvas render loop
  const renderAllLayers = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas || !activeProject) return;

    if (canvas.width !== activeProject.width || canvas.height !== activeProject.height) {
      canvas.width = activeProject.width;
      canvas.height = activeProject.height;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const layer of activeProject.layers) {
      if (layer.visible) {
        await renderLayer(ctx, layer);
      }
    }
  }, [activeProject]);

  useEffect(() => {
    renderAllLayers();
  }, [renderAllLayers, activeProject?.layers, activeProject?.width, activeProject?.height]);

  // Convert client viewport coordinates to canvas document coordinates
  const clientToDocCoords = useCallback(
    (clientX: number, clientY: number) => {
      const viewport = viewportRef.current;
      if (!viewport || !activeProject) return { x: 0, y: 0 };

      const rect = viewport.getBoundingClientRect();
      const centerX = rect.width / 2 + pan.x;
      const centerY = rect.height / 2 + pan.y;

      const docLeft = centerX - (activeProject.width * zoom) / 2;
      const docTop = centerY - (activeProject.height * zoom) / 2;

      const docX = (clientX - rect.left - docLeft) / zoom;
      const docY = (clientY - rect.top - docTop) / zoom;

      return { x: docX, y: docY };
    },
    [pan, zoom, activeProject]
  );

  // Wheel zoom and pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.ctrlKey || e.metaKey || spacePressed) {
      // Zoom
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
      setZoom((prevZoom) => {
        const nextZoom = Math.min(25, Math.max(0.05, prevZoom * zoomFactor));
        return Math.round(nextZoom * 100) / 100;
      });
    } else {
      // Pan
      setPan((prev) => ({
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      openImageFiles(e.dataTransfer.files);
    }
  };

  // Mouse down on canvas area
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!activeProject) return;

    // Pan with space or middle mouse or Hand tool
    if (spacePressed || e.button === 1 || activeTool === 'hand') {
      setIsPanning(true);
      setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      return;
    }

    const { x, y } = clientToDocCoords(e.clientX, e.clientY);

    // Zoom tool
    if (activeTool === 'zoom') {
      if (e.altKey) {
        setZoom((z) => Math.max(0.1, z - 0.5));
      } else {
        setZoom((z) => Math.min(10, z + 0.5));
      }
      return;
    }

    // Eyedropper tool
    if (activeTool === 'eyedropper') {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const pixel = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1).data;
      const hex = `#${((1 << 24) + (pixel[0] << 16) + (pixel[1] << 8) + pixel[2])
        .toString(16)
        .slice(1)}`;
      setFgColor(hex);
      showToast(`Sampled: ${hex.toUpperCase()}`);
      return;
    }

    // Selection tool
    if (activeTool === 'select' || activeTool === 'lasso') {
      setSelectionStart({ x, y });
      setSelection({
        mode: toolSettings.selection.mode,
        x,
        y,
        width: 0,
        height: 0,
        active: true,
      });
      return;
    }

    // Crop tool
    if (activeTool === 'crop') {
      setSelectionStart({ x, y });
      setCropArea({
        x,
        y,
        width: 1,
        height: 1,
        aspect: toolSettings.crop.aspect,
      });
      return;
    }

    // Gradient tool
    if (activeTool === 'gradient') {
      setGradientStart({ x, y });
      return;
    }

    // Text tool: click to create new text layer or edit
    if (activeTool === 'text') {
      addLayer('text', 'Text Layer');
      return;
    }

    // Shape tool: drag to create shape
    if (activeTool === 'shape') {
      setSelectionStart({ x, y });
      return;
    }

    // Brush or Eraser tool
    if (activeTool === 'brush' || activeTool === 'eraser') {
      if (!selectedLayer || selectedLayer.locked) {
        // If no layer or locked, create a paint layer
        addLayer('paint');
        return;
      }

      setIsDrawing(true);
      // Initialize or load paint canvas
      const pCanvas = document.createElement('canvas');
      pCanvas.width = activeProject.width;
      pCanvas.height = activeProject.height;
      const pCtx = pCanvas.getContext('2d');
      if (pCtx && selectedLayer.dataUrl) {
        const img = new Image();
        img.src = selectedLayer.dataUrl;
        img.onload = () => pCtx.drawImage(img, 0, 0);
      }
      drawingLayerCanvasRef.current = pCanvas;

      paintStroke(x, y, true);
      return;
    }

    // Move tool: handle transform handles or layer dragging
    if (activeTool === 'move' && selectedLayer && !selectedLayer.locked) {
      setTransformInitial({
        x: selectedLayer.x,
        y: selectedLayer.y,
        width: selectedLayer.width,
        height: selectedLayer.height,
        rotation: selectedLayer.rotation,
        mouseX: x,
        mouseY: y,
      });
    }
  };

  // Perform brush / eraser stroke on layer
  const paintStroke = (docX: number, docY: number, isInitial: boolean = false) => {
    if (!selectedLayer || !activeProject) return;

    let pCanvas = drawingLayerCanvasRef.current;
    if (!pCanvas) {
      pCanvas = document.createElement('canvas');
      pCanvas.width = activeProject.width;
      pCanvas.height = activeProject.height;
      drawingLayerCanvasRef.current = pCanvas;
    }

    const ctx = pCanvas.getContext('2d');
    if (!ctx) return;

    const isEraser = activeTool === 'eraser';
    const settings = isEraser ? toolSettings.eraser : toolSettings.brush;

    ctx.save();
    if (isEraser) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.globalAlpha = settings.opacity / 100;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = (toolSettings.brush.opacity / 100) * (toolSettings.brush.flow / 100);
    }

    const radius = settings.size / 2;

    if (!isEraser && toolSettings.brush.style === 'chalk') {
      ctx.fillStyle = fgColor;
      for (let i = 0; i < 8; i++) {
        const rx = docX + (Math.random() - 0.5) * settings.size;
        const ry = docY + (Math.random() - 0.5) * settings.size;
        ctx.fillRect(rx, ry, 2, 2);
      }
    } else if (!isEraser && toolSettings.brush.style === 'square') {
      ctx.fillStyle = fgColor;
      ctx.fillRect(docX - radius, docY - radius, settings.size, settings.size);
    } else {
      // Radial soft or hard gradient
      const grad = ctx.createRadialGradient(docX, docY, radius * (settings.hardness / 100), docX, docY, radius);
      if (isEraser) {
        grad.addColorStop(0, 'rgba(0,0,0,1)');
        grad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = grad;
      } else {
        grad.addColorStop(0, fgColor);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
      }
      ctx.beginPath();
      ctx.arc(docX, docY, radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // Fast update layer preview
    updateLayer(selectedLayer.id, { dataUrl: pCanvas.toDataURL('image/png') });
  };

  // Mouse move handler
  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = clientToDocCoords(e.clientX, e.clientY);
    setMousePos({ x, y });

    // Panning
    if (isPanning && dragStart) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
      return;
    }

    // Brush/Eraser painting
    if (isDrawing) {
      paintStroke(x, y);
      return;
    }

    // Marquee Selection dragging
    if (selectionStart && (activeTool === 'select' || activeTool === 'lasso')) {
      const minX = Math.min(selectionStart.x, x);
      const minY = Math.min(selectionStart.y, y);
      const w = Math.abs(x - selectionStart.x);
      const h = Math.abs(y - selectionStart.y);
      setSelection({
        mode: toolSettings.selection.mode,
        x: minX,
        y: minY,
        width: w,
        height: h,
        active: true,
      });
      return;
    }

    // Crop dragging
    if (selectionStart && activeTool === 'crop') {
      let minX = Math.min(selectionStart.x, x);
      let minY = Math.min(selectionStart.y, y);
      let w = Math.abs(x - selectionStart.x);
      let h = Math.abs(y - selectionStart.y);

      if (toolSettings.crop.aspect === '1:1') {
        const maxSide = Math.max(w, h);
        w = maxSide;
        h = maxSide;
      } else if (toolSettings.crop.aspect === '16:9') {
        h = w * (9 / 16);
      } else if (toolSettings.crop.aspect === '4:3') {
        h = w * (3 / 4);
      } else if (toolSettings.crop.aspect === '9:16') {
        h = w * (16 / 9);
      }

      setCropArea({
        x: minX,
        y: minY,
        width: Math.max(20, w),
        height: Math.max(20, h),
        aspect: toolSettings.crop.aspect,
      });
      return;
    }

    // Shape drag creation
    if (selectionStart && activeTool === 'shape') {
      return; // finalized on mouse up
    }

    // Move tool resizing & moving
    if (transformInitial && selectedLayer && !selectedLayer.locked) {
      const dx = x - transformInitial.mouseX;
      const dy = y - transformInitial.mouseY;

      if (activeHandle === 'rot') {
        const cx = transformInitial.x + transformInitial.width / 2;
        const cy = transformInitial.y + transformInitial.height / 2;
        const angleRad = Math.atan2(y - cy, x - cx);
        const deg = Math.round((angleRad * 180) / Math.PI + 90);
        updateLayer(selectedLayer.id, { rotation: (deg + 360) % 360 });
      } else if (activeHandle === 'br') {
        updateLayer(selectedLayer.id, {
          width: Math.max(10, transformInitial.width + dx),
          height: Math.max(10, transformInitial.height + dy),
        });
      } else if (activeHandle === 'tl') {
        updateLayer(selectedLayer.id, {
          x: transformInitial.x + dx,
          y: transformInitial.y + dy,
          width: Math.max(10, transformInitial.width - dx),
          height: Math.max(10, transformInitial.height - dy),
        });
      } else if (activeHandle === 'tr') {
        updateLayer(selectedLayer.id, {
          y: transformInitial.y + dy,
          width: Math.max(10, transformInitial.width + dx),
          height: Math.max(10, transformInitial.height - dy),
        });
      } else if (activeHandle === 'bl') {
        updateLayer(selectedLayer.id, {
          x: transformInitial.x + dx,
          width: Math.max(10, transformInitial.width - dx),
          height: Math.max(10, transformInitial.height + dy),
        });
      } else if (!activeHandle) {
        // Drag entire layer
        updateLayer(selectedLayer.id, {
          x: Math.round(transformInitial.x + dx),
          y: Math.round(transformInitial.y + dy),
        });
      }
    }
  };

  // Mouse up handler
  const handleMouseUp = (e: React.MouseEvent) => {
    if (isPanning) {
      setIsPanning(false);
      setDragStart(null);
    }

    if (isDrawing && selectedLayer) {
      setIsDrawing(false);
      if (drawingLayerCanvasRef.current) {
        updateLayer(
          selectedLayer.id,
          { dataUrl: drawingLayerCanvasRef.current.toDataURL('image/png') },
          true,
          activeTool === 'brush' ? 'Brush Stroke' : 'Eraser Stroke'
        );
      }
    }

    // Render gradient
    if (gradientStart && activeTool === 'gradient' && selectedLayer) {
      const { x, y } = clientToDocCoords(e.clientX, e.clientY);
      const canvas = document.createElement('canvas');
      canvas.width = activeProject?.width || 1200;
      canvas.height = activeProject?.height || 900;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        let grad: CanvasGradient;
        if (toolSettings.gradient.type === 'radial') {
          const r = Math.hypot(x - gradientStart.x, y - gradientStart.y);
          grad = ctx.createRadialGradient(gradientStart.x, gradientStart.y, 0, gradientStart.x, gradientStart.y, r);
        } else {
          grad = ctx.createLinearGradient(gradientStart.x, gradientStart.y, x, y);
        }

        if (toolSettings.gradient.preset === 'sunrise') {
          grad.addColorStop(0, '#ff7e5f');
          grad.addColorStop(1, '#feb47b');
        } else if (toolSettings.gradient.preset === 'cyber') {
          grad.addColorStop(0, '#00f2fe');
          grad.addColorStop(1, '#4facfe');
        } else if (toolSettings.gradient.preset === 'neon') {
          grad.addColorStop(0, '#00ff87');
          grad.addColorStop(1, '#60efff');
        } else if (toolSettings.gradient.preset === 'twilight') {
          grad.addColorStop(0, '#7028e4');
          grad.addColorStop(1, '#e5b2ca');
        } else if (toolSettings.gradient.preset === 'sunset') {
          grad.addColorStop(0, '#f857a6');
          grad.addColorStop(1, '#ff5858');
        } else {
          grad.addColorStop(0, '#ffffff');
          grad.addColorStop(1, '#000000');
        }

        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        updateLayer(selectedLayer.id, { dataUrl: canvas.toDataURL('image/png') }, true, 'Apply Gradient');
      }
      setGradientStart(null);
    }

    // Finish shape creation
    if (selectionStart && activeTool === 'shape' && activeProject) {
      const { x, y } = clientToDocCoords(e.clientX, e.clientY);
      const minX = Math.min(selectionStart.x, x);
      const minY = Math.min(selectionStart.y, y);
      const w = Math.max(10, Math.abs(x - selectionStart.x));
      const h = Math.max(10, Math.abs(y - selectionStart.y));

      const newId = 'layer_' + Math.random().toString(36).substring(2, 9);
      const newShapeLayer: Layer = {
        id: newId,
        name: `${toolSettings.shape.shapeType.toUpperCase()} Shape`,
        type: 'shape',
        visible: true,
        locked: false,
        opacity: 1,
        blendMode: 'source-over',
        x: Math.round(minX),
        y: Math.round(minY),
        width: Math.round(w),
        height: Math.round(h),
        rotation: 0,
        flipH: false,
        flipV: false,
        shapeConfig: { ...toolSettings.shape },
        adjustments: {
          brightness: 0,
          contrast: 0,
          saturation: 0,
          exposure: 0,
          temperature: 0,
          tint: 0,
          highlights: 0,
          shadows: 0,
          sharpness: 0,
          blur: 0,
          vignette: 0,
          sepia: 0,
          grayscale: 0,
          invert: 0,
        },
        filter: null,
      };

      addLayer('shape', newShapeLayer.name);
      setSelectionStart(null);
    }

    if (selectionStart) {
      setSelectionStart(null);
    }

    if (transformInitial) {
      setTransformInitial(null);
      setActiveHandle(null);
    }
  };

  // Cursor style calculation
  const cursorStyle = useMemo(() => {
    if (spacePressed || activeTool === 'hand') return isPanning ? 'grabbing' : 'grab';
    if (activeTool === 'zoom') return 'zoom-in';
    if (activeTool === 'eyedropper') return 'crosshair';
    if (activeTool === 'crop' || activeTool === 'select' || activeTool === 'lasso') return 'crosshair';
    if (activeTool === 'brush' || activeTool === 'eraser') return 'none'; // custom circle drawn
    if (activeTool === 'text') return 'text';
    return 'default';
  }, [spacePressed, activeTool, isPanning]);

  if (!activeProject) {
    return (
      <div className="flex-1 bg-[#181818] flex flex-col items-center justify-center p-8 text-center text-neutral-400">
        <div className="w-16 h-16 rounded-2xl bg-[#242424] border border-[#3a3a3a] flex items-center justify-center mb-4 text-[#1685ff]">
          <Sparkles size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Welcome to SNAPEDIT</h3>
        <p className="text-sm max-w-md text-neutral-400 mb-6">
          Open a sample photo or create a new blank canvas to start professional photo editing.
        </p>
        <button
          onClick={() => setShowNewModal(true)}
          className="px-5 py-2.5 bg-[#1685ff] hover:bg-[#0070eb] text-white font-medium rounded-lg text-sm transition-colors shadow-md"
        >
          New Project / Open Image
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-[#181818] relative overflow-hidden select-none">
      {/* Document Tabs Bar */}
      <div className="h-8 bg-[#202020] border-b border-[#3a3a3a] flex items-center px-2 gap-1 overflow-x-auto">
        {projects.map((proj) => {
          const isActive = proj.id === activeProjectId;
          return (
            <div
              key={proj.id}
              onClick={() => setActiveProjectId(proj.id)}
              className={`h-7 px-3 rounded-t flex items-center gap-2 cursor-pointer border-t border-x text-xs max-w-[180px] group transition-colors ${
                isActive
                  ? 'bg-[#282828] border-[#3a3a3a] text-white font-medium'
                  : 'bg-[#1b1b1b] border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-[#222]'
              }`}
            >
              <span className="truncate">{proj.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  closeProject(proj.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-rose-400 p-0.5 rounded transition-opacity"
              >
                <X size={11} />
              </button>
            </div>
          );
        })}

        <button
          onClick={() => setShowNewModal(true)}
          className="p-1 text-neutral-400 hover:text-white hover:bg-[#303030] rounded ml-1 transition-colors"
          title="New Project (+)"
        >
          <Plus size={14} />
        </button>
      </div>

      {/* Main Interactive Canvas Viewport */}
      <div
        id="canvas-viewport-container"
        ref={viewportRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ cursor: cursorStyle }}
        className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#181818]"
      >
        {/* Document Frame */}
        <div
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center',
            width: activeProject.width,
            height: activeProject.height,
          }}
          className="relative shadow-2xl transition-transform duration-75"
        >
          {/* Checkerboard Background */}
          <div className="absolute inset-0 canvas-checkerboard pointer-events-none" />

          {/* Rendered Canvas */}
          <canvas
            ref={canvasRef}
            width={activeProject.width}
            height={activeProject.height}
            className="absolute inset-0 pointer-events-none"
          />

          {/* Transform Bounding Box for Selected Layer (when Move Tool active) */}
          {activeTool === 'move' && selectedLayer && selectedLayer.visible && (
            <div
              style={{
                left: selectedLayer.x,
                top: selectedLayer.y,
                width: selectedLayer.width,
                height: selectedLayer.height,
                transform: `rotate(${selectedLayer.rotation || 0}deg)`,
                transformOrigin: 'center center',
              }}
              className="absolute pointer-events-none ring-1 ring-[#1685ff] shadow-sm"
            >
              {/* Rotation Handle above top center */}
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  setActiveHandle('rot');
                }}
                style={{ cursor: 'grab' }}
                className="pointer-events-auto absolute -top-6 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-[#1685ff] rounded-full shadow hover:scale-125 transition-transform flex items-center justify-center"
                title="Rotate Layer"
              >
                <div className="w-1 h-1 bg-[#1685ff] rounded-full" />
              </div>
              <div className="absolute -top-6 left-1/2 w-[1px] h-6 bg-[#1685ff] -translate-x-1/2 pointer-events-none" />

              {/* 8 Scale Handles */}
              {(
                [
                  ['tl', '-top-1.5 -left-1.5', 'nwse-resize'],
                  ['tm', '-top-1.5 left-1/2 -translate-x-1/2', 'ns-resize'],
                  ['tr', '-top-1.5 -right-1.5', 'nesw-resize'],
                  ['ml', 'top-1/2 -translate-y-1/2 -left-1.5', 'ew-resize'],
                  ['mr', 'top-1/2 -translate-y-1/2 -right-1.5', 'ew-resize'],
                  ['bl', '-bottom-1.5 -left-1.5', 'nesw-resize'],
                  ['bm', '-bottom-1.5 left-1/2 -translate-x-1/2', 'ns-resize'],
                  ['br', '-bottom-1.5 -right-1.5', 'nwse-resize'],
                ] as const
              ).map(([handle, posClass, cursor]) => (
                <div
                  key={handle}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    setActiveHandle(handle);
                  }}
                  style={{ cursor }}
                  className={`pointer-events-auto absolute w-3 h-3 bg-white border border-[#1685ff] rounded-sm shadow-sm hover:scale-125 transition-transform ${posClass}`}
                />
              ))}
            </div>
          )}

          {/* Marquee Selection Marching Ants Overlay */}
          {selection && selection.active && (
            <div
              style={{
                left: selection.x,
                top: selection.y,
                width: selection.width,
                height: selection.height,
                borderRadius: selection.mode === 'ellipse' ? '50%' : '0px',
              }}
              className="absolute pointer-events-none marching-ants ring-1 ring-white/50"
            />
          )}

          {/* Photoshop Crop Frame Overlay */}
          {activeTool === 'crop' && cropArea && (
            <div
              style={{
                left: cropArea.x,
                top: cropArea.y,
                width: cropArea.width,
                height: cropArea.height,
              }}
              className="absolute pointer-events-none border-2 border-white shadow-2xl"
            >
              {/* Rule of thirds grid lines */}
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-r border-b border-white/40" />
                <div className="border-b border-white/40" />
                <div className="border-r border-white/40" />
                <div className="border-r border-white/40" />
                <div />
              </div>

              {/* Crop Corner Brackets */}
              <div className="absolute -top-1 -left-1 w-4 h-4 border-t-4 border-l-4 border-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 border-t-4 border-r-4 border-white" />
              <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-4 border-l-4 border-white" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-4 border-r-4 border-white" />

              {/* Crop Dimension Pill */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/90 text-white font-mono text-[10px] px-2 py-0.5 rounded shadow border border-white/20 whitespace-nowrap">
                {Math.round(cropArea.width)} × {Math.round(cropArea.height)} px
              </div>
            </div>
          )}

          {/* Circular Brush / Eraser Cursor Preview */}
          {(activeTool === 'brush' || activeTool === 'eraser') && (
            <div
              style={{
                left: mousePos.x,
                top: mousePos.y,
                width:
                  activeTool === 'brush'
                    ? toolSettings.brush.size
                    : toolSettings.eraser.size,
                height:
                  activeTool === 'brush'
                    ? toolSettings.brush.size
                    : toolSettings.eraser.size,
                transform: 'translate(-50%, -50%)',
              }}
              className="absolute pointer-events-none rounded-full border border-white shadow-[0_0_2px_rgba(0,0,0,0.8)]"
            />
          )}
        </div>
      </div>
    </div>
  );
};
