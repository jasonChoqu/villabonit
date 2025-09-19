


import { useEffect, useRef, useState } from "react";
import { AgreementService } from '@/core/services/agreement/agreement.service';

interface CardData {
  image: string;
  title: string;
  highlight: string;
  area: string;
}

export default function AlliancesLogo() {
  const [cardsData, setCardsData] = useState<CardData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Llamando AgreementService.getAll()...');
        const res = await AgreementService.getAllPaginated();
        console.log('Respuesta cruda de getAll:', res);
        const data = res.data || res || [];
        if (!Array.isArray(data)) {
          console.error('La respuesta de la API no es un array:', data);
        }
        const mapped = Array.isArray(data)
          ? data.map((item: any) => ({
              image: `http://127.0.0.1:8000/${String(item.photo).replace(/^\/+/,'')}`,
              title: item.name,
              highlight: item.description || "",
              area: item.area || "",
            }))
          : [];
        console.log('Mapped agreements:', mapped);
        setCardsData(mapped);
      } catch (e) {
        console.error('Error al llamar a la API de acuerdos:', e);
        setCardsData([]);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
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
  }, []);

  return (
    <div className="w-full relative overflow-x-hidden overflow-y-hidden py-12 bg-white">
      <div className="container mx-auto px-6">
        <h2
          className="text-3xl font-bold mb-12 text-center"
          style={{ color: '#006C2E' }}
        >
          Alianzas que transforman
        </h2>
        <div className="relative w-full">
          <div
            ref={containerRef}
            className="flex w-max gap-8 whitespace-nowrap"
          >
            {[...cardsData, ...cardsData].map((card, index) => (
              <div
                key={index}
                className="relative flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-102 h-auto"
              >
                <div className="h-80 w-full flex items-center justify-center bg-white">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}