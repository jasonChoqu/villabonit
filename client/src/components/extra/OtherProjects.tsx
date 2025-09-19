import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { images } from "@/assets/images";

// Interfaz para la estructura de cada proyecto
interface ProjectData {
  paragraphs: string[];
  images: string[];
}

// Tipo para projectsData usando los nombres de los proyectos como claves
type ProjectsData = Record<"Casas 4k" | "Plaza Pozo Colorao" | "Condominio Acarai" | "Av. Achachachairu", ProjectData>;

const OtherProjects = () => {
  const [selectedProject, setSelectedProject] = useState<
    "Casas 4k" | "Plaza Pozo Colorao" | "Condominio Acarai" | "Av. Achachachairu" | null
  >("Casas 4k"); // Valor por defecto explícito

  // Contenido para cada proyecto con imágenes de assets
  const projectsData: ProjectsData = {
    "Casas 4k": {
      paragraphs: [
        "Las Casas 4k ofrecen un diseño moderno y funcional, ideales para familias que buscan espacios amplios y confortables. Este proyecto destaca por su alta calidad en construcción y acabados de lujo.",
        "Ubicado en una zona estratégica, cuenta con áreas verdes y seguridad 24/7, siendo una opción ideal para quienes desean un hogar contemporáneo.",
      ],
      images: [images.altosvilla, images.afiliates, images.paseovilla],
    },
    "Plaza Pozo Colorao": {
      paragraphs: [
        "Plaza Pozo Colorao es un proyecto comercial vibrante que combina locales modernos con áreas de esparcimiento. Perfecto para emprendedores y negocios en crecimiento.",
        "Incluye estacionamiento amplio y diseño arquitectónico innovador, consolidándose como un punto de referencia en la ciudad.",
      ],
      images: [images.afiliates, images.lagunamaggiore],
    },
    "Condominio Acarai": {
      paragraphs: [
        "Condominio Acarai ofrece un estilo de vida exclusivo con departamentos de alta gama. Diseñado para brindar comodidad y privacidad a sus residentes.",
        "Cuenta con piscina, gimnasio y áreas recreativas, siendo una opción premium en el mercado inmobiliario.",
      ],
      images: [images.altosvilla, images.lagunamaggiore, images.paseovilla],
    },
    "Av. Achachachairu": {
      paragraphs: [
        "Av. Achachachairu es un desarrollo innovador ubicado en una de las avenidas más transitadas, ideal para inversiones comerciales y residenciales.",
        "Este proyecto incluye modernas infraestructuras y acceso privilegiado a servicios urbanos.",
      ],
      images: [images.afiliates, images.paseovilla],
    },
  };

  // Lista tipada de claves de proyectos para reutilizar en select/botones
  const projectKeys = Object.keys(projectsData) as Array<keyof ProjectsData>;

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollSpeed = 0.5; // Velocidad del desplazamiento
    let animationId: number;
    let leftPosition = 0;

    const animate = () => {
      leftPosition -= scrollSpeed;

      // Reinicia la posición cuando llega al final de ambos conjuntos de imágenes
      if (leftPosition <= -container.scrollWidth / 2) {
        leftPosition = 0;
      }

      container.style.transform = `translateX(${leftPosition}px)`;
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <section className="py-12 bg-transparent">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 mb-8">
          <span>Otros</span>
          <br />
          <span>Proyectos</span>
        </h2>

        {/* Mobile: Dropdown */}
        <div className="md:hidden mb-8">
          <label htmlFor="project-select" className="sr-only">
            Selecciona proyecto
          </label>
          <div className="relative">
            <select
              id="project-select"
              value={(selectedProject ?? projectKeys[0]) as string}
              onChange={(e) => setSelectedProject(e.target.value as keyof ProjectsData)}
              className="w-full appearance-none px-4 py-2 pr-12 border-2 rounded-xl font-bold bg-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/60"
            >
              {projectKeys.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <svg
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-700"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 9l6 6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Desktop/Tablet: Button group */}
        <div className="hidden md:flex gap-3 space-x-4 mb-8 flex-wrap">
          {projectKeys.map((project) => (
            <button
              key={project}
              onClick={() => setSelectedProject(project as keyof ProjectsData)}
              className={`px-4 py-2 border-2 rounded-xl font-bold transition-colors ${
                selectedProject === project
                  ? "text-white bg-black border-black"
                  : "text-black bg-gray-300 border-gray-300 hover:border-gray-300 "
              }`}
            >
              {project}
            </button>
          ))}
        </div>

        {selectedProject && (
          <div className="mb-8">
            {projectsData[selectedProject].paragraphs.map((paragraph: string, index: number) => (
              <p key={index} className="text-gray-700 mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        )}

        {selectedProject && (
          <div className="relative w-full overflow-x-hidden overflow-y-hidden">
            <div ref={containerRef} className="flex w-max gap-5 items-center whitespace-nowrap">
              {[...projectsData[selectedProject].images, ...projectsData[selectedProject].images].map(
                (image: string, index: number) => (
                  <motion.div key={index} whileHover={{ scale: 1.05 }} className="flex-shrink-0">
                    <img
                      src={image}
                      alt={`${selectedProject} Image ${(index % projectsData[selectedProject].images.length) + 1}`}
                      className="h-64 object-cover opacity-80 hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  </motion.div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OtherProjects;
