import { motion } from "framer-motion";
import Specializations from "@/components/extra/Specializations";
import DreamCard from "@/components/extra/DreamCard";
import Achievements from "@/components/extra/Achievements";
import FadingImageCard from "@/components/extra/FadingImageCard";
import QualityCards from "@/components/extra/QualityCards";
import contactImage from "@/assets/images/contact1.jpg";
import OptionsInHome from "@/components/extra/OptionsInHome";
import VideoInHome from "@/components/extra/VideoInHome";
import AlliancesLogo from "@/components/extra/AlliancesLogo";

import BannerVideo from "@/assets/video/constructora.mp4";
import React from "react";
import { images } from "@/assets/images";

// Servicio
import { ResourceBeginService } from "@/core/services/resource-begin/resource-begin.service";

// Tipado simple
type ResourceBeginItem = {
  id: number | string;
  url: string | null;
  logo_url?: string | null;
  text?: string | null;
};

// ⬇️ Helper: separa últimas dos palabras para pintarlas en amarillo
const splitLastTwoWords = (text: string) => {
  const clean = (text || "").trim().replace(/\s+/g, " ");
  if (!clean) return { firstPart: "Para tu", lastPart: "Futuro" };
  const parts = clean.split(" ");
  if (parts.length <= 2) return { firstPart: "", lastPart: clean };
  return {
    firstPart: parts.slice(0, -2).join(" "),
    lastPart: parts.slice(-2).join(" "),
  };
};

const HomePage = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [heroText, setHeroText] = React.useState<string>(""); // texto dinámico

  React.useEffect(() => {
    (async () => {
      try {
        const res = await ResourceBeginService.getAll();
        // Tolera respuestas: [..] o { data: [...] } o { data: { data: [...] } }
        const list: ResourceBeginItem[] = Array.isArray(res)
          ? res
          : Array.isArray(res?.data)
          ? res.data
          : Array.isArray(res?.data?.data)
          ? res.data.data
          : [];
        if (list && list.length > 0) {
          setHeroText(list[0]?.text || "");
        }
      } catch (e) {
        console.error("Error cargando ResourceBegin:", e);
      }
    })();
  }, []);

  const { firstPart, lastPart } = splitLastTwoWords(heroText);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          src={BannerVideo}
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative h-full flex items-center">
          <div className="container mx-auto px-6 md:px-50">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-2xl text-white ml-auto text-left"
            >
              {/* Título fijo */}
              {/* Texto dinámico con mismo formato, últimas 2 palabras en amarillo */}
              <div className="block">
                {firstPart && (
                  <span className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-lg">
                    {firstPart}
                  </span>
                )}
                <span className="text-yellow-300 text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 drop-shadow-lg ml-2">
                  {lastPart /* si heroText está vacío, fallback: "Futuro" */}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="absolute left-0 z-30 p-0 m-0"
          style={{ lineHeight: 0, bottom: "-10rem" }} // <-- aquí
        >
          <img
            src={images.logovillaBonita}
            alt="Villa Bonita Logo"
            className="h-[28rem] w-[28rem] md:h-[12rem] md:w-[12rem] lg:h-[36rem] lg:w-[36rem] object-contain drop-shadow-lg p-0 m-0 align-bottom"
            style={{ display: "block" }}
          />
        </motion.div>      

        <div className="absolute bottom-0 left-0 right-0">
          <div className="h-px bg-white w-full"></div>
        </div>
      </section>

      <section className="py-16 bg-white overflow-x-hidden">
        <div className="container mx-auto px-6 md:px-12 w-full max-w-full">
          <Specializations />
          <DreamCard />
          <Achievements />
          <div className="relative">
            <FadingImageCard
              imageUrl={contactImage}
              fadeHeight="h-40"
              className="h-[1500px] sm:h-[900px] md:h-[800px] lg:h-[650px]"
            />
            <div className="absolute top-0 left-0 right-0">
              <QualityCards />
            </div>
          </div>
          <OptionsInHome />
          <VideoInHome />
          <AlliancesLogo />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
