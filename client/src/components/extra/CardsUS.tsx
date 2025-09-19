import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import CardsUSR from "./CardsUSR";
import { FaMountain } from "react-icons/fa";
import { FaBinoculars } from "react-icons/fa";
import type { IBeginning } from "@/core/types/IBeginning";
import { createApiService } from "@/core/services/api.service";

const CardsUS = () => {
  const [beginnings, setBeginnings] = useState<IBeginning[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const BeginningService = createApiService({ basePath: "beginnings" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const wtf = await Promise.all([getBeginnings()]);
        console.log("wtf", wtf);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    fetchData();
  }, []);

  const getBeginnings = async () => {
    try {
      const response = await BeginningService.get("all");
      setBeginnings(response.data);
    } finally {
      setLoading((prev) => ({ ...prev, beginnings: false }));
    }
  };

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
    <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-11 mt-12 overflow-hidden">
      <div className="gsap-card md:col-span-5 mb-10 md:mb-0 ">
        <CardsUSR
          title="Misión:"
          content={beginnings[0]?.mission || ""}
          icon={FaMountain}
          borderColor="border-[#223c7a]"
          textColor="text-[#223c7a]"
          iconSize={70}
          titleSize="text-4xl"
          borderSize="border-4"
        />
      </div>

      <div className="gsap-card md:col-span-6">
        <CardsUSR
          title="Visión:"
          content={beginnings[0]?.vision || ""}
          icon={FaBinoculars}
          borderColor="border-[#223c7a]"
          textColor="text-[#223c7a]"
          iconSize={70}
          titleSize="text-4xl"
          borderSize="border-4"
        />
      </div>
    </div>
  );
};

export default CardsUS;

function setLoading(_: (prev: any) => any) {
  throw new Error("Function not implemented.");
}
