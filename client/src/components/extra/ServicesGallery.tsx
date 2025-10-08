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

export default function ServicesGallery() {
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
      const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin;
      setLogosData(
        response.data
          .map((item: IGallery) => ({
            image: `${baseUrl}/${String(item.photo).replace(/^\/+/, "")}`,
            alt: item.description,

            area: item.area,
          }))
          .filter((item: LogoData) => item.area === "servicios") // Filtra elementos con título y highlight
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
      className="text-3xl font-bold mb-12 text-[#223c7a]"
    >
      1. Gestión de obras de infraestructura
    </motion.h2>

    <div className="relative w-full">
      <div
        ref={containerRef}
        className="flex w-max gap-9 whitespace-nowrap"
      >
        {/* Card especial con texto azul y fondo plomo */}
        <motion.div 
          whileHover={{ scale: 1.05 }} 
          className="relative flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-lg transition-transform h-auto bg-gray-400"
        >
          <div className="h-80 w-full relative flex items-center justify-center bg-gray-400">
            <div className="text-center p-4 max-h-full overflow-y-auto">
              <div className="space-y-3">
                <h3 className="text-[#223c7a] text-base font-bold leading-tight">
                  Construcción de sistema de agua potable, plantas de tratamiento y alcantarillado
                </h3>
                
                <p className="text-[#223c7a] text-sm font-medium">
                  Garantizando acceso sostenible y eficiente a servicios básicos
                </p>

                <div className="space-y-2">
                  <h4 className="text-[#223c7a] text-sm font-bold">Beneficios:</h4>
                  <ul className="text-[#223c7a] text-xs space-y-1">
                    <li>• Aseguramos cobertura sanitaria adecuada</li>
                    <li>• Diseños sustentables y adaptados al entorno</li>
                    <li>• Costos optimizados en colaboración con AGUAYSES R.L</li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-[#223c7a] text-sm font-bold">Proyectos:</h4>
                  <p className="text-[#223c7a] text-xs">
                    • Instalación de redes sanitarias en conjunto con Cooperativa AGUAYSES R.L.
                  </p>
                </div>

                <p className="text-[#223c7a] text-xs font-medium italic mt-2">
                  Consulta sobre soluciones de agua y saneamiento para tu proyecto
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards regulares con imágenes */}
        {[...logosData, ...logosData].map((logo, index) => (
          <motion.div 
            key={index} 
            whileHover={{ scale: 1.05 }} 
            className="relative flex-shrink-0 w-64 rounded-lg overflow-hidden shadow-lg transition-transform h-auto"
          >
            <div className="h-80 w-full relative">
              <img
                src={logo.image}
                alt={logo.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              {/* Overlay con degradado */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            
            {/* Sección de texto */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="text-white text-sm md:text-base text-center font-bold">
                {logo.alt} <br />
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </div>
</section>
  );
}
