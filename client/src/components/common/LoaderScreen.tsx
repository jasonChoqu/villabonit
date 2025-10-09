import { motion } from "framer-motion";
import LogoImg from "@/assets/images/isologo-blanco.svg";

export default function LoaderScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen z-9999" style={{ backgroundColor: '#101828' }}>
            {/* Logo animado con efecto zoom */}
            <motion.img
                src={LogoImg}
                alt="Logo Villa Bonita"
                className="w-32 h-20 mb-6 object-contain"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ 
                    duration: 1.2,
                    ease: "easeOut",
                    scale: {
                        type: "spring",
                        stiffness: 120,
                        damping: 15
                    }
                }}
                whileHover={{ 
                    scale: 1.1,
                    transition: { duration: 0.2 }
                }}
            />

            <p className="text-lg font-medium text-yellow-700 dark:text-yellow-300 animate-pulse text-center">
                Construyendo tu experiencia digital…
            </p>
        </div>
    );
}
