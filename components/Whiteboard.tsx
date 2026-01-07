
import React, { useRef, useEffect, useState } from 'react';

const Whiteboard: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#6366f1');
  const [lineWidth, setLineWidth] = useState(4);
  const [isEraser, setIsEraser] = useState(false);
  const [tool, setTool] = useState<'pen' | 'rect' | 'circle'>('pen');
  const [history, setHistory] = useState<string[]>([]);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Simulated active collaborators
  const [collaborators] = useState([
    { id: '1', name: 'Alex', color: '#10b981', x: 200, y: 300 },
    { id: '2', name: 'Emily', color: '#ef4444', x: 450, y: 150 }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        const temp = ctx.getImageData(0, 0, canvas.width, canvas.height);
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.putImageData(temp, 0, 0);
      }
    };

    window.addEventListener('resize', resize);
    resize();
    return () => window.removeEventListener('resize', resize);
  }, []);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      setHistory(prev => [...prev.slice(-19), canvas.toDataURL()]);
    }
  };

  const getPointerPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : (e as React.MouseEvent).clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : (e as React.MouseEvent).clientY - rect.top;
    return { x, y };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { x, y } = getPointerPos(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setStartPos({ x, y });
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = isEraser ? '#ffffff' : color;
    ctx.lineWidth = lineWidth;
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getPointerPos(e);

    if (tool === 'pen') {
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // For shapes, we'd ideally use a preview canvas, but for simplicity:
      // We undo to last history point and draw fresh shape
      // This is simplified here to avoid heavy canvas overhead in a demo
      if (tool === 'rect') {
        // Simple visual feedback is harder without a second layer, sticking to pen for core smoothness
        ctx.lineTo(x, y);
        ctx.stroke();
      }
    }
  };

  const stopDrawing = () => {
    if (isDrawing) saveToHistory();
    setIsDrawing(false);
  };

  const undo = () => {
    const canvas = canvasRef.current;
    if (!canvas || history.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const last = history[history.length - 1];
    const img = new Image();
    img.src = last;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    setHistory(prev => prev.slice(0, -1));
  };

  return (
    <div className="relative w-full h-full bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-slate-100 group">
      {/* Collaboration Overlay */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {collaborators.map(c => (
          <div key={c.id} className="absolute transition-all duration-300" style={{ left: c.x, top: c.y }}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill={c.color} stroke="white" strokeWidth="2">
              <path d="M2.5 2.5L21.5 12L12 14.5L2.5 2.5Z" />
            </svg>
            <div className="px-2 py-0.5 rounded bg-slate-900 text-white text-[8px] font-black uppercase whitespace-nowrap -ml-2 -mt-1 shadow-lg border border-white/10">
              {c.name} is drawing...
            </div>
          </div>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={stopDrawing}
        className="cursor-crosshair w-full h-full touch-none"
      />
      
      {/* Toolbar */}
      <div className="absolute top-6 left-6 flex flex-col gap-4 glass p-4 rounded-[2rem] shadow-2xl border border-white/50 z-20">
        <div className="grid grid-cols-2 gap-2">
          {['#6366f1', '#10b981', '#ef4444', '#f59e0b', '#000000', '#ec4899'].map((c) => (
            <button
              key={c}
              onClick={() => { setColor(c); setIsEraser(false); }}
              className={`w-8 h-8 rounded-full border-2 transition-all ${color === c && !isEraser ? 'scale-110 shadow-lg border-white ring-2 ring-slate-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        
        <div className="w-full h-px bg-slate-200/50" />

        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setIsEraser(!isEraser)}
            className={`p-3 rounded-2xl transition-all ${isEraser ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
          <button onClick={undo} className="p-3 bg-slate-100 text-slate-500 hover:bg-slate-200 rounded-2xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" /></svg>
          </button>
          <button onClick={() => { 
            const canvas = canvasRef.current;
            if (canvas) {
              const ctx = canvas.getContext('2d');
              ctx?.clearRect(0, 0, canvas.width, canvas.height);
              saveToHistory();
            }
          }} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          </button>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6 bg-slate-900/90 backdrop-blur-xl text-white px-8 py-4 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10">
        <div className="flex flex-col gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400">Brush Size</span>
          <input 
            type="range" min="1" max="40" 
            value={lineWidth} 
            onChange={(e) => setLineWidth(Number(e.target.value))}
            className="w-40 h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-400"
          />
        </div>
        <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
          <div 
            style={{ 
              width: `${lineWidth}px`, 
              height: `${lineWidth}px`, 
              backgroundColor: isEraser ? '#ffffff' : color,
              borderRadius: '50%'
            }} 
          />
        </div>
      </div>
    </div>
  );
};

export default Whiteboard;
