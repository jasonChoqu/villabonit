import { motion } from "framer-motion";
import LogoImg from "@/assets/images/isologo-blanco.svg";

import UsPlan from "@/components/extra/UsPlan";
import CardUS from "@/components/extra/CardsUS";
import CardUS2 from "@/components/extra/CardsUS2";
import Founders from "@/components/extra/founders";
import foundersImage from "@/assets/images/fundadores.png";
import HistorySection from "@/components/extra/HistorySection";
import HistoryCarrusel from "@/components/extra/HistoryCarrusel";
import { useEffect, useMemo, useRef, useState } from "react";
import { createApiService } from "@/core/services/api.service";

const Historypage = () => {
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [_imageError, setImageError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [triedFallback, setTriedFallback] = useState(false);
  const isMountedRef = useRef(true);

  const baseUrl = useMemo(
    () => import.meta.env.VITE_API_URL?.replace("/api", "") || window.location.origin,
    []
  );
  const defaultBanner = `${baseUrl}/assets/banners/us_default.png`;

  useEffect(() => {
    isMountedRef.current = true;
    const fetchBanner = async () => {
      try {
        const ImageService = createApiService({ basePath: "banners" });
        const response = await ImageService.get("all");
        const bannerImage = response.data?.find?.((item: any) => item.id === 1);
        if (isMountedRef.current) {
          setBannerUrl(bannerImage ? `${baseUrl}/${bannerImage.image}` : defaultBanner);
        }
      } catch {
        if (isMountedRef.current) setBannerUrl(defaultBanner);
      } finally {
        if (isMountedRef.current) setLoading(false);
      }
    };
    
    fetchBanner();
    return () => {
      isMountedRef.current = false;
    };
  }, [baseUrl, defaultBanner]);

  // Pre-carga: cuando cambia bannerUrl, resetea estados y marca loaded al terminar
  useEffect(() => {
    if (!bannerUrl) return;
    setImageLoaded(false);
    setImageError(false);
    const img = new Image();
    img.src = bannerUrl;
    const onLoad = () => isMountedRef.current && setImageLoaded(true);
    const onError = () => {
      if (!isMountedRef.current) return;
      // Si falla la imagen remota, intenta una sola vez el fallback
      if (!triedFallback && bannerUrl !== defaultBanner) {
        setTriedFallback(true);
        setBannerUrl(defaultBanner);
      } else {
        setImageError(true);
        setImageLoaded(true); // evita overlay infinito
      }
    };
    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [bannerUrl, defaultBanner, triedFallback]);

  // Loader inicial SOLO por API
  const LoaderScreen = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 z-[9999]">
      <motion.img
        src={LogoImg}
        alt="Logo Villa Bonita"
        className="w-32 h-20 mb-6 object-contain"
        initial={{ opacity: 0, scale: 0.3 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
          scale: { type: "spring", stiffness: 120, damping: 15 },
        }}
        whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
      />
      <p className="text-lg font-medium text-yellow-700 dark:text-yellow-300 animate-pulse text-center">
        Construyendo tu experiencia digital…
      </p>
    </div>
  );

  if (loading) return <LoaderScreen />;

  const imageSource = bannerUrl || defaultBanner;

  return (
    <div className="flex flex-col">
      {/* Banner */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 group overflow-hidden">
          <img
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={imageSource}
            alt="Hero image"
            // onLoad/onError del <img> quedan como respaldo;
            // la pre-carga ya gestiona imageLoaded, pero esto cubre sustituciones dinámicas.
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              if (!triedFallback && imageSource !== defaultBanner) {
                setTriedFallback(true);
                setBannerUrl(defaultBanner);
              } else {
                setImageError(true);
                setImageLoaded(true);
              }
            }}
            style={{
              opacity: imageLoaded ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
            }}
          />

          {/* Overlay mientras la imagen carga */}
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
              <motion.img
                src={LogoImg}
                alt="Logo Villa Bonita"
                className="w-24 h-16 object-contain"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 1.2,
                  ease: "easeOut",
                  scale: { type: "spring", stiffness: 120, damping: 15 },
                }}
              />
            </div>
          )}

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
