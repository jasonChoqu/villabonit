import { images } from "@/assets/images";
import { FaUserTie } from "react-icons/fa6";
import { FaBuildingUser } from "react-icons/fa6";

import { useRef } from "react";
import gsap from "gsap";

import { useGSAP } from "@gsap/react";

interface UsPlanCardProps {
  logo?: keyof typeof images;
  title: string;
  content: string;
  highlights?: {
    label: string;
    value: string;
  }[];
}
import CardsUSR from "./CardsUSR";

export default function UsPlanCard({ logo = "logo", title, content, highlights = [] }: UsPlanCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;
      const cards = containerRef.current.querySelectorAll(".gsap-card");
      // Initial state: left for first, right for second
      gsap.set(cards[0], { opacity: 0, x: -80 });
      gsap.set(cards[1], { opacity: 0, x: 80 });
      // Animate in when container enters viewport
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(cards[0], { opacity: 1, x: 0, duration: 0.8, ease: "power3.out" });
            gsap.to(cards[1], { opacity: 1, x: 0, duration: 0.8, ease: "power3.out", delay: 0.15 });
          } else {
            gsap.to(cards[0], { opacity: 0, x: -80, duration: 0.5, ease: "power3.in" });
            gsap.to(cards[1], { opacity: 0, x: 80, duration: 0.5, ease: "power3.in" });
          }
        },
        { threshold: 0.2 }
      );
      observer.observe(containerRef.current);
      return () => observer.disconnect();
    },
    { scope: containerRef }
  );
  return (
    <div className="w-full max-w-8xl mx-auto bg-transparent rounded-xl overflow-hidden md:p-12 my-8">
      {/* Logo */}
      {logo && (
        <div className="flex justify-center mb-10">
          <img src={images.logovillabonita1} alt="Logo" className="h-28 object-contain" />
        </div>
      )}

      {/* Título */}
      <h2 className="text-2xl md:text-4xl font-bold text-left md:text-center text-gray-800 mb-10 px-5 md:px-8">
        {title}
      </h2>

      {/* Contenido principal */}
      <div className="prose prose-xl text-gray-600 mb-12 px-5 md:px-10">
        {content.split("\n").map((paragraph, i) => (
          <p key={i} className="mb-6 md:text-2xl text-lg leading-7 text-justify">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Puntos destacados */}
      {/* {highlights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 px-10">
          {highlights.map((item, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-bold text-xl text-gray-800 mb-2">{item.label}</h4>
              <p className="text-lg text-gray-600">{item.value}</p>
            </div>
          ))}
        </div>
      )} */}
      <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-8 overflow-hidden">
        <div className="gsap-card md:col-span-5 mb-6 md:mb-0">
          <CardsUSR
            title={highlights[0]?.label}
            content={highlights[0]?.value || ""}
            icon={FaBuildingUser}
            borderColor="border-[#223c7a]"
            textColor="text-[#223c7a]"
            iconSize={40}
            titleSize="text-xl"
            borderSize="border-2"
          />
        </div>

        <div className="md:col-span-2"></div>

        <div className="gsap-card md:col-span-5">
          <CardsUSR
            title={highlights[1]?.label}
            content={highlights[1]?.value || ""}
            icon={FaUserTie}
            borderColor="border-[#223c7a]"
            textColor="text-[#223c7a]"
            iconSize={40}
            titleSize="text-xl"
            borderSize="border-2"
          />
        </div>
      </div>
    </div>
  );
}
