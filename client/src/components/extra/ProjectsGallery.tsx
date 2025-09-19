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
      setLogosData(
        response.data
          .map((item: IGallery) => ({
            image: `http://127.0.0.1:8000/${String(item.photo).replace(/^\/+/, "")}`,
            alt: item.description,

            area: item.area,
          }))
          .filter((item: LogoData) => item.area === "proyectos") // Filtra elementos con título y highlight
      );
    } finally {
      // setLoading((prev) => ({ ...prev, moralValues: false }));
    }
  };
  const [logosData, setLogosData] = useState<LogoData[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
  }, []);

  return (
    <section className="w-full relative overflow-x-hidden py-12">
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

        <div className="relative w-full">
          <div
            ref={containerRef}
            className="flex w-max gap-5 items-center whitespace-nowrap" // Aumenté gap y añadí whitespace-nowrap
          >
            {[...logosData, ...logosData].map(
              (
                logo,
                index // Duplicamos los logos
              ) => (
                <motion.div key={index} whileHover={{ scale: 1.1 }} className="flex-shrink-0">
                  <img
                    src={logo.image}
                    alt={logo.alt}
                    className="h-50 object-contain opacity-80 hover:opacity-100 transition-opacity"
                    loading="lazy"
                  />
                </motion.div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
