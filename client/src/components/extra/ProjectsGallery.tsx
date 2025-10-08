import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { createApiService } from "@/core/services/api.service";
import { type IGallery } from "@/core/types/IGallery";

interface LogoData {
  image: string;
  alt: string;
  fullWidth?: boolean;
  area: string;
}

export default function ProjectsGallery() {
  const images = createApiService({ basePath: "gallery" });
  const [logosData, setLogosData] = useState<LogoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasLoaded) {
            setIsVisible(true);
            setHasLoaded(true);
            // Una vez que se activa, no necesitamos seguir observando
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1, // Se activa cuando el 10% del elemento es visible
        rootMargin: "150px" // Se activa 150px antes de que sea visible
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasLoaded]);

  // Cargar datos solo cuando la sección es visible
  useEffect(() => {
    if (!isVisible) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        await getImages();
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isVisible]);
  const getImages = async () => {
    try {
      const response = await images.get("all");
      console.log("responsee", response);
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin;
      setLogosData(
        response.data
          .map((item: IGallery) => ({
            image: `${baseUrl}/${String(item.photo).replace(/^\/+/, "")}`,
            alt: item.description,
            area: item.area,
          }))
          .filter((item: LogoData) => item.area === "proyectos") // Filtra elementos con título y highlight
      );
    } catch (error) {
      console.error("Error loading gallery images:", error);
    }
  };

  // Animación del carrusel solo cuando hay datos
  useEffect(() => {
    if (!logosData.length || loading) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 0.5; // Velocidad más lenta para logos
    let animationId: number;
    let leftPosition = 0;

    const animate = () => {
      leftPosition -= scrollSpeed;

      // Reinicia la posición cuando llega al final de ambos conjuntos de logos
      if (leftPosition <= -container.scrollWidth / 2) {
        leftPosition = 0;
      }

      container.style.transform = `translateX(${leftPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [logosData, loading]);

  // Componente de carga
  const LoadingComponent = () => (
    <div className="w-full h-64 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando galería...</p>
        <div className="flex justify-center mt-3 space-x-1">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );

  // Placeholder mientras no es visible
  const PlaceholderComponent = () => (
    <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="flex space-x-4">
        {[1, 2, 3, 4].map((item) => (
          <div key={item} className="flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-300 rounded-lg animate-pulse mb-2"></div>
            <div className="h-3 bg-gray-300 rounded w-20 animate-pulse"></div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section ref={sectionRef} className="w-full relative overflow-x-hidden py-12">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-3xl font-bold mb-12"
        >
          Galeria
        </motion.h2>

        {!isVisible ? (
          <PlaceholderComponent />
        ) : loading ? (
          <LoadingComponent />
        ) : logosData.length === 0 ? (
          <div className="w-full h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No hay imágenes disponibles en la galería</p>
          </div>
        ) : (
          <div className="relative w-full">
            <div
              ref={containerRef}
              className="flex w-max gap-5 items-center whitespace-nowrap"
            >
              {[...logosData, ...logosData].map((logo, index) => (
                <motion.div key={index} whileHover={{ scale: 1.1 }} className="flex-shrink-0">
                  <img
                    src={logo.image}
                    alt={logo.alt}
                    className="h-50 object-contain opacity-80 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
