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

        {/* Zona del Vehículo (Visualizador Interactivo) — estudio tipo showroom */}
        <div
          className={`relative isolate flex min-h-[13.5rem] h-[13.5rem] w-full flex-col overflow-hidden select-none touch-none sm:min-h-[15rem] sm:h-[15rem] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
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
          {/* Softbox / spotlight en la pared */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_88%_72%_at_50%_34%,#ffffff_0%,#f4f6f8_28%,#e8ecf0_52%,#cfd6dd_78%,#9aa5b0_100%)]"
            aria-hidden
          />
          {/* Viñeta para profundidad */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_115%_100%_at_50%_48%,transparent_42%,rgba(55,65,81,0.14)_88%,rgba(31,41,55,0.22)_100%)]"
            aria-hidden
          />

          <div
            className={`pointer-events-none absolute left-1/2 top-2.5 z-20 -translate-x-1/2 text-[11px] font-medium text-gray-600 transition-opacity duration-300 sm:top-3 ${isHovering ? 'opacity-100' : 'opacity-0'} rounded-full bg-white/70 px-3 py-1 shadow-sm backdrop-blur-sm`}
          >
            Arrastra para rotar 360°
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-end px-3 pb-1.5 pt-8 sm:px-5 sm:pb-2 sm:pt-9">
            <div className="relative mx-auto w-full max-w-[280px]">
              {/* Sombra de contacto en el piso */}
              <div
                className="pointer-events-none absolute bottom-[4%] left-1/2 z-0 h-4 w-[76%] max-w-[210px] -translate-x-1/2 rounded-full bg-black/40 blur-md sm:bottom-[5%] sm:h-5 sm:max-w-[230px] sm:blur-lg"
                aria-hidden
              />

              <div className="relative z-[1] flex flex-col items-center">
                <img
                  key={`car-${selectedColor.id}-${currentFrame}`}
                  src={getSpinForColor(selectedColor.id).url(currentFrame)}
                  alt="Toyota Yaris — vista 360"
                  className="relative z-[2] h-auto w-full max-h-[6.25rem] object-contain object-bottom pointer-events-none sm:max-h-[7.25rem] [filter:drop-shadow(0_20px_32px_rgba(15,23,42,0.34))_drop-shadow(0_10px_18px_rgba(0,0,0,0.22))_drop-shadow(0_4px_10px_rgba(0,0,0,0.16))_drop-shadow(0_1px_3px_rgba(0,0,0,0.12))]"
                  draggable={false}
                />
                {/* Reflejo en piso (showroom) */}
                <div
                  className="pointer-events-none relative -mt-0.5 flex w-[94%] justify-center overflow-hidden sm:-mt-1 sm:w-[92%]"
                  style={{
                    height: 'clamp(2rem, 9vw, 2.75rem)',
                    WebkitMaskImage:
                      'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 38%, rgba(0,0,0,0.12) 68%, transparent 100%)',
                    maskImage:
                      'linear-gradient(to bottom, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.38) 38%, rgba(0,0,0,0.12) 68%, transparent 100%)',
                  }}
                  aria-hidden
                >
                  <img
                    key={`refl-${selectedColor.id}-${currentFrame}`}
                    src={getSpinForColor(selectedColor.id).url(currentFrame)}
                    alt=""
                    className="h-auto w-full max-h-[6.25rem] -scale-y-100 object-contain object-bottom opacity-[0.16] sm:max-h-[7.25rem] sm:opacity-[0.2]"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
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