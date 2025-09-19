import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TimelineVillaBonita from "./TimelineVillaBonita";

type Props = {
  items?: Array<{
    year: string;
    title: string;
    subtitle?: string;
    description?: string;
    image: string;
  }>;
  positions?: number;
  height?: number;
};

const HistoryCarrusel = ({ items = [], positions = 4, height = 600 }: Props) => {
  const [currentX, setCurrentX] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Lee tamaños en vivo
  const [containerW, setContainerW] = useState(0);
  const [contentW, setContentW] = useState(0);

  const update = () => {
    setContainerW(containerRef.current?.offsetWidth ?? 0);
    setContentW(contentRef.current?.scrollWidth ?? 0);
  };

  // Observa cambios de tamaño del contenedor y contenido
  useEffect(() => {
    const updateAll = () => update();
    updateAll();
    const ro = new ResizeObserver(updateAll);
    if (containerRef.current) ro.observe(containerRef.current);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener("resize", updateAll);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateAll);
    };
  }, []);

  const maxX = Math.max(0, contentW - containerW);

  const page = (dir: -1 | 1) => {
    setCurrentX((prev) => {
      const next = prev + dir * containerW;
      return clamp(next, 0, maxX);
    });
  };

  const goToIndex = (index: number) => {
    const section = positions > 1 ? maxX / (positions - 1) : 0;
    setCurrentX(clamp(index * section, 0, maxX));
  };

  // Gap y ancho mínimo responsivos
  const responsiveMinGap = containerW < 640 ? 240 : containerW < 1024 ? 180 : 220;

  // Recalcula cuando cambian los items o cambia el gap responsivo
  useEffect(() => {
    requestAnimationFrame(() => update());
  }, [items.length, responsiveMinGap]);
  // Si hay N items, este ancho evita que se amontonen; nunca menor al ancho visible
  const computedMinWidth = Math.max(
    containerW || 1600,
    items.length > 1
      ? (items.length - 1) * responsiveMinGap + (window.innerWidth >= 768 ? 280 : 300)
      : containerW || 1200
  );

  // Alto del timeline (no del carrusel) para que respire en pantallas chicas
  const timelineHeight = Math.min(Math.max(480, Math.round((containerW || 3900) * 0.32)), 520);

  const activeIndex = useMemo(() => {
    if (positions <= 1 || maxX === 0) return 1;
    const section = maxX / (positions - 1);
    return Math.min(Math.floor(currentX / section + 1), positions);
  }, [currentX, maxX, positions]);

  return (
    <div className=" py-10 bg-transparent relative overflow-hidden">
      {/* Encabezado */}
      <div className="w-full md:w-[68%] z-[9999]">
        <div className="bg-[#fbd323] inset-0 py-5 md:py-8 md:rounded-r-2xl pr-[4.4rem] tracking-wide">
          <h2 className="text-3xl md:text-5xl font-semibold text-right text-[#1d1551]">Historia y Misión</h2>
        </div>
      </div>

      <div className="pt-20 pb-8 px-0">
        <div
          ref={containerRef}
          className="relative overflow-hidden rounded-lg shadow-xl border-gray-200"
          style={{ height }}
        >
          <motion.div
            className="h-full cursor-ew-resize active:cursor-grabbing"
            drag="x"
            dragMomentum={false}
            dragConstraints={{ left: -maxX, right: 0 }}
            onDragEnd={(_, info) => {
              const { offset } = info;
              if (!offset) return;
              const proposed = currentX - offset.x; // offset.x negativo => arrastra a la izquierda
              setCurrentX(clamp(proposed, 0, maxX));
            }}
            animate={{ x: -currentX }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            style={{ width: "fit-content", display: "block" }}
          >
            <div ref={contentRef} className="h-full inline-block align-top bg-white">
              {/* El timeline ajusta su ancho en función de la cantidad de items */}
              <div className="h-full pr-8">
                <TimelineVillaBonita
                  items={demoItems}
                  height={timelineHeight}
                  minWidth={computedMinWidth}
                  minGap={responsiveMinGap}
                />
              </div>
            </div>
          </motion.div>

          {/* Sombras laterales */}
          <div className="absolute inset-0 pointer-events-none">
            {currentX > 0 && (
              <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-black/15 to-transparent" />
            )}
            {currentX < maxX && (
              <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-black/15 to-transparent" />
            )}
          </div>

          {/* Flechas */}
          <AnimatePresence>
            {currentX > 0 && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                exit={{ opacity: 0 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                onClick={() => page(-1)}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/95 text-blue-900 p-2.5 rounded-full shadow-lg z-20 border border-gray-200"
                aria-label="Anterior"
              >
                <ChevronLeft size={36} />
              </motion.button>
            )}
            {currentX < maxX && maxX > 0 && (
              <motion.button
                type="button"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.9 }}
                exit={{ opacity: 0 }}
                whileHover={{ opacity: 1, scale: 1.05 }}
                onClick={() => page(1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/95 text-blue-900 p-2.5 rounded-full shadow-lg z-20 border border-gray-200"
                aria-label="Siguiente"
              >
                <ChevronRight size={36} />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Dots */}
          {maxX > 0 && positions > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-10">
              {Array.from({ length: positions }, (_, i) => {
                const isActive = i + 1 === activeIndex;
                return (
                  <button
                    key={i}
                    onClick={() => goToIndex(i)}
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      isActive ? "bg-white scale-125" : "bg-white/60 hover:bg-white/80"
                    }`}
                  />
                );
              })}
            </div>
          )}
        </div>

        <div className="text-center mt-4 text-gray-600 text-sm">
          {positions > 0 && (
            <span>
              {activeIndex} / {positions}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoryCarrusel;

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}

export const demoItems = [
  {
    year: "1999",
    title: "Inicio de urbanización",
    subtitle: "",
    description: "El 18 de agosto comienzan las obras en 'Paseo Villa Bonita' marcando el hito formal del proyecto.",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=400&auto=format&fit=crop",
  },
  {
    year: "2003",
    title: "Construcción de primeras viviendas",
    subtitle: "Se entregan las primeras viviendas, dando lugar a la primera comunidad establecida en la zona.",
    description: "El 18 de agosto comienzan las obras en 'Paseo Villa Bonita' marcando el hito formal del proyecto.",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=400&auto=format&fit=crop",
  },
  {
    year: "2004",
    title: "Pavimentación de vías internas",
    subtitle: "",
    description:
      "Se pavimentan los ejes estructurales internos mejorando la accesibilidad y conectividad del proyecto.",
    image: "https://images.unsplash.com/photo-1560493676-04071c5f467b?q=80&w=400&auto=format&fit=crop",
  },
  {
    year: "2007",
    title: "Servicios básicos y Cooperativa Aguasys",
    subtitle: "",
    description:
      "Instalación de redes de agua y alcantarillado, gestión comunitaria de abastecimiento y mantenimiento.",
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=400&auto=format&fit=crop",
  },
  {
    year: "2008",
    title: "Proyecto Condominio Acarai",
    subtitle: "",
    description: "Se lanza el plan habitacional con enfoque vecinal y áreas comunes.",
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c52f?q=80&w=400&auto=format&fit=crop",
  },
  {
    year: "2011",
    title: "Fundación de la Constructora Villa Bonita",
    subtitle: "",
    description: "Se crea la unidad constructora para ejecutar y administrar nuevos desarrollos del complejo.",
    image: "https://images.unsplash.com/photo-1560185008-b033106af2b8?q=80&w=400&auto=format&fit=crop",
  },
  {
    year: "2012",
    title: "Proyecto Casas WAR y Casas 4K",
    subtitle: "",
    description: "Líneas de vivienda con eficiencia espacial y acabados optimizados.",
    image: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?q=80&w=400&auto=format&fit=crop",
  },
  {
    year: "2018",
    title: "Proyecto Condominio Laguna Maggiore",
    subtitle: "",
    description: "Conjunto con áreas verdes y senderos peatonales arbolados.",
    image: "https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=400&auto=format&fit=crop",
  },
  {
    year: "2020",
    title: "Proyecto Condominio Paseo de Villa Bonita",
    subtitle: "",
    description: "Nueva etapa del desarrollo con vivienda compacta y terrazas.",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?q=80&w=400&auto=format&fit=crop",
  },
];
