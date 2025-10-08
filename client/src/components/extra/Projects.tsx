import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProjectService } from "@/core/services/project/project.service";
import type { IProject } from "@/core/types/IProject";

interface ProjectWithExpanded extends IProject {
  expandedContent: {
    title: string;
    paragraphs: string[];
  };
}

const Projects = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [projects, setProjects] = useState<ProjectWithExpanded[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await ProjectService.getAll();
        const apiProjects: IProject[] = response.data;
        
        // Transformar los datos de la API al formato necesario
        const transformedProjects: ProjectWithExpanded[] = apiProjects.map(project => ({
          ...project,
          expandedContent: {
            title: "Características del proyecto",
            paragraphs: project.features
              .split('\n')
              .map(line => line.trim())
              .filter(line => line.length > 0)
          }
        }));
        
        setProjects(transformedProjects);
      } catch (error) {
        console.error("Error al cargar proyectos:", error);
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

  if (projects.length === 0) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-lg text-gray-600">No hay proyectos disponibles.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {projects.map((project) => (
        <div key={project.id} className="mb-16 last:mb-0">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Imagen a la izquierda */}
            <div className="flex-1 flex justify-center md:justify-start order-1 md:order-1">
              {project.image_url ? (
                <img 
                  src={project.image_url} 
                  alt={`Proyecto ${project.title}`}
                  className="max-w-xs w-full h-auto rounded-lg shadow-md" 
                />
              ) : (
                <div className="max-w-xs w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">Sin imagen</span>
                </div>
              )}
            </div>
            
            {/* Texto a la derecha */}
            <div className="flex-1 order-2 md:order-2 p-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {project.title}
              </h3>
              <p className="text-gray-600 mb-4 text-lg leading-relaxed">
                {project.description}
              </p>
              <button
                onClick={() => toggleExpand(project.id)}
                className="px-1 py-1 font-bold text-blue-600 transition-colors hover:text-blue-800"
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