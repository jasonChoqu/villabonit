import { motion } from "framer-motion";
import { images } from "@/assets/images";
import BannerImg from "../../../../server/public/assets/banners/services_default.png";

import ServicesGallery from "@/components/extra/ServicesGallery";
import { useEffect, useState } from "react";
import { createApiService } from "@/core/services/api.service";

const Servicepage = () => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const ImageService = createApiService({ basePath: "banners" });
        console.log("wtf");
        const response = await ImageService.get("all");
        setBannerUrl(`http://127.0.0.1:8000/${response.data.filter((item) => item.id === 3)[0].image}`);
      } catch {
        // silent fallback to default BannerImg
      }
    };
    fetchBanner();
  }, []);

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 group overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={`http://127.0.0.1:8000/assets/banners/services_default.png`}
            alt="Hero image"
          />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-white/95 to-transparent" />
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-6xl text-shadow-md text-shadow-black/70 md:text-7xl lg:text-8xl font-bold leading-tight mb-4 drop-shadow-lg text-white">
                Servicios
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 flex justify-center pb-8"
            >
              <img src={images.logovillabonita1} alt="Logo Villa Bonita" className="h-12 md:h-20 lg:h-28 w-auto" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="py-8 bg-transparent">
        <div className="md:px-12">
          <ServicesGallery />
        </div>
      </section>
    </div>
  );
};

export default Servicepage;
