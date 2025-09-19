// ctb-main\client\src\components\extra\OptionsInHome.tsx
import React, { useRef } from "react";
import { useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const OptionsInHome = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.border');
    gsap.set(cards, { opacity: 0, y: 40 });
    // Animate in with stagger when container enters viewport
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
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const options = [
    {
      title: "🏞️ Terrenos en Zonas Clave",
      content: (
        <p>
            La creciente demanda de viviendas requiere soluciones concretas, rápidas y sostenibles.
            Nuestra empresa contribuye activamente a reducir el déficit habitacional desarrollando 
            proyectos accesibles, bien ubicados y con enfoque social, alineados con las necesidades 
            reales de la población y en coordinación con planes municipales de expansión urbana.
        </p>
      ),
    },
    {
      title: "💸 Soluciones a Medida",
      content: (
        <p>
            La creciente demanda de viviendas requiere soluciones concretas, rápidas y sostenibles.
            Nuestra empresa contribuye activamente a reducir el déficit habitacional desarrollando 
            proyectos accesibles, bien ubicados y con enfoque social, alineados con las necesidades 
            reales de la población y en coordinación con planes municipales de expansión urbana.
        </p>
      ),
    },
    {
      title: "🏠 Respuesta al Déficit Habitacional",
      content: (
        <p>
            La creciente demanda de viviendas requiere soluciones concretas, rápidas y sostenibles.
            Nuestra empresa contribuye activamente a reducir el déficit habitacional desarrollando 
            proyectos accesibles, bien ubicados y con enfoque social, alineados con las necesidades 
            reales de la población y en coordinación con planes municipales de expansión urbana.
        </p>
      ),
    },
  ];

  const toggleOption = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div ref={containerRef} className="my-12 max-w-4xl mx-auto roun">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mb-8 text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Nuestro Enfoque Integral
        </h2>
        <p className="text-lg text-gray-600">
          En Villa Bonita comprendemos que adquirir una propiedad o desarrollar un proyecto inmobiliario implica enfrentar múltiples desafíos. 
          Por eso, no solo ofrecemos soluciones habitacionales, sino que acompañamos a nuestros clientes desde la concepcion de la idea 
          hasta la ejecucion final del proyecto. Ya sea en la busqueda de ubicacion, el acceso al financiamiento o el diseño y construccion, 
          brindamos un soporte integral que transforma los obstaculos en oportunidades.
        </p>
      </motion.div>

      <div className="space-y-4 text-lg">
        {options.map((option, index) => (
          <div 
            key={index} 
            className="border border-gray-200 rounded-lg overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => toggleOption(index)}
              className={`w-full px-6 py-4 text-left flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors duration-200 ${
                activeIndex === index ? "bg-gray-50" : ""
              }`}
              style={{ cursor: "pointer" }}
            >
              <h3 className="text-xl font-semibold text-gray-800">
                {option.title}
              </h3>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </motion.div>
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{
                height: activeIndex === index ? "auto" : 0,
                opacity: activeIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-6 py-4 text-gray-600">
                {option.content}
              </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OptionsInHome;