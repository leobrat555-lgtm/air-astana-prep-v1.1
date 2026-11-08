import React, { useRef, useState, useEffect } from 'react';
import { Pen, Eraser, Trash2, X, Minimize2, Check } from 'lucide-react';

interface KneeboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  nightMode?: boolean;
}

export const KneeboardModal: React.FC<KneeboardModalProps> = ({ isOpen, onClose, nightMode = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [penColor, setPenColor] = useState<string>(nightMode ? '#34D399' : '#2563EB');
  const [lineWidth, setLineWidth] = useState<number>(3);

  // Sync canvas dimensions
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [isOpen]);

  if (!isOpen) return null;

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.lineWidth = 24;
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = penColor;
      ctx.lineWidth = lineWidth;
    }

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Kneeboard Pad Container */}
      <div className={`relative z-10 w-full max-w-lg mx-auto rounded-t-3xl shadow-2xl border-t border-x flex flex-col h-[75vh] max-h-[640px] transition-colors ${
        nightMode 
          ? 'bg-[#0B132B]/95 border-emerald-900/50 text-emerald-400' 
          : 'bg-white/95 border-slate-200 text-slate-800'
      }`}>
        {/* Top Control Bar */}
        <div className="px-4 py-3 border-b flex items-center justify-between border-slate-200/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-cockpit font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
              <span>📋</span> KNEEBOARD SCRATCHPAD
            </span>
            <span className="text-[10px] font-mono-avionics text-slate-400">
              (Descent & Crosswind Math)
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setTool('pen')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'pen'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title="Перо"
            >
              <Pen className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setTool('eraser')}
              className={`p-2 rounded-xl text-xs font-bold transition-all ${
                tool === 'eraser'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
              title="Ластик"
            >
              <Eraser className="w-3.5 h-3.5" />
            </button>

            {/* Color Swatches */}
            <div className="flex items-center gap-1 px-1.5 py-1 bg-slate-100 rounded-xl">
              {['#2563EB', '#10B981', '#F59E0B', '#EF4444'].map((c) => (
                <button
                  key={c}
                  onClick={() => { setPenColor(c); setTool('pen'); }}
                  style={{ backgroundColor: c }}
                  className={`w-4 h-4 rounded-full transition-transform ${penColor === c && tool === 'pen' ? 'scale-125 ring-2 ring-slate-400' : 'opacity-70'}`}
                />
              ))}
            </div>

            <button
              onClick={handleClear}
              className="p-2 rounded-xl bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-600 transition-colors"
              title="Очистить"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-colors ml-1"
              title="Свернуть"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Drawing Surface Canvas */}
        <div className="flex-1 relative overflow-hidden bg-transparent touch-none cursor-crosshair">
          <canvas
            ref={canvasRef}
            className="w-full h-full block"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={stopDraw}
            onMouseLeave={stopDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={stopDraw}
          />
        </div>

        {/* Bottom Quick-Formula Bar */}
        <div className="px-4 py-2 border-t border-slate-200/60 bg-slate-50/70 text-[10px] font-mono-avionics text-slate-500 flex items-center justify-between">
          <span className="font-semibold text-slate-700">Quick Formulas:</span>
          <span className="text-blue-700 font-bold">ROD = GS × 5</span>
          <span className="text-amber-700 font-bold">TOD = ΔFL × 3</span>
          <span className="text-emerald-700 font-bold">Sin(30°) = 0.50</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-blue-600 text-white rounded-lg font-cockpit font-bold text-xs shadow-xs"
          >
            Готово
          </button>
        </div>
      </div>
    </div>
  );
};
