import { motion } from "framer-motion";
import React from "react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface FoundersProps {
  imageUrl: string;
}

const Founders: React.FC<FoundersProps> = ({ imageUrl }) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!overlayRef.current) return;
      gsap.set(overlayRef.current, { opacity: 0, y: 60 });
      let lastScrollY = window.scrollY;
      const showDown = () => {
        gsap.to(overlayRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      };
      const showUp = () => {
        gsap.to(overlayRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
      };
      const hideDown = () => {
        gsap.to(overlayRef.current, { opacity: 0, y: 60, duration: 0.6, ease: "power3.in" });
      };
      const hideUp = () => {
        gsap.to(overlayRef.current, { opacity: 0, y: -60, duration: 0.6, ease: "power3.in" });
      };
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY;
          lastScrollY = currentScrollY;
          if (entry.isIntersecting) {
            if (scrollingDown) {
              showDown();
            } else {
              showUp();
            }
          } else {
            if (scrollingDown) {
              hideDown();
            } else {
              hideUp();
            }
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(overlayRef.current);
      return () => observer.disconnect();
    },
    { scope: overlayRef }
  );

  return (
    <div className="relative w-full overflow-hidden bg-white">
      <img
        src={imageUrl}
        alt="Fundadores Villa Bonita"
        className="w-full h-auto object-contain mx-auto transition-transform duration-500 hover:scale-105"
      />

      {/* Overlays superiores/inferiores (usa alturas fijas en px en lugar de 1/4) */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent" />

      {/* Capa de textos animados */}
      <div ref={overlayRef} className="md:absolute inset-0 flex flex-col items-start justify-between p-8">
        <h2 className="text-2xl md:text-3xl font-bold text-[#223c7a]">Fundadores Zona Villa Bonita:</h2>
        <div className="md:translate-x-20 md:-translate-y-60 tracking-wide">
          <p className="text-xl md:text-3xl font-medium text-black">Dorian Guzman Rodriguez</p>
          <p className="text-xl md:text-3xl font-medium text-black">y Margoth Justiniano</p>
        </div>
        <div />
      </div>
    </div>
  );
};

export default Founders;
