import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, Check } from 'lucide-react';

/** Versiones oficiales Yaris Hatchback (MX) — el valor del artefacto vs. solo color en toyota.mx */
const VERSIONS = [
  {
    id: 'base-cvt',
    shortLabel: 'Base CVT',
    fullName: 'Yaris Hatchback Base CVT',
    price: 320500,
    highlights: [
      '7 bolsas de aire',
      'Cámara de reversa',
      'Pantalla táctil de 7"',
      'Control de Estabilidad de Vehículo (VSC)',
      'Faros y luces delanteras LED',
      'Transmisión CVT',
    ],
    sections: [
      {
        title: 'Características generales',
        items: [
          '7 bolsas de aire',
          'Cámara de reversa',
          'Pantalla táctil de 7"',
          'Control de Estabilidad de Vehículo (VSC)',
          'Faros y luces delanteras LED',
          'Transmisión CVT',
        ],
      },
      {
        title: 'Exterior',
        items: [
          'Antena en toldo',
          'Defensa delantera y trasera al color de la carrocería',
          'Desempañador',
          'Espejos al color de la carrocería, abatibles manualmente y con ajuste eléctrico',
          'Faros y luces delanteras LED',
          'Luces diurnas (DRL) con tira LED',
          'Manijas al color de la carrocería',
          'Parrilla frontal piano black',
        ],
      },
      {
        title: 'Interior',
        items: [
          'Aire acondicionado manual',
          'Asiento conductor tipo cubo, ajuste manual 4 direcciones',
          'Asiento pasajero tipo cubo, ajuste manual 4 direcciones',
          'Segunda fila tipo banca abatible',
          'Cámara de reversa',
          'Conectores frontales 12 V (1) y USB (1)',
          'Controles al volante',
          'Espejo retrovisor día/noche',
          'Iluminación interior de cortesía',
          'Portavasos (6)',
          'Android Auto® y Apple CarPlay®',
          'Audio AM/FM, MP3/WMA/AAC, pantalla 7", USB y 4 bocinas',
          'Bluetooth®',
          'Ventanas eléctricas (conductor un toque adelante)',
          'Vestiduras de tela',
          'Viseras con espejo',
        ],
      },
      {
        title: 'Seguridad',
        items: [
          'Alarma e inmovilizador',
          'Bolsas de aire frontales (2), laterales (2), rodillas (1) y cortina (2)',
          'Cinturones delanteros 3 puntos con pretensor y ELR',
          'Cinturones traseros 3 puntos con ELR',
          'Control remoto',
          'Seguros eléctricos y seguros para niños en puertas traseras',
          'TPMS',
          'ISO-FIX / LATCH',
        ],
      },
    ],
  },
  {
    id: 's-mt',
    shortLabel: 'S MT',
    fullName: 'Yaris Hatchback S MT',
    price: 351000,
    highlights: [
      'Transmisión manual 5 velocidades',
      'Asiento conductor 6 direcciones',
      '2 USB-C traseros',
      'Espejos eléctricos con luces direccionales',
      'Faros de niebla LED',
      'Faros y DRL LED',
    ],
    sections: [
      {
        title: 'Características generales',
        items: [
          'Transmisión manual con 5 velocidades',
          'Asiento conductor tipo cubo, ajuste manual 6 direcciones',
          'Conectores traseros USB tipo C (2)',
          'Espejos al color, abatibles eléctricamente, ajuste eléctrico y luces direccionales',
          'Faros de niebla LED',
        ],
      },
      {
        title: 'Exterior',
        items: [
          'Antena en toldo',
          'Defensas al color de la carrocería',
          'Desempañador',
          'Espejos eléctricos con luces direccionales',
          'Faros de niebla LED',
          'Faros y luces delanteras LED',
          'DRL con tira LED',
          'Manijas al color',
          'Parrilla frontal piano black',
        ],
      },
      {
        title: 'Interior',
        items: [
          'Aire acondicionado manual',
          'Asientos tipo cubo (conductor 6 / pasajero 4 direcciones)',
          'Segunda fila banca abatible',
          'Cámara de reversa',
          '12 V y USB frontales; 2 USB-C traseros',
          'Controles al volante',
          'Palanca forrada en piel',
          'Pantalla multiinformación (MID)',
          'Portavasos (6)',
          'Android Auto® y Apple CarPlay®',
          'Audio con pantalla táctil 7", 4 bocinas',
          'Bluetooth®',
          'Ventanas eléctricas',
          'Vestiduras tela / piel sintética',
          'Volante forrado en piel',
        ],
      },
      {
        title: 'Seguridad',
        items: [
          'Alarma, inmovilizador y birlos de seguridad',
          '7 bolsas de aire (frontales, laterales, rodilla, cortina)',
          'Cinturones con pretensor y ELR',
          'Seguros eléctricos, seguro niños trasero',
          'TPMS',
          'ISO-FIX / LATCH',
        ],
      },
    ],
  },
  {
    id: 's-cvt',
    shortLabel: 'S CVT',
    fullName: 'Yaris Hatchback S CVT',
    price: 377300,
    highlights: [
      'Toyota Safety Sense (TSS)',
      'Pantalla multiinformación 4.2"',
      'Espejos eléctricos con direccionales',
      'Faros de niebla LED',
      '2 USB-C traseros',
      'Transmisión CVT',
    ],
    sections: [
      {
        title: 'Características generales',
        items: [
          'Toyota Safety Sense (TSS)',
          'Espejos al color, abatibles eléctricamente, ajuste eléctrico y luces direccionales',
          'Pantalla multi información 4.2"',
        ],
      },
      {
        title: 'Exterior',
        items: [
          'Antena en toldo',
          'Defensas al color',
          'Desempañador',
          'Espejos eléctricos con luces direccionales',
          'Faros de niebla LED',
          'Faros y luces delanteras LED',
          'DRL con tira LED',
          'Manijas al color',
          'Parrilla piano black',
        ],
      },
      {
        title: 'Interior',
        items: [
          'Aire acondicionado manual',
          'Asientos cubo (conductor 6 / pasajero 4 direcciones)',
          'Segunda fila abatible',
          'Cámara de reversa',
          '12 V, USB frontal y 2 USB-C traseros',
          'Controles al volante',
          'Palanca forrada en piel',
          'MID 4.2"',
          'Portavasos (6)',
          'Android Auto® y Apple CarPlay®',
          'Audio pantalla 7", 4 bocinas',
          'Bluetooth®',
          'Ventanas eléctricas',
          'Vestiduras tela / piel sintética',
          'Volante en piel',
        ],
      },
      {
        title: 'Seguridad',
        items: [
          'Alarma, inmovilizador y birlos',
          '7 bolsas de aire',
          'Cinturones con pretensor y ELR',
          'Seguros eléctricos y seguro niños',
          'TPMS',
          'ISO-FIX / LATCH',
          'TSS: Pre-Colisión (PCS) y Alerta de Cambio de Carril (LDA)',
        ],
      },
    ],
  },
];

/** Filas para comparar versiones (lo que Toyota quiere destacar vs. solo color). */
const COMPARE_ROWS = [
  { label: 'Transmisión', key: 'trans' },
  { label: 'Toyota Safety Sense', key: 'tss' },
  { label: 'Asiento conductor', key: 'asiento' },
  { label: 'Espejos laterales', key: 'espejos' },
  { label: 'Faros de niebla LED', key: 'niebla' },
  { label: 'Pantalla MID', key: 'mid' },
  { label: 'USB-C traseros', key: 'usbc' },
  { label: 'Vestiduras', key: 'vest' },
];

const COMPARE_VALUES = {
  'base-cvt': {
    trans: 'CVT',
    tss: '—',
    asiento: '4 direcciones',
    espejos: 'Abatibles manual / ajuste eléctrico',
    niebla: '—',
    mid: '—',
    usbc: '—',
    vest: 'Tela',
  },
  's-mt': {
    trans: 'Manual 5 vel.',
    tss: '—',
    asiento: '6 direcciones',
    espejos: 'Eléctricos + direccionales',
    niebla: 'Sí',
    mid: 'Sí',
    usbc: '2',
    vest: 'Tela / piel sintética',
  },
  's-cvt': {
    trans: 'CVT',
    tss: 'Sí (PCS, LDA)',
    asiento: '6 direcciones',
    espejos: 'Eléctricos + direccionales',
    niebla: 'Sí',
    mid: '4.2"',
    usbc: '2',
    vest: 'Tela / piel sintética',
  },
};

// Colores típicos para este segmento
const COLORS = [
  { id: 'plata', name: 'Plata Metálico', hex: '#A9B0B3', price: 0, shadow: 'rgba(169,176,179,0.5)' },
  { id: 'blanco', name: 'Blanco', hex: '#F4F6F6', price: 0, shadow: 'rgba(255,255,255,0.5)' },
  { id: 'cemento', name: 'Gris cemento', hex: '#8E9398', price: 0, shadow: 'rgba(142,147,152,0.5)' },
  { id: 'escarlata', name: 'Escarlata', hex: '#C61F2B', price: 0, shadow: 'rgba(198,31,43,0.5)' },
  { id: 'gris', name: 'Gris Oscuro', hex: '#4A4C4E', price: 0, shadow: 'rgba(74,76,78,0.5)' },
  { id: 'negro', name: 'Negro', hex: '#1A1A1C', price: 0, shadow: 'rgba(26,26,28,0.5)' },
];

const PIXELS_PER_FRAME = 18;

const SPIN_FRAME_COUNT = 8;

/** Cada color usa /public/frames/{id}1.jpeg … {id}8.jpeg (misma secuencia 360°). */
const SPIN_BY_COLOR = Object.fromEntries(
  COLORS.map(({ id }) => [
    id,
    {
      frameCount: SPIN_FRAME_COUNT,
      url: (i) => `/frames/${id}${i}.jpeg`,
    },
  ])
);

/** Respaldo si se añade un color sin carpeta de frames (36 webp genéricos). */
const DEFAULT_SPIN = {
  frameCount: 36,
  url: (i) => `/frames/frame_${i}.webp`,
};

function getSpinForColor(colorId) {
  return SPIN_BY_COLOR[colorId] ?? DEFAULT_SPIN;
}

function wrapFrame(n, frameCount) {
  return ((n - 1 + frameCount) % frameCount) + 1;
}

export default function ToyotaWidget() {
  const [selectedVersion, setSelectedVersion] = useState(VERSIONS[0]);
  const [activeTab, setActiveTab] = useState('compare'); // 'compare' | 'visual' | 'cotizar'
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
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

  // Cálculos financieros (precio según versión + color)
  const totalPrice = selectedVersion.price + selectedColor.price;
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
              <p className="text-[11px] opacity-90 mt-1 font-medium leading-tight">
                {selectedVersion.shortLabel} · 2024
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] opacity-80 uppercase tracking-wide">Desde</p>
            <p className="font-bold text-sm">{formatMoney(selectedVersion.price)}</p>
          </div>
        </div>

        {/* Visualizador 360 — fondo #fff alineado con el blanco de las fotos oficiales */}
        <div
          className={`relative isolate flex min-h-[16rem] h-[16rem] w-full flex-col overflow-hidden bg-[#FFFFFF] select-none touch-none sm:min-h-[17.5rem] sm:h-[17.5rem] ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          style={{ touchAction: 'none', backgroundColor: '#FFFFFF' }}
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
          <div
            className={`pointer-events-none absolute left-1/2 top-2.5 z-20 -translate-x-1/2 text-[11px] font-medium text-gray-600 transition-opacity duration-300 sm:top-3 ${isHovering ? 'opacity-100' : 'opacity-0'} rounded-full border border-gray-200/80 bg-white/90 px-3 py-1 shadow-sm backdrop-blur-sm`}
          >
            Arrastra para rotar 360°
          </div>

          <div className="relative z-10 flex min-h-0 flex-1 flex-col items-center justify-end px-1.5 pb-1 pt-7 sm:px-3 sm:pb-1.5 sm:pt-8">
            <div className="relative mx-auto w-full max-w-[min(100%,360px)]">
              {/* Sombra de contacto (sutil sobre blanco puro) */}
              <div
                className="pointer-events-none absolute bottom-[3%] left-1/2 z-0 h-5 w-[82%] max-w-[280px] -translate-x-1/2 rounded-full bg-black/28 blur-md sm:bottom-[4%] sm:h-6 sm:max-w-[300px] sm:blur-lg"
                aria-hidden
              />

              <div className="relative z-[1] flex flex-col items-center">
                <img
                  key={`car-${selectedColor.id}-${currentFrame}`}
                  src={getSpinForColor(selectedColor.id).url(currentFrame)}
                  alt="Toyota Yaris — vista 360"
                  className="relative z-[2] h-auto w-full max-h-[8.75rem] object-contain object-bottom pointer-events-none sm:max-h-[10.5rem] [filter:drop-shadow(0_18px_28px_rgba(15,23,42,0.22))_drop-shadow(0_8px_14px_rgba(0,0,0,0.14))_drop-shadow(0_2px_6px_rgba(0,0,0,0.1))]"
                  draggable={false}
                />
                <div
                  className="pointer-events-none relative -mt-0.5 flex w-[96%] justify-center overflow-hidden sm:-mt-1 sm:w-[94%]"
                  style={{
                    height: 'clamp(2.35rem, 11vw, 3.35rem)',
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
                    className="h-auto w-full max-h-[8.75rem] -scale-y-100 object-contain object-bottom opacity-[0.14] sm:max-h-[10.5rem] sm:opacity-[0.18]"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Selector de versión (prioridad vs. sitio Toyota: valor en VERSIONES) */}
        <div className="border-b border-gray-200 bg-gray-50 px-2 py-2.5">
          <p className="mb-2 text-center text-[9px] font-bold uppercase tracking-widest text-gray-500">
            Elige versión
          </p>
          <div className="flex gap-1.5">
            {VERSIONS.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setSelectedVersion(v)}
                className={`min-w-0 flex-1 rounded-xl border px-1.5 py-2 text-left transition-all ${
                  selectedVersion.id === v.id
                    ? 'border-[#EB0A1E] bg-white shadow-md ring-1 ring-[#EB0A1E]/30'
                    : 'border-gray-200 bg-white/80 hover:border-gray-300'
                }`}
              >
                <span className="block truncate text-[10px] font-bold leading-tight text-gray-900">
                  {v.shortLabel}
                </span>
                <span className="mt-0.5 block text-[10px] font-semibold text-[#EB0A1E]">
                  {formatMoney(v.price)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Pestañas: comparar / color / cotizar */}
        <div className="flex border-b border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={() => setActiveTab('compare')}
            className={`min-w-0 flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors sm:text-[11px] sm:tracking-wider ${activeTab === 'compare' ? 'border-b-2 border-[#EB0A1E] bg-white text-[#EB0A1E]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Comparar
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visual')}
            className={`min-w-0 flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors sm:text-[11px] sm:tracking-wider ${activeTab === 'visual' ? 'border-b-2 border-[#EB0A1E] bg-white text-[#EB0A1E]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Color
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cotizar')}
            className={`min-w-0 flex-1 py-2.5 text-[10px] font-bold uppercase tracking-wide transition-colors sm:text-[11px] sm:tracking-wider ${activeTab === 'cotizar' ? 'border-b-2 border-[#EB0A1E] bg-white text-[#EB0A1E]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Cotizar
          </button>
        </div>

        {/* Contenido Dinámico */}
        <div className="h-[260px] overflow-y-auto p-5 sm:h-[280px]">
          {/* TAB: COMPARAR — tabla + ficha de la versión activa */}
          {activeTab === 'compare' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-widest text-[#EB0A1E]">
                Versiones
              </p>
              <h3 className="mb-3 text-center text-sm font-bold text-gray-900">
                Comparativa rápida
              </h3>

              <div className="overflow-x-auto rounded-xl border border-gray-200">
                <table className="w-full min-w-[280px] border-collapse text-left text-[9px] sm:text-[10px]">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="px-1.5 py-2 font-semibold text-gray-600" />
                      {VERSIONS.map((v) => (
                        <th key={v.id} className="max-w-[4.5rem] px-0.5 py-1">
                          <button
                            type="button"
                            onClick={() => setSelectedVersion(v)}
                            className={`w-full rounded-lg px-0.5 py-1.5 text-center text-[9px] font-bold leading-tight transition-colors sm:text-[10px] ${
                              selectedVersion.id === v.id
                                ? 'bg-[#EB0A1E]/10 text-[#EB0A1E]'
                                : 'text-gray-800 hover:bg-gray-100'
                            }`}
                          >
                            {v.shortLabel}
                          </button>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARE_ROWS.map((row) => (
                      <tr key={row.key} className="border-b border-gray-100 last:border-0">
                        <td className="px-1.5 py-1.5 font-medium text-gray-600">{row.label}</td>
                        {VERSIONS.map((v) => (
                          <td
                            key={v.id}
                            className={`px-1 py-1.5 text-center leading-tight text-gray-800 ${
                              selectedVersion.id === v.id ? 'bg-red-50/50 font-semibold' : ''
                            }`}
                          >
                            {COMPARE_VALUES[v.id][row.key]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 rounded-xl border border-gray-100 bg-gray-50/80 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                  Tu versión · {selectedVersion.shortLabel}
                </p>
                <p className="mt-1 text-xs font-bold text-gray-900">{selectedVersion.fullName}</p>
                <ul className="mt-2 list-inside list-disc space-y-0.5 text-[11px] text-gray-700">
                  {selectedVersion.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 space-y-3">
                {selectedVersion.sections.map((sec) => (
                  <div key={sec.title}>
                    <h4 className="mb-1.5 border-b border-gray-200 pb-0.5 text-[10px] font-bold uppercase tracking-wide text-gray-800">
                      {sec.title}
                    </h4>
                    <ul className="list-inside list-disc space-y-0.5 text-[10px] leading-snug text-gray-600">
                      {sec.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('cotizar')}
                className="mt-5 w-full rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
              >
                Calcular mensualidad
              </button>
            </div>
          )}

          {/* TAB: COLOR (secundario) */}
          {activeTab === 'visual' && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="mb-1 text-center text-[10px] text-gray-500">
                Complemento visual · mismo 360° en todos los colores
              </p>
              <div className="mb-5 text-center">
                <p className="text-sm text-gray-500">Color exterior</p>
                <p className="text-lg font-bold text-gray-800">{selectedColor.name}</p>
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-300 transition-all duration-300 ${selectedColor.id === color.id ? 'scale-110 shadow-lg ring-2 ring-[#EB0A1E] ring-offset-2' : 'hover:scale-105'}`}
                    style={{ backgroundColor: color.hex }}
                    aria-label={`Seleccionar color ${color.name}`}
                  >
                    {selectedColor.id === color.id && (
                      <Check
                        size={18}
                        color={['#F4F6F6', '#A9B0B3'].includes(color.hex) ? '#000' : '#fff'}
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('compare')}
                className="mt-8 flex w-full items-center justify-center gap-1 text-sm font-semibold text-[#EB0A1E] hover:underline"
              >
                Volver a comparar versiones <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* TAB: COTIZAR */}
          {activeTab === 'cotizar' && (
            <div className="animate-in fade-in slide-in-from-left-4 flex h-full flex-col duration-300">
              <div className="mb-4 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
                  Versión seleccionada
                </p>
                <p className="text-xs font-bold text-gray-900">{selectedVersion.fullName}</p>
                <p className="text-[11px] text-[#EB0A1E]">
                  Precio lista {formatMoney(selectedVersion.price)}
                </p>
              </div>
              <div className="flex-1 space-y-5">
                <div>
                  <div className="mb-2 flex justify-between text-xs font-bold text-gray-700">
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