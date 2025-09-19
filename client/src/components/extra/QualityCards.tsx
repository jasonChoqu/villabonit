
import React, { useRef } from 'react';
import { FaStar, FaUserTie, FaChartLine, FaShapes, FaMapMarkedAlt } from 'react-icons/fa';
import { QualityCard } from './QualityCard';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function QualityCards() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const cards = containerRef.current.querySelectorAll('.group');
    gsap.set(cards, { opacity: 0, y: 40 });
    // Animate in with stagger when container enters viewport (scrolling down)
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
  const cardsData = [
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
  ];

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
            <QualityCard
              icon={card.icon}
              title={card.title}
              description={card.description}
              className="h-full hover:bg-gray-50"
            />
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
            <QualityCard
              icon={card.icon}
              title={card.title}
              description={card.description}
              className="h-full hover:bg-gray-50"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}