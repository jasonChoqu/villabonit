export default function LoaderScreen() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 z-9999">
            <div className="relative w-40 h-40 mb-6">
                {/* Círculo exterior estilo construcción */}
                <div className="absolute inset-0 rounded-full border-[4px] border-yellow-500 dark:border-yellow-400 shadow-lg"></div>

                {/* Iconos en los bordes (herramientas construcción) */}
                <div className="absolute inset-5 rounded-full border border-gray-400 dark:border-gray-700 flex items-center justify-center">
                    <span className="absolute top-0 text-sm font-bold text-yellow-600 dark:text-yellow-300 -translate-y-1/2">🛠️</span>
                    <span className="absolute right-0 text-sm font-bold text-yellow-600 dark:text-yellow-300 translate-x-1/2">🏗️</span>
                    <span className="absolute bottom-0 text-sm font-bold text-yellow-600 dark:text-yellow-300 translate-y-1/2">🚧</span>
                    <span className="absolute left-0 text-sm font-bold text-yellow-600 dark:text-yellow-300 -translate-x-1/2">⚙️</span>
                </div>

                {/* Aguja giratoria estilo cinta de precaución */}
                <div className="absolute top-1/2 left-1/2 w-full h-full -translate-x-1/2 -translate-y-1/2">
                    <div className="relative w-full h-full animate-spin-slow">
                        <div className="absolute top-2 left-1/2 w-2 h-1/2 bg-yellow-600 rounded-t-full -translate-x-1/2 shadow-md"></div>
                        <div className="absolute bottom-2 left-1/2 w-2 h-1/2 bg-black rounded-b-full -translate-x-1/2 shadow-md"></div>
                    </div>
                </div>

                {/* Centro con casco de construcción */}
                <div className="absolute top-1/2 left-1/2 w-10 h-10 flex items-center justify-center bg-yellow-500 dark:bg-yellow-300 rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 border-2 border-black text-black text-xl">
                    👷
                </div>
            </div>

            <p className="text-lg font-medium text-yellow-700 dark:text-yellow-300 animate-pulse text-center">
                Construyendo tu experiencia digital…
            </p>

            <style>
                {`
                @keyframes spin-slow {
                  0% { transform: rotate(0deg); }
                  100% { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                  animation: spin-slow 5s linear infinite;
                }
                `}
            </style>
        </div>
    );
}
