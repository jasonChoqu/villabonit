import React from 'react';
import { Star, X } from 'lucide-react';

interface Image {
  id: number;
  image_url?: string;
  thumbnail_url?: string;
  image_path?: string;
  alt_text?: string;
  is_featured: boolean;
  image_type?: string;
  formatted_file_size?: string;
}

interface ImageGallerySectionProps {
  images: Image[];
  isLoading: boolean;
  onSetFeatured: (imageId: number) => void;
  onDeleteImage: (imageId: number) => void;
}

const ImageGallerySection: React.FC<ImageGallerySectionProps> = ({
  images,
  isLoading,
  onSetFeatured,
  onDeleteImage,
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Imágenes de la Propiedad ({images.length})
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay imágenes para esta propiedad
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image: Image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={image.image_url || image.thumbnail_url || `${import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin}/${String(image.image_path).replace(/^\/+/, "")}`}
                  alt={image.alt_text || 'Imagen de propiedad'}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Overlay con acciones */}
              <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                  <button
                    onClick={() => onSetFeatured(image.id)}
                    className={`p-2 rounded-full ${image.is_featured ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'} hover:bg-yellow-500 hover:text-white transition-colors`}
                    title={image.is_featured ? 'Imagen destacada' : 'Establecer como destacada'}
                  >
                    <Star className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteImage(image.id)}
                    className="p-2 rounded-full bg-white text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                    title="Eliminar imagen"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Indicador de imagen destacada */}
              {image.is_featured && (
                <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium">
                  Destacada
                </div>
              )}
              
              {/* Información de la imagen */}
              <div className="mt-2 text-xs text-gray-500">
                <div>{image.image_type || 'main'}</div>
                <div>{image.formatted_file_size || 'N/A'}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGallerySection;