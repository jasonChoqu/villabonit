import { motion } from "framer-motion";
import UsPlan from "@/components/extra/UsPlan";
import BannerImg from "../../../../server/public/assets/banners/us_default.png";
import CardUS from "@/components/extra/CardsUS";
import CardUS2 from "@/components/extra/CardsUS2";
import Founders from "@/components/extra/founders";
import foundersImage from "@/assets/images/fundadores.png";
import HistorySection from "@/components/extra/HistorySection";
import HistoryCarrusel from "@/components/extra/HistoryCarrusel";
import type { IBeginning } from "@/core/types/IBeginning";
import type { IMoralValue } from "@/core/types/IMoralValue";
import { useEffect, useState } from "react";
import { createApiService } from "@/core/services/api.service";
import variables from "@/core/config/variables";

const Historypage = () => {
  const [beginnings, setBeginnings] = useState<IBeginning[]>([]);
  const [moralValues, setMoralValues] = useState<IMoralValue[]>([]);
  const [loading, setLoading] = useState({
    beginnings: true,
    moralValues: true,
  });
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  const BeginningService = createApiService({ basePath: "beginnings" });
  const MoralValueService = createApiService({ basePath: "moral_values" });
  const ImageService = createApiService({ basePath: "banners" });

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getBeginnings(), getMoralValues(), getImage()]);
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

  const getMoralValues = async () => {
    try {
      const response = await MoralValueService.get("all");
      setMoralValues(response.data);
    } finally {
      setLoading((prev) => ({ ...prev, moralValues: false }));
    }
  };
  const getImage = async () => {
    try {
      const ImageService = createApiService({ basePath: "banners" });
      console.log("wtf");
      const response = await ImageService.get("all");
      setBannerUrl(`http://127.0.0.1:8000/${response.data.filter((item) => item.id === 1)[0].image}`);
    } catch {
      // silent fallback to default BannerImg
    }
  };

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 group overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={`http://127.0.0.1:8000/assets/banners/us_default.png`}
            alt="Hero image"
          />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-white/95 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 text-shadow-md text-shadow-black/70 text-white">
                Nuestra Historia
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="py-8 bg-transparent">
        <div className="">
          <UsPlan />
          <HistoryCarrusel />
          <CardUS />
          <div className="mt-10"></div>
          <CardUS2 />
          <Founders imageUrl={foundersImage} />
        </div>
      </section>

      {/* Sección con la imagen y la historia */}
      <HistorySection />
    </div>
  );
};

export default Historypage;
