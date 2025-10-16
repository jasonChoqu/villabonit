import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { VideoContentService } from "@/core/services/video/video-content.service";
import type { IVideoContent } from "@/core/types/IVideoContent";

const VideoInHome = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [videoContent, setVideoContent] = useState<IVideoContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar contenido del video desde la API
  useEffect(() => {
    const loadVideoContent = async () => {
      try {
        setLoading(true);
        const response = await VideoContentService.getMainVideo();
        if (response.success) {
          setVideoContent(response.data);
        } else {
          setError('No se pudo cargar el contenido del video');
        }
      } catch (err) {
        console.error('Error loading video content:', err);
        setError('Error al cargar el contenido del video');
      } finally {
        setLoading(false);
      }
    };

    loadVideoContent();
  }, []);

  useGSAP(() => {
    if (!sectionRef.current) return;
    const content = sectionRef.current.querySelector('.gsap-video-content');
    // Initial state: left for content
    gsap.set(content, { opacity: 0, x: -80 });
    let lastScrollY = window.scrollY;
    const showDown = () => {
      gsap.to(content, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
    };
    const showUp = () => {
      gsap.to(content, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' });
    };
    const hideDown = () => {
      gsap.to(content, { opacity: 0, x: -80, duration: 0.5, ease: 'power3.in' });
    };
    const hideUp = () => {
      gsap.to(content, { opacity: 0, x: 80, duration: 0.5, ease: 'power3.in' });
    };
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        const currentScrollY = window.scrollY;
        const scrollingDown = currentScrollY > lastScrollY;
        lastScrollY = currentScrollY;
        if (entry.isIntersecting) {
          if (scrollingDown) {
            showDown();
          } else {
            showUp();
          }
        } else {
          if (scrollingDown) {
            hideDown();
          } else {
            hideUp();
          }
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, { scope: sectionRef });

  // Mostrar estado de carga
  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8 items-center animate-pulse">
              <div className="md:w-1/2">
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
              <div className="md:w-1/2 w-full">
                <div className="aspect-video w-full bg-gray-300 rounded-xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Mostrar estado de error
  if (error || !videoContent) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600">
              {error || 'No hay contenido de video disponible'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 md:px-12">
        <div ref={sectionRef} className="max-w-6xl mx-auto">
          <div className="gsap-video-content flex flex-col md:flex-row gap-8 items-center">
            <div className="md:w-1/2">
              <p className="text-lg text-gray-600">
                {videoContent.description}
              </p>
            </div>
            <div className="md:w-1/2 w-full">
              <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg">
                <iframe
                  src={videoContent.embed_url}
                  title={videoContent.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoInHome;