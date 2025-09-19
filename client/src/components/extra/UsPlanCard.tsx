import { images } from "@/assets/images";

interface UsPlanCardProps {
  logo?: keyof typeof images;
  title: string;
  content: string;
  highlights?: {
    label: string;
    value: string;
  }[];
}

export default function UsPlanCard({ logo = "logo", title, content, highlights = [] }: UsPlanCardProps) {
  return (
    <div className="w-full max-w-8xl mx-auto bg-transparent rounded-xl overflow-hidden md:p-12 my-8">
      {/* Logo */}
      {logo && (
        <div className="flex justify-center mb-10">
          <img src={images.logovillabonita1} alt="Logo" className="h-28 object-contain" />
        </div>
      )}

      {/* Título */}
      <h2 className="text-2xl md:text-4xl font-bold text-left md:text-center text-gray-800 mb-10 px-5 md:px-8">
        {title}
      </h2>

      {/* Contenido principal */}
      <div className="prose prose-xl text-gray-600 mb-12 px-5 md:px-10">
        {content.split("\n").map((paragraph, i) => (
          <p key={i} className="mb-6 md:text-2xl text-lg leading-7 text-justify">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Puntos destacados */}
      {highlights.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 px-10">
          {highlights.map((item, index) => (
            <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h4 className="font-bold text-xl text-gray-800 mb-2">{item.label}</h4>
              <p className="text-lg text-gray-600">{item.value}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
