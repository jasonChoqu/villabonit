import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
// client\src\components\extra\CardsUS2.tsx
import CardsUSR from "./CardsUSR";
import { FaGem } from "react-icons/fa";
import type { IMoralValue } from "@/core/types/IMoralValue";
import { createApiService } from "@/core/services/api.service";

const CardsUS2 = () => {
  const [moralValues, setMoralValues] = useState<IMoralValue[]>([]);
  const [, setLoading] = useState({
    moralValues: true,
  });

  const MoralValueService = createApiService({ basePath: "moral_values" });
  // Agrupa los valores en 3 columnas de forma dinámica
  const columnas = [];
  if (moralValues.length > 0) {
    const colCount = 3;
    const itemsPerCol = Math.ceil(moralValues.length / colCount);
    for (let i = 0; i < colCount; i++) {
      columnas.push(moralValues.slice(i * itemsPerCol, (i + 1) * itemsPerCol));
    }
  }

  const valoresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getMoralValues()]);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const getMoralValues = async () => {
    try {
      const response = await MoralValueService.get("all");
      setMoralValues(response.data);
    } finally {
      setLoading((prev) => ({ ...prev, moralValues: false }));
    }
  };

  useGSAP(
    () => {
      if (!valoresRef.current) return;
      const columns = valoresRef.current.querySelectorAll(".gsap-col");
      gsap.set(columns, { opacity: 0, y: 40 });
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(columns, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.2,
            });
          } else {
            gsap.to(columns, {
              opacity: 0,
              y: 40,
              duration: 0.5,
              ease: "power3.in",
              stagger: 0.1,
            });
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(valoresRef.current);
      return () => observer.disconnect();
    },
    { scope: valoresRef }
  );

  return (
    <CardsUSR
      title="Valores"
      content={
        <div ref={valoresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {columnas.map((columna, colIndex) => (
            <div key={colIndex} className="gsap-col space-y-4 ">
              {columna.map((valor, index) => (
                <div key={`${colIndex}-${index} `}>
                  <h3 className="text-md md:text-lg font-extrabold text-[#223c7a]">{valor.title}</h3>
                  <p className="text-gray-700 text-base md:text-lg">{valor.description}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      }
      icon={FaGem}
      borderColor="border-[#223c7a]"
      textColor="text-[#223c7a]"
      iconSize={70}
      titleSize="text-4xl"
      borderSize="border-4"
    />
  );
};

export default CardsUS2;
