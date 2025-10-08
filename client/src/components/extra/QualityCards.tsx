import { useRef, useState, useEffect, useCallback } from 'react';
import { FaStar, FaUserTie, FaChartLine, FaShapes, FaMapMarkedAlt } from 'react-icons/fa';
import { QualityCard } from './QualityCard';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { createApiService } from "@/core/services/api.service";
import type { IValuePropositionResponse } from '@/core/types/IValueProposition';

type CardItem = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

export default function QualityCards() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cardsData, setCardsData] = useState<CardItem[]>([
    {
      icon: <FaStar className="group-hover:rotate-12 transition-transform duration-500" />,
      title: "Compromiso con la calidad",
      description: "Ejecutamos proyectos con altos estándares técnicos y materiales certificados"
    },
    {
      icon: <FaUserTie className="group-hover:rotate-12 transition-transform duration-500" />,
      title: "Equipo certificado",
      description: "Contamos con arquitectos, ingenieros y técnicos acreditados"
    },
    {
      icon: <FaChartLine className="group-hover:rotate-12 transition-transform duration-500" />,
      title: "Transparencia financiera",
      description: "Brindamos reportes abiertos y trazables, con un manejo financiero ordenado"
    },
    {
      icon: <FaShapes className="group-hover:rotate-12 transition-transform duration-500" />,
      title: "Versatilidad en proyectos",
      description: "Diseñamos viviendas, comercios y oficinas según la necesidad de cada cliente"
    },
    {
      icon: <FaMapMarkedAlt className="group-hover:rotate-12 transition-transform duration-500" />,
      title: "Disponibilidad de uso de suelo",
      description: "Disponemos de terrenos propios en zonas de alta demanda"
    }
  ]);

  // Mapa con la data completa por título para el modal
  const [fullDataByTitle, setFullDataByTitle] = useState<Record<string, IValuePropositionResponse>>({});
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const valuePropositionService = createApiService({ basePath: "value_propositions" });

  const getPreview = useCallback((text: string) => {
    const paragraphs = text
      .split(/\n{2,}|\r?\n\r?\n/)
      .map(p => p.trim())
      .filter(Boolean);
    if (paragraphs.length <= 1) {
      return { preview: paragraphs.join('\n\n'), truncated: false };
    }
    return { preview: paragraphs.slice(0, 1).join('\n\n'), truncated: true };
  }, []);

  // Cerrar modal con ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedKey(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Fetch API y almacenar data completa
  useEffect(() => {
    const fetchValuePropositions = async () => {
      try {
        const response = await valuePropositionService.get("all");
        const apiData: IValuePropositionResponse[] = response.data;

        // Guardar mapa completo por título
        const map: Record<string, IValuePropositionResponse> = {};
          for (const item of apiData) {
          if (item?.title) map[item.title] = item;
        }
        setFullDataByTitle(map);

        // Actualizar description visible en las cards (manteniendo icon/título)
        setCardsData(prevCards =>
          prevCards.map(card => {
            const matched = map[card.title];
            if (matched?.description) {
              return { ...card, description: matched.description };
            }
            return card;
          })
        );
      } catch (error) {
        console.error("Error al cargar value propositions:", error);
      }
    };

    fetchValuePropositions();
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.group');
    gsap.set(cards, { opacity: 0, y: 40 });

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && window.scrollY > 0) {
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out',
            stagger: 0.15
          });
        } else {
          gsap.to(cards, {
            opacity: 0,
            y: 40,
            duration: 0.5,
            ease: 'power3.in',
            stagger: 0.1
          });
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, { scope: containerRef });

  const CardWithMore = ({ card }: { card: CardItem }) => {
    const { preview, truncated } = getPreview(card.description);
    const hasFull = !!fullDataByTitle[card.title]; // si hay data completa, mostramos "Ver más" incluso con 1-2 párrafos
    const showMore = truncated || hasFull;

    return (
      <QualityCard
        icon={card.icon}
        title={card.title}
        description={preview}
        className="h-full hover:bg-gray-50"
        showViewMore={showMore}
        onViewMore={() => setSelectedKey(card.title)}
      />
    );
  };

  const selectedFull = selectedKey ? fullDataByTitle[selectedKey] : null;
  const selectedCard = selectedKey ? cardsData.find(c => c.title === selectedKey) : null;

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-12">
      {/* Primera fila (3 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {cardsData.slice(0, 3).map((card, index) => (
          <motion.div
            key={`card-${index}`}
            className="group"
            whileHover={{ y: -12, scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <CardWithMore card={card} />
          </motion.div>
        ))}
      </div>

      {/* Segunda fila (2 cards centradas) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:w-2/3 md:mx-auto">
        {cardsData.slice(3).map((card, index) => (
          <motion.div
            key={`card-${index + 3}`}
            className="group"
            whileHover={{ y: -12, scale: 1.04, boxShadow: "0 8px 32px rgba(0,0,0,0.18)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <CardWithMore card={card} />
          </motion.div>
        ))}
      </div>

      {/* Modal con TODA la información */}
      <AnimatePresence>
        {selectedKey && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Detalle: ${selectedKey}`}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSelectedKey(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Panel */}
            <motion.div
              className="relative z-10 w-full max-w-3xl rounded-2xl bg-white shadow-2xl p-6 md:p-8"
              initial={{ y: 30, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="text-xl md:text-2xl">
                  {selectedCard?.icon}
                </div>
                <h3 className="text-lg md:text-xl font-semibold">
                  {selectedFull?.title || selectedKey}
                </h3>
              </div>

              {/* Subtítulo (si existe) */}
              {selectedFull && (selectedFull as any).subtitle && (
                <p className="text-gray-600 mb-3">
                  {(selectedFull as any).subtitle}
                </p>
              )}

              {/* Descripción completa */}
              {(selectedFull?.description || selectedCard?.description) && (
                <div className="prose max-w-none prose-p:mb-3">
                  {(selectedFull?.description || selectedCard?.description || '')
                    .split(/\n{2,}|\r?\n\r?\n/)
                    .map((p, i) => (
                      <p key={i} className="text-gray-700 leading-relaxed">
                        {p.trim()}
                      </p>
                    ))
                  }
                </div>
              )}

              {/* Detalles largos (si tu API tiene otro campo de texto largo) */}
              {selectedFull && (selectedFull as any).details && (
                <div className="prose max-w-none mt-4">
                  {String((selectedFull as any).details)
                    .split(/\n{2,}|\r?\n\r?\n/)
                    .map((p: string, i: number) => (
                      <p key={`dt-${i}`} className="text-gray-700 leading-relaxed">
                        {p.trim()}
                      </p>
                    ))}
                </div>
              )}

              {/* Highlights / bullets */}
              {selectedFull && Array.isArray((selectedFull as any).highlights) && (selectedFull as any).highlights.length > 0 && (
                <ul className="list-disc pl-5 mt-4 space-y-1">
                  {(selectedFull as any).highlights.map((h: string, i: number) => (
                    <li key={`hl-${i}`} className="text-gray-700">{h}</li>
                  ))}
                </ul>
              )}

              {/* Stats (objeto key/value) */}
              {selectedFull && (selectedFull as any).stats && typeof (selectedFull as any).stats === 'object' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {Object.entries((selectedFull as any).stats).map(([k, v], i) => (
                    <div key={`st-${i}`} className="rounded-xl border p-3">
                      <div className="text-xs uppercase text-gray-500">{k}</div>
                      <div className="text-base font-semibold text-gray-800">{String(v)}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Galería de imágenes */}
              {selectedFull && Array.isArray((selectedFull as any).gallery) && (selectedFull as any).gallery.length > 0 && (
                <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
                  {(selectedFull as any).gallery.map((src: string, i: number) => (
                    <img
                      key={`img-${i}`}
                      src={src}
                      alt={`${selectedFull?.title || selectedKey} ${i + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                      loading="lazy"
                    />
                  ))}
                </div>
              )}

              {/* CTA */}
              {(selectedFull as any)?.ctaUrl && (
                <div className="mt-6 flex justify-between items-center">
                  <a
                    href={(selectedFull as any).ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                  >
                    {(selectedFull as any).ctaLabel || 'Saber más'}
                  </a>
                  <button
                    onClick={() => setSelectedKey(null)}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                </div>
              )}

              {/* Cerrar si no hay CTA */}
              {!(selectedFull as any)?.ctaUrl && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setSelectedKey(null)}
                    className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cerrar
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
