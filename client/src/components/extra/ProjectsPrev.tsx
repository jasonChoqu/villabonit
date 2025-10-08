import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { images } from "@/assets/images";
import { ProjectService } from "@/core/services/project/project.service";
import type { IProject } from "@/core/types/IProject";

interface Project {
  id: number;
  title: string;
  description: string;
  logo: string;
  expandedContent: {
    title: string;
    paragraphs: string[];
  };
}

const Projects = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Datos estáticos como fallback
  const staticProjects: Project[] = [
    {
      id: 1,
      title: "Altos Villa Bonita",
      description: "Desarrollo residencial diseñado para ofrecer comodidad, calidad y funcionalidad. Pensado para familias de hasta cinco integrantes, este conjunto de viviendas destaca por su alta demanda y rápida comercialización, consolidándose como una opción ideal para quienes buscan un hogar bien estructurado y accesible",
      logo: images.altosvilla,
      expandedContent: {
        title: "Características del proyecto",
        paragraphs: [
          "Numero de viviendas 32 departamentos (8 bloques de 4 unidades cada uno)",
          "Superficie construida 3.840 m²",
          "Duracion del proyecto 18 meses",
          "ㅤ",
          "Espacios limpios, lineas simples y una arquitectura funcional hacen de laguna maggiore un referente en diseño minimalista, donde menos es más y cada detalle aporta armonia y equilibrio",
          "Un hogar donde la estetica y la funcionalidad conviven en perfecta armonia, privilegiada, rodeadas de vegetacion para un ambiente mas fresco y acogedor",
        ]
      }
    },
    {
      id: 2,
      title: "Laguna Maggiore",
      description: "Paseo de Villa Bonita es un desarrollo residencial que combina un diseño moderno con un entorno natural cuidadosamente integrado. Con un enfoque en accesibilidad y calidad, este proyecto ofrece viviendas funcionales y bien distribuidas en una zona privilegiada, rodeadas de vegetación para un ambiente más fresco y acogedor.",
      logo: images.lagunamaggiore,
      expandedContent: {
        title: "Características del proyecto",
        paragraphs: [
          "Numero de viviendas 32 departamentos (8 bloques de 4 unidades cada uno)",
          "Superficie construida 3.840 m²",
          "Duracion del proyecto 18 meses",
          "ㅤ",
          "Espacios limpios, lineas simples y una arquitectura funcional hacen de laguna maggiore un referente en diseño minimalista, donde menos es más y cada detalle aporta armonia y equilibrio",
          "Un hogar donde la estetica y la funcionalidad conviven en perfecta armonia, privilegiada, rodeadas de vegetacion para un ambiente mas fresco y acogedor",
        ]
      }
    },
    {
      id: 3,
      title: "Paseo Villa Bonita",
      description: "Paseo de Villa Bonita es un diseño moderno con un entorno natural cuidadosamente integrado. Con un enfoque en accesibilidad y calidad, este proyecto ofrece viviendas funcionales y bien distribuidas en una zona.",
      logo: images.paseovilla,
      expandedContent: {
        title: "Características del proyecto",
        paragraphs: [
          "Numero de viviendas 32 departamentos (8 bloques de 4 unidades cada uno)",
          "Superficie construida 3.840 m²",
          "Duracion del proyecto 18 meses",
          "ㅤ",
          "Espacios limpios, lineas simples y una arquitectura funcional hacen de laguna maggiore un referente en diseño minimalista, donde menos es más y cada detalle aporta armonia y equilibrio",
          "Un hogar donde la estetica y la funcionalidad conviven en perfecta armonia, privilegiada, rodeadas de vegetacion para un ambiente mas fresco y acogedor",
        ]
      }
    }
  ];

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await ProjectService.getAll();
        const apiProjects: IProject[] = response.data;
        
        if (apiProjects && apiProjects.length > 0) {
          // Transformar los datos de la API al formato necesario
          const transformedProjects: Project[] = apiProjects.map(project => ({
            id: project.id,
            title: project.title,
            description: project.description,
            logo: project.image_url || images.altosvilla, // Usar imagen por defecto si no hay imagen
            expandedContent: {
              title: "Características del proyecto",
              paragraphs: project.features
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
            }
          }));
          
          setProjects(transformedProjects);
        } else {
          // Si no hay datos de la API, usar datos estáticos
          setProjects(staticProjects);
        }
      } catch (error) {
        console.error("Error al cargar proyectos desde la API, usando datos estáticos:", error);
        // En caso de error, usar datos estáticos
        setProjects(staticProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-lg text-gray-600">Cargando proyectos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {projects.map((project) => (
        <div key={project.id} className="mb-16 last:mb-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo a la izquierda */}
            <div className="flex-1 flex justify-center md:justify-start order-1 md:order-1">
              <img 
                src={project.logo} 
                alt={`Logo ${project.title}`}
                className="max-w-xs w-full h-auto" 
              />
            </div>
            
            {/* Texto a la derecha (sin título) */}
            <div className="flex-1 order-2 md:order-2 p-4">
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                {project.description}
              </p>
              <button
                onClick={() => toggleExpand(project.id)}
                className="px-1 py-1 font-bold text-blue-600 transition-colors"
              >
                {expandedId === project.id ? "Mostrar menos" : "Conoce más"}
              </button>
            </div>
          </div>
          
          {/* Contenido expandido */}
          <AnimatePresence>
            {expandedId === project.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 overflow-hidden"
              >
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">
                    {project.expandedContent.title}
                  </h4>
                  {project.expandedContent.paragraphs.map((paragraph, index) => (
                    <p key={index} className="text-gray-600 mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
};

export default Projects;