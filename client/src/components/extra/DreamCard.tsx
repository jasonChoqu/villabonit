import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { images } from '@/assets/images';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface DreamCardProps {
  backgroundImage?: string;
  logo?: string;
  titleLine1?: string;
  titleHighlight?: string;
  titleLine2?: string;
  className?: string;
}

export default function DreamCard({
  backgroundImage = images.contact5,
  logo = images.logovillabonita2,
  titleLine1 = "Transformamos",
  titleHighlight = "sueños",
  titleLine2 = "en estructuras sólidas",
  className = ""
}: DreamCardProps) {
  const scope = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!logoRef.current || !textRef.current) return;

    // Estado inicial (ligero zoom out y fade)
    gsap.set(logoRef.current, { scale: 0.88, opacity: 0 });
    gsap.set(textRef.current, { scale: 0.88, opacity: 0 });

    // Timeline para logo
    const tlLogo = gsap.timeline({ paused: true })
      .to(logoRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });

    // Timeline para texto
    const tlText = gsap.timeline({ paused: true })
      .to(textRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
      });

    // ScrollTrigger para logo
    ScrollTrigger.create({
      trigger: logoRef.current,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: () => tlLogo.play(),
      onLeave: () => tlLogo.reverse(),
      onEnterBack: () => tlLogo.play(),
      onLeaveBack: () => tlLogo.reverse(),
    });

    // ScrollTrigger para texto
    ScrollTrigger.create({
      trigger: textRef.current,
      start: "top 85%",
      end: "bottom 15%",
      onEnter: () => tlText.play(),
      onLeave: () => tlText.reverse(),
      onEnterBack: () => tlText.play(),
      onLeaveBack: () => tlText.reverse(),
    });
  }, { scope });

  return (
    <div
      ref={scope}
      className={`w-screen relative left-1/2 right-1/2 -mx-[50vw] h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden group ${className}`}
    >
      {/* Fondo */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Fondo de construcción"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105 bg-black"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-300" />
      </div>

      {/* Contenido */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-6 md:p-8 text-center bg-gradient-to-t from-black/80 to-transparent">
        {/* Logo (con ref para GSAP) */}
        {logo && (
          <div
            ref={logoRef}
            className="mx-auto mb-4 w-40 h-40 md:w-48 md:h-48 relative will-change-transform"
          >
            <img
              src={logo}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          </div>
        )}

  <div ref={textRef} className="text-white space-y-3">
          {titleLine1 && (
            <h3 className="text-4xl md:text-5xl lg:text-6xl leading-tight">
              {titleLine1}{" "}
              {titleHighlight && (
                <span className="text-yellow-300">{titleHighlight}</span>
              )}
            </h3>
          )}
          {titleLine2 && (
            <p className="text-4xl md:text-5xl lg:text-6xl leading-tight">
              {titleLine2}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
