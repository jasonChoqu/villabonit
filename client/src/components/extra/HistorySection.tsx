import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import layer45Image from "@/assets/images/Layer-52.png";
import type { IHistory } from "@/core/types/IHistory";
import { getAll, getAllPaginated } from "@/core/services/history/history.service"; // Import the service

const HistorySection = () => {
  const [histories, setHistories] = useState<IHistory[]>([]);
  // Track expanded paragraphs by history index + paragraph index
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAll()
      .then((res) => {
        console.log("Fetched histories:", res);
        // If your API returns { items: [...] }
        setHistories(res.data || []);
        // If it returns an array directly, use: setHistories(res);
      })
      .catch((err) => {
        console.error("Error fetching histories:", err);
      });
  }, []);

  useGSAP(
    () => {
      if (!sectionsRef.current) return;
      const items = sectionsRef.current.querySelectorAll(".gsap-history-section");
      gsap.set(items, { opacity: 0, y: 40 });
      const observer = new window.IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            gsap.to(items, {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
              stagger: 0.2,
            });
          } else {
            gsap.to(items, {
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
      observer.observe(sectionsRef.current);
      return () => observer.disconnect();
    },
    { scope: sectionsRef }
  );

  // Determina si hay algún párrafo expandido
  const anyExpanded = Object.values(expanded).some(Boolean);
  // Margen inferior dinámico: grande solo si algo está expandido
  const bottomMarginClass = anyExpanded ? "mb-40 md:mb-56" : "mb-16 md:mb-24";

  return (
    <div className={`w-full overflow-hidden transition-[margin] duration-300 ${bottomMarginClass}`}>
      <div className="relative">
        <img src={layer45Image} alt="Layer 45" className="w-full h-auto object-cover" />
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-start px-6 md:px-16 py-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 md:mb-10 text-[#223c7a] ">Nuestra historia</h2>
          <div ref={sectionsRef} className="w-full max-w-7xl space-y-10 md:space-y-14 bg-transparent mx-auto">
            {histories.length === 0 ? (
              <p className="text-center text-[#223c7a]">Cargando...</p>
            ) : (
              histories.map((history, index) => (
                <div key={index} className="gsap-history-section">
                  <h3 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4 text-[#223c7a]">{history.title}</h3>
                  {/* If paragraphs is an array, map it. If it's a string, just show it. */}
                  {Array.isArray(history.content)
                    ? history.content.map((p: string, i: number) => {
                        const key = `${index}-${i}`;
                        const limit = 200;
                        const isLong = p.length > limit;
                        const isOpen = expanded[key];
                        const displayText = !isLong || isOpen ? p : p.slice(0, limit).replace(/\s+\S*$/, "") + "…";
                        return (
                          <div key={key} className="group relative mb-4">
                            <p className="mb-1 text-base sm:text-lg leading-relaxed text-[#223c7a] transition-colors">
                              {displayText}
                            </p>
                            {isLong && (
                              <button
                                type="button"
                                onClick={() => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))}
                                className="text-sm font-medium text-[#223c7a] underline underline-offset-2 hover:text-[#1a2e5c] focus:outline-none focus:ring-2 focus:ring-[#223c7a]/40 rounded"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? "Ver menos" : "Leer más"}
                              >
                                {isOpen ? "Ver menos" : "Leer más"}
                              </button>
                            )}
                          </div>
                        );
                      })
                    : (() => {
                        const p = history.content as unknown as string;
                        const limit = 300;
                        const key = `${index}-single`;
                        const isLong = p && p.length > limit;
                        const isOpen = expanded[key];
                        const displayText = !isLong || isOpen ? p : p.slice(0, limit).replace(/\s+\S*$/, "") + "…";
                        return (
                          <div className="group relative mb-4">
                            <p className="mb-1 text-base sm:text-lg leading-relaxed text-[#223c7a]">{displayText}</p>
                            {isLong && (
                              <button
                                type="button"
                                onClick={() => setExpanded((prev) => ({ ...prev, [key]: !prev[key] }))}
                                className="text-sm font-medium text-[#223c7a] underline underline-offset-2 hover:text-[#1a2e5c] focus:outline-none focus:ring-2 focus:ring-[#223c7a]/40 rounded"
                                aria-expanded={isOpen}
                                aria-label={isOpen ? "Ver menos" : "Leer más"}
                              >
                                {isOpen ? "Ver menos" : "Leer más"}
                              </button>
                            )}
                          </div>
                        );
                      })()}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistorySection;
