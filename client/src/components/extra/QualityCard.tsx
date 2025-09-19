import type { ReactNode } from 'react';

interface QualityCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function QualityCard({ icon, title, description, className = '' }: QualityCardProps) {
  return (
    <div className={`
      bg-white rounded-xl shadow-md p-6 flex flex-col
      transition-all duration-300 hover:shadow-lg
      hover:-translate-y-2 hover:border-[#5e5286] hover:border
      ${className}
    `}>
      <div className="text-[#5e5286] text-3xl mb-4 transition-transform duration-300 hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">{title}</h3>
      <p className="text-gray-600 mb-4 group-hover:text-gray-700">{description}</p>
      <button className="mt-auto flex items-center text-[#5e5286] font-medium hover:text-[#7a6da6] transition-colors cursor-pointer">
        Ver más <span className="ml-2">→</span>
      </button>
    </div>
  );
}