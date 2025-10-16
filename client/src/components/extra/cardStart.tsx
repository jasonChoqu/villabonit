import { useEffect, useRef, useState } from "react";
import { createApiService } from "@/core/services/api.service";
import { type IGallery } from "@/core/types/IGallery";

interface CardData {
  image: string;
  title: string;
  highlight: string;
  area: string;
}

export default function CardStart() {
  const images = createApiService({ basePath: "gallery" });
  const [cardsData, setCardData] = useState<CardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

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
        rootMargin: "100px" // Se activa 100px antes de que sea visible
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
      setCardData(
        response.data
          .map((item: IGallery) => ({
            image: `${baseUrl}/${String(item.photo).replace(/^\/+/, "")}`,
            title: item.description,
            highlight: item.description2,
            area: item.area,
          }))
          .filter((item: CardData) => item.area === "inicio") // Filtra elementos con título y highlight
      );
    } catch (error) {
      console.error("Error loading images:", error);
    }
  };

  // Animación del carrusel solo cuando hay datos
  useEffect(() => {
    if (!cardsData.length || loading) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 1;
    let animationId: number;
    let leftPosition = 0;

    const animate = () => {
      leftPosition -= scrollSpeed;

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
  }, [cardsData, loading]);

  // Componente de carga
  const LoadingComponent = () => (
    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
        <p className="text-gray-600 text-lg font-medium">Cargando galería...</p>
        <div className="flex justify-center mt-4 space-x-1">
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );

  // Placeholder mientras no es visible
  const PlaceholderComponent = () => (
    <div className="w-full h-80 flex items-center justify-center bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4 animate-pulse"></div>
        <div className="h-4 bg-gray-300 rounded w-32 mx-auto animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} className="w-full relative overflow-x-hidden overflow-y-hidden py-1">
      {!isVisible ? (
        <PlaceholderComponent />
      ) : loading ? (
        <LoadingComponent />
      ) : cardsData.length === 0 ? (
        <div className="w-full h-80 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No hay imágenes disponibles</p>
        </div>
      ) : (
        <div ref={containerRef} className="flex w-max gap-8 whitespace-nowrap">
          {[...cardsData, ...cardsData].map((card, index) => (
            <div
              key={index}
              className="relative flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-102 h-auto"
            >
              <div className="h-80 w-full relative">
                <img 
                  src={card.image} 
                  alt={`${card.title} ${card.highlight}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {/* Overlay negro semi-transparente */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-opacity-70 p-3">
                <div className="text-white text-xs md:text-sm text-center font-bold leading-tight max-h-16 overflow-hidden">
                  <div className="mb-1">
                    <span className="block overflow-hidden text-ellipsis" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word'
                    }}>
                      {card.title}
                    </span>
                  </div>
                  <div className="text-yellow-300 font-extrabold text-xs md:text-sm">
                    <span className="block overflow-hidden text-ellipsis" style={{
                      display: '-webkit-box',
                      WebkitLineClamp: 1,
                      WebkitBoxOrient: 'vertical',
                      wordBreak: 'break-word'
                    }}>
                      {card.highlight}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
