import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import TimelineVillaBonita, { type TimelineItem } from "./TimelineVillaBonita";
import { createApiService } from "@/core/services/api.service";
import type { ITimeline } from "@/core/types/ITimeline";

type Props = {
  items?: Array<{
    year: string;
    title: string;
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
  const [apiItems, setApiItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  // Base URL para recursos públicos
  const baseUrl = useMemo(() => import.meta.env.VITE_API_URL?.replace("/api", "") || window.location.origin, []);

  // Cargar datos desde la API de timeline (pública)
  useEffect(() => {
    let mounted = true;
    const service = createApiService({ basePath: "timeline" });
    (async () => {
      try {
        const res = await service.get("all");
        const data: ITimeline[] = Array.isArray(res?.data) ? (res.data as ITimeline[]) : [];
        // Mapear al formato del componente y ordenar por año asc
        const mapped: TimelineItem[] = data
          .map((it) => ({
            year: String(it.year ?? ""),
            title: String(it.title ?? ""),
            description: String(it.description ?? ""),
            image: it.photo ? `${baseUrl}/${String(it.photo).replace(/^\/+/, "")}` : "",
          }))
          .filter((it) => it.year && it.title);
        mapped.sort((a, b) => (parseInt(a.year) || 0) - (parseInt(b.year) || 0));
        if (mounted) setApiItems(mapped);
      } catch {
        if (mounted) setApiItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [baseUrl]);

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

  // Preferir props.items si vienen, normalizando al tipo TimelineItem; de lo contrario usar los de la API
  const itemsFromProps: TimelineItem[] = useMemo(
    () =>
      (items || []).map((i) => ({
        year: i.year,
        title: i.title,
        description: i.description ?? "",
        image: i.image,
      })),
    [items]
  );
  const finalItems: TimelineItem[] = itemsFromProps.length > 0 ? itemsFromProps : apiItems;

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
                {loading ? (
                  <div className="w-full text-center py-10 text-gray-500">Cargando línea de tiempo…</div>
                ) : finalItems.length === 0 ? (
                  <div className="w-full text-center py-10 text-gray-500 text-5xl">
                    Aún no hay elementos en la línea de tiempo. Puedes agregarlos desde la configuración del panel de
                    administración.
                  </div>
                ) : (
                  <TimelineVillaBonita
                    items={finalItems}
                    height={timelineHeight}
                    minWidth={computedMinWidth}
                    minGap={responsiveMinGap}
                  />
                )}
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

// demoItems eliminado: ahora el componente consume datos reales de la API
