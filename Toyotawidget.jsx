import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Check, ShieldCheck, MonitorPlay, Camera, Lightbulb, Cog } from 'lucide-react';

const CAR_BASE_PRICE = 320500; // Precio base real del Yaris Hatchback Base CVT

// Colores típicos para este segmento
const COLORS = [
  { id: 'plata', name: 'Plata Metálico', hex: '#A9B0B3', price: 0, shadow: 'rgba(169,176,179,0.5)' },
  { id: 'blanco', name: 'Blanco', hex: '#F4F6F6', price: 0, shadow: 'rgba(255,255,255,0.5)' },
  { id: 'escarlata', name: 'Escarlata', hex: '#C61F2B', price: 0, shadow: 'rgba(198,31,43,0.5)' },
  { id: 'gris', name: 'Gris Oscuro', hex: '#4A4C4E', price: 0, shadow: 'rgba(74,76,78,0.5)' },
  { id: 'negro', name: 'Negro', hex: '#1A1A1C', price: 0, shadow: 'rgba(26,26,28,0.5)' },
];

const FEATURES = [
  { icon: ShieldCheck, label: 'Seguridad', desc: '7 Bolsas de aire + VSC' },
  { icon: MonitorPlay, label: 'Infoentretenimiento', desc: 'Pantalla 7" + CarPlay/Android' },
  { icon: Camera, label: 'Asistencia', desc: 'Cámara de reversa' },
  { icon: Lightbulb, label: 'Iluminación', desc: 'Faros y DRL LED' },
];

const PIXELS_PER_FRAME = 18;

const DEFAULT_SPIN = {
  frameCount: 36,
  url: (i) => `/frames/frame_${i}.webp`,
};

/** 360 por color: por defecto 36 webp; escarlata usa 8 JPG en /public/frames/ */
const SPIN_BY_COLOR = {
  escarlata: {
    frameCount: 8,
    url: (i) => `/frames/escarlata${i}.jpeg`,
  },
};

function getSpinForColor(colorId) {
  return SPIN_BY_COLOR[colorId] ?? DEFAULT_SPIN;
}

function wrapFrame(n, frameCount) {
  return ((n - 1 + frameCount) % frameCount) + 1;
}

export default function ToyotaWidget() {
  const [activeTab, setActiveTab] = useState('visual'); // 'visual' | 'specs' | 'cotizar'
  const [selectedColor, setSelectedColor] = useState(COLORS[0]); // Empezamos con Plata (como en la foto)
  const [enganche, setEnganche] = useState(20); // Porcentaje
  const [plazo, setPlazo] = useState(48); // Meses
  const [isHovering, setIsHovering] = useState(false);

  const [currentFrame, setCurrentFrame] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const dragAccum = useRef(0);
  const draggingRef = useRef(false);
  const spinRef = useRef(getSpinForColor(selectedColor.id));

  useEffect(() => {
    spinRef.current = getSpinForColor(selectedColor.id);
    setCurrentFrame(1);
  }, [selectedColor.id]);

  useEffect(() => {
    const preload = (count, urlFn) => {
      for (let i = 1; i <= count; i++) {
        const img = new Image();
        img.src = urlFn(i);
      }
    };
    preload(DEFAULT_SPIN.frameCount, DEFAULT_SPIN.url);
    Object.values(SPIN_BY_COLOR).forEach((spin) => preload(spin.frameCount, spin.url));
  }, []);

  const applyHorizontalDelta = (deltaX) => {
    const frameCount = spinRef.current.frameCount;
    dragAccum.current += deltaX;
    while (Math.abs(dragAccum.current) >= PIXELS_PER_FRAME) {
      const step = dragAccum.current > 0 ? 1 : -1;
      dragAccum.current -= step * PIXELS_PER_FRAME;
      setCurrentFrame((f) => wrapFrame(f + step, frameCount));
    }
  };

  const handleDragStart = (clientX) => {
    draggingRef.current = true;
    setIsDragging(true);
    startX.current = clientX;
    currentX.current = clientX;
    dragAccum.current = 0;
  };

  const handleDragMove = (clientX) => {
    if (!draggingRef.current) return;
    const deltaX = clientX - currentX.current;
    currentX.current = clientX;
    applyHorizontalDelta(deltaX);
  };

  const handleDragEnd = () => {
    draggingRef.current = false;
    setIsDragging(false);
  };

  // Cálculos financieros
  const totalPrice = CAR_BASE_PRICE + selectedColor.price;
  const engancheAmount = (totalPrice * enganche) / 100;
  const amountToFinance = totalPrice - engancheAmount;
  const interestRate = 0.1399; // 13.99% anual simulado
  const monthlyRate = interestRate / 12;
  
  // Fórmula de amortización
  const mensualidad = (amountToFinance * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -plazo));

  const formatMoney = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4 font-sans">
      {/* Contenedor principal del Widget - Simula el popup de "Ver Detalle" */}
      <div className="w-full max-w-[380px] bg-white rounded-3xl shadow-2xl overflow-hidden relative border border-gray-200">
        
        {/* Header Toyota */}
        <div className="bg-[#EB0A1E] px-5 py-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <img
              src="/logo-toyota.png"
              alt="Toyota"
              className="w-9 h-9 object-contain"
            />
            <div>
              <h2 className="text-base font-bold tracking-wider leading-none">Yaris Hatchback</h2>
              <p className="text-[11px] opacity-90 mt-1 font-medium">Base CVT 2024</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] opacity-80 uppercase tracking-wide">Desde</p>
            <p className="font-bold text-sm">{formatMoney(CAR_BASE_PRICE)}</p>
          </div>
        </div>

        {/* Zona del Vehículo (Visualizador Interactivo) */}
        <div
          className={`relative h-52 bg-gradient-to-b from-gray-50 to-gray-200 flex items-center justify-center overflow-hidden select-none touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ touchAction: 'none' }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            if (draggingRef.current) handleDragEnd();
          }}
          onMouseDown={(e) => {
            e.preventDefault();
            handleDragStart(e.clientX);
          }}
          onMouseMove={(e) => handleDragMove(e.clientX)}
          onMouseUp={handleDragEnd}
          onTouchStart={(e) => {
            if (e.touches.length !== 1) return;
            handleDragStart(e.touches[0].clientX);
          }}
          onTouchMove={(e) => {
            if (e.touches.length !== 1) return;
            handleDragMove(e.touches[0].clientX);
          }}
          onTouchEnd={handleDragEnd}
        >
          <div className={`absolute top-3 text-[11px] text-gray-500 font-medium transition-opacity duration-300 bg-white/60 px-3 py-1 rounded-full backdrop-blur-sm z-10 ${isHovering ? 'opacity-100' : 'opacity-0'}`}>
            Arrastra para rotar 360°
          </div>

          <div className="w-full max-w-[280px] px-4 flex items-center justify-center">
            <img
              src={getSpinForColor(selectedColor.id).url(currentFrame)}
              alt="Toyota Yaris — vista 360"
              className="w-full h-auto object-contain pointer-events-none drop-shadow-2xl"
              draggable={false}
            />
          </div>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button 
            onClick={() => setActiveTab('visual')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'visual' ? 'text-[#EB0A1E] border-b-2 border-[#EB0A1E] bg-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Color
          </button>
          <button 
            onClick={() => setActiveTab('specs')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'specs' ? 'text-[#EB0A1E] border-b-2 border-[#EB0A1E] bg-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Detalles
          </button>
          <button 
            onClick={() => setActiveTab('cotizar')}
            className={`flex-1 py-3 text-[11px] font-bold uppercase tracking-wider transition-colors ${activeTab === 'cotizar' ? 'text-[#EB0A1E] border-b-2 border-[#EB0A1E] bg-white' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Cotizar
          </button>
        </div>

        {/* Contenido Dinámico */}
        <div className="p-6 h-[240px] overflow-y-auto">
          
          {/* TAB 1: VISUAL (COLORES) */}
          {activeTab === 'visual' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="text-center mb-6">
                <p className="text-sm text-gray-500 mb-1">Color Exterior</p>
                <p className="font-bold text-gray-800 text-lg">{selectedColor.name}</p>
              </div>
              
              {/* Selector de Colores */}
              <div className="flex justify-center gap-4 mt-4">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border border-gray-300 ${selectedColor.id === color.id ? 'ring-2 ring-offset-2 ring-[#EB0A1E] scale-110 shadow-lg' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Seleccionar color ${color.name}`}
                  >
                    {selectedColor.id === color.id && (
                      <Check size={18} color={['#F4F6F6', '#A9B0B3'].includes(color.hex) ? '#000' : '#fff'} />
                    )}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setActiveTab('specs')}
                className="w-full mt-8 text-[#EB0A1E] text-sm font-semibold hover:underline flex items-center justify-center gap-1"
              >
                Ver características principales <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* TAB 2: SPECS (Matando la viñeta aburrida) */}
          {activeTab === 'specs' && (
            <div className="animate-in fade-in duration-300 h-full flex flex-col">
              <h3 className="text-sm font-bold text-gray-800 mb-4">Equipamiento Destacado</h3>
              <div className="grid grid-cols-2 gap-3 flex-1">
                {FEATURES.map((feat, idx) => {
                  const Icon = feat.icon;
                  return (
                    <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col gap-2">
                      <div className="bg-white w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-[#EB0A1E]">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">{feat.label}</p>
                        <p className="text-xs font-bold text-gray-800 leading-tight mt-0.5">{feat.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button 
                onClick={() => setActiveTab('cotizar')}
                className="w-full mt-4 bg-gray-900 text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Calcular Mensualidad
              </button>
            </div>
          )}

          {/* TAB 3: COTIZAR */}
          {activeTab === 'cotizar' && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-300 flex flex-col h-full">
              <div className="space-y-5 flex-1">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-2">
                    <span>Enganche ({enganche}%)</span>
                    <span className="text-[#EB0A1E]">{formatMoney(engancheAmount)}</span>
                  </div>
                  <input 
                    type="range" min="10" max="50" step="5" value={enganche}
                    onChange={(e) => setEnganche(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#EB0A1E]"
                  />
                  <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>10%</span><span>50%</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-700 mb-2">Plazo (Meses)</p>
                  <div className="flex justify-between gap-2">
                    {[24, 36, 48, 60].map(m => (
                      <button 
                        key={m} onClick={() => setPlazo(m)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${plazo === m ? 'bg-[#EB0A1E] text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Resumen Final */}
              <div className="bg-gray-900 text-white p-4 rounded-xl mt-4">
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Pago Mensual Estimado</p>
                    <p className="text-2xl font-bold text-white leading-none">{formatMoney(mensualidad)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400">Total a financiar</p>
                    <p className="text-xs font-semibold">{formatMoney(amountToFinance)}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer / Call to Action Fijo */}
        <div className="p-4 bg-white border-t border-gray-100">
           <button className="w-full bg-[#EB0A1E] text-white py-3.5 rounded-xl text-sm font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
              Continuar Compra
           </button>
        </div>

      </div>
    </div>
  );
}