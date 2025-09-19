import { motion } from "framer-motion";
import UsPlan from "@/components/extra/UsPlan";
import BannerImg from "@/assets/images/pelea-ancianos.jpeg";
import CardUS from "@/components/extra/CardsUS";
import CardUS2 from "@/components/extra/CardsUS2";
import Founders from "@/components/extra/founders";
import foundersImage from "@/assets/images/fundadores.webp";
import HistorySection from "@/components/extra/HistorySection";
import HistoryCarrusel from "@/components/extra/HistoryCarrusel";

const Historypage = () => {
  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section className="relative overflow-hidden">
        <div className="relative w-full flex justify-center items-center">
          <img
            src={BannerImg}
            alt="Banner"
            className="w-full h-auto object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div
          className="relative w-full flex items-center justify-center"
          style={{ position: "absolute", top: 0, left: 0, height: "100%", pointerEvents: "none" }}
        >
          <div className="container mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-6 drop-shadow-lg text-white">
                Nuestra Historia
              </h1>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="py-18 bg-transparent">
        <div className="md:px-12">
          <UsPlan />
          <HistoryCarrusel />
          <CardUS />
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
