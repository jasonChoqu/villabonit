import { useEffect, useRef, useState } from "react";
import { AgreementService } from "@/core/services/agreement/agreement.service";

interface CardData {
  image: string;
  title: string;
  highlight: string;
  area: string;
}

export default function AlliancesLogo() {
  const [cardsData, setCardsData] = useState<CardData[]>([]);
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
        const res = await AgreementService.getAllPaginated();
        const data = res.data || res || [];
        if (!Array.isArray(data)) {
          console.error("La respuesta de la API no es un array:", data);
        }
        const baseUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || window.location.origin;
        const mapped = Array.isArray(data)
          ? data.map((item: any) => ({
              image: `${baseUrl}/${String(item.photo).replace(/^\/+/, "")}`,
              title: item.name,
              highlight: item.description || "",
              area: item.area || "",
            }))
          : [];
        setCardsData(mapped);
      } catch (e) {
        console.error("Error al llamar a la API de acuerdos:", e);
        setCardsData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [isVisible]);

  // Animación del carrusel solo cuando hay datos
  useEffect(() => {
    if (!cardsData.length || loading) return;

    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 0.5;
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
    <div className="w-full h-36 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm font-medium">Cargando alianzas...</p>
        <div className="flex justify-center mt-2 space-x-1">
          <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse"></div>
          <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1.5 h-1.5 bg-green-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );

  // Placeholder mientras no es visible
  const PlaceholderComponent = () => (
    <div className="w-full h-36 flex items-center justify-center bg-gray-50 rounded-lg">
      <div className="text-center">
        <div className="w-12 h-12 bg-gray-300 rounded-lg mx-auto mb-3 animate-pulse"></div>
        <div className="h-3 bg-gray-300 rounded w-24 mx-auto animate-pulse"></div>
      </div>
    </div>
  );

  return (
    <div ref={sectionRef} className="w-full relative overflow-x-hidden overflow-y-hidden py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-12 text-center" style={{ color: "#006C2E" }}>
          Alianzas que transforman
        </h2>
        
        {!isVisible ? (
          <PlaceholderComponent />
        ) : loading ? (
          <LoadingComponent />
        ) : cardsData.length === 0 ? (
          <div className="w-full h-36 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No hay alianzas disponibles</p>
          </div>
        ) : (
          <div className="relative w-full">
            <div ref={containerRef} className="flex w-max gap-8 whitespace-nowrap">
              {[...cardsData, ...cardsData, ...cardsData, ...cardsData].map((card, index) => (
                <div
                  key={index}
                  className="relative flex-shrink-0 rounded-lg overflow-hidden transition-transform hover:scale-102"
                >
                  <div className="flex items-center justify-center bg-white">
                    <img 
                      src={card.image} 
                      alt={card.title} 
                      className="w-full h-36 object-contain" 
                      loading="lazy" 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
