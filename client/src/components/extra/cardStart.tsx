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
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getImages()]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const getImages = async () => {
    try {
      const response = await images.get("all");
      console.log("responsee", response);
      setCardData(
        response.data
          .map((item: IGallery) => ({
            image: `http://127.0.0.1:8000/${String(item.photo).replace(/^\/+/, "")}`,
            title: item.description,
            highlight: item.description2,
            area: item.area,
          }))
          .filter((item: CardData) => item.area === "inicio") // Filtra elementos con título y highlight
      );
    } finally {
      // setLoading((prev) => ({ ...prev, moralValues: false }));
    }
  };

  const [cardsData, setCardData] = useState<CardData[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <div className="w-full relative overflow-x-hidden overflow-y-hidden py-1">
      {" "}
      {/* Añadido overflow-y-hidden */}
      <div ref={containerRef} className="flex w-max gap-8 whitespace-nowrap">
        {[...cardsData, ...cardsData].map((card, index) => (
          <div
            key={index}
            className="relative flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-102 h-auto"
          >
            <div className="h-80 w-full">
              <img 
                src={card.image} 
                alt={`${card.title} ${card.highlight}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-opacity-70 p-4">
              <p className="text-white text-sm md:text-base text-center font-bold">
                {card.title} <br />
                <span className="text-yellow-300 px-1 font-extrabold">{card.highlight}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
