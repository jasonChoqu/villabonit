import { motion } from "framer-motion";
import BannerImg from "@/assets/images/afiliates.jpg";
import { images } from "@/assets/images";
import Projects from "@/components/extra/ProjectsPrev";
import ProjectsGallery from "@/components/extra/ProjectsGallery";
import OtherProjects from "@/components/extra/OtherProjects";


const AffiliatesPage = () => {
  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url(${BannerImg})`,
          }}
        >
          <div className="absolute bottom-0 left-0 right-0 h-1/6 bg-gradient-to-t from-white to-transparent" />
        </div>

        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-6 md:px-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: -60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-9xl md:text-10xl lg:text-11xl font-bold leading-tight mb-4 drop-shadow-lg text-white">
                Proyectos
              </h1>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="absolute bottom-0 left-0 right-0 flex justify-center pb-8"
            >
              <img 
                src={images.logovillabonita1} 
                alt="Logo Villa Bonita" 
                className="h-12 md:h-20 lg:h-28 w-auto" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contenido principal */}
      <section className="py-8 bg-transparent">
        <div className="md:px-12">
          < Projects />
          < ProjectsGallery />
          < OtherProjects />
        </div>
      </section>
    </div>
  );
};

export default AffiliatesPage;