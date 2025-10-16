import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { PropertyService } from '@/core/services/properties/property.service';
import type { IProperty as IItemResource, IPropertyImage } from '@/core/types/IProperties';

interface PropertyViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: IItemResource | null;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  }).format(amount);
};

const PropertyViewModal: React.FC<PropertyViewModalProps> = ({ isOpen, onClose, property }) => {
  const [images, setImages] = useState<IPropertyImage[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && property) {
      loadImages();
    }
  }, [isOpen, property]);

  const loadImages = async () => {
    if (!property) return;
    
    setLoading(true);
    try {
      const response = await PropertyService.getPropertyImages(property.id);
      console.log('Images response:', response);
      console.log('Images data:', response.data);
      setImages(response.data || []);
      setSelectedImageIndex(0);
    } catch (error) {
      console.error('Error loading images:', error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { label: 'Disponible', className: 'bg-green-100 text-green-800' },
      sold: { label: 'Vendida', className: 'bg-red-100 text-red-800' },
      rented: { label: 'Alquilada', className: 'bg-yellow-100 text-yellow-800' },
      default: { label: 'No especificado', className: 'bg-gray-100 text-gray-800' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.default;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (!isOpen || !property) return null;

  const currentImage = images[selectedImageIndex];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Detalles de la Propiedad</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Información Principal */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">{property.title}</h3>
                <div className="text-3xl font-bold text-green-600 mb-4">
                  {formatCurrency(Number(property.price))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Tipo:</span>
                  <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {property.property_type || 'No especificado'}
                  </span>
                  </div>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Estado:</span>
                  <div className="mt-1">
                    {getStatusBadge(property.status)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500 block">Habitaciones</span>
                  <span className="text-lg font-bold text-gray-900">{property.bedrooms || 'N/A'}</span>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500 block">Baños</span>
                  <span className="text-lg font-bold text-gray-900">{property.bathrooms || 'N/A'}</span>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-500 block">Área</span>
                  <span className="text-lg font-bold text-gray-900">
                    {property.area_m2 ? `${property.area_m2} m²` : 'N/A'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500 block mb-2">Dirección:</span>
                <p className="text-gray-900">{property.address || 'No especificada'}</p>
              </div>

              {property.description && (
                <div>
                  <span className="text-sm font-medium text-gray-500 block mb-2">Descripción:</span>
                  <p className="text-gray-900 whitespace-pre-wrap">{property.description}</p>
                </div>
              )}
            </div>

            {/* Galería de Imágenes */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Galería de Imágenes ({images.length})
              </h4>
              
              {loading ? (
                <div className="flex justify-center items-center h-80 bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2 text-gray-600">Cargando imágenes...</span>
                </div>
              ) : images.length > 0 ? (
                <div className="space-y-4">
                  {/* Imagen Principal */}
                  <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={currentImage.image_url || currentImage.thumbnail_url || `${import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin}/${String(currentImage.image_path).replace(/^\/+/, "")}`}
                      alt={`Imagen ${selectedImageIndex + 1} de ${property.title}`}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        console.error('Error loading image:', {
                          src: e.currentTarget.src,
                          image_url: currentImage.image_url,
                          thumbnail_url: currentImage.thumbnail_url,
                          image_path: currentImage.image_path,
                          VITE_API_URL: import.meta.env.VITE_API_URL,
                          window_origin: window.location.origin
                        });
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', {
                          src: e.currentTarget.src,
                          image_url: currentImage.image_url
                        });
                      }}
                    />
                    
                    {/* Indicador de imagen destacada */}
                    {currentImage.is_featured && (
                      <div className="absolute top-3 right-3 bg-yellow-500 bg-opacity-90 rounded-full p-1">
                        <Star className="w-4 h-4 text-white fill-current" />
                      </div>
                    )}

                    {/* Controles de navegación */}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={handlePrevImage}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={handleNextImage}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-opacity"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}

                    {/* Indicador de posición */}
                    {images.length > 1 && (
                      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                        {selectedImageIndex + 1} / {images.length}
                      </div>
                    )}
                  </div>

                  {/* Miniaturas */}
                  {images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {images.map((image, index) => (
                        <div key={image.id} className="relative">
                          <img
                            src={image.thumbnail_url || image.image_url || `${import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin}/${String(image.image_path).replace(/^\/+/, "")}`}
                            alt={`Miniatura ${index + 1}`}
                            className={`w-full h-16 object-cover rounded cursor-pointer transition-all ${
                              index === selectedImageIndex
                                ? 'ring-2 ring-blue-500 ring-offset-1'
                                : 'hover:opacity-75'
                            }`}
                            onClick={() => setSelectedImageIndex(index)}
                          />
                          {image.is_featured && (
                            <div className="absolute top-1 right-1 bg-yellow-500 bg-opacity-90 rounded-full p-0.5">
                              <Star className="w-2 h-2 text-white fill-current" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center h-80 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">No hay imágenes disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyViewModal;