import React, { useState, useEffect } from 'react';
import { Upload, X, Star, Image as ImageIcon } from 'lucide-react';
import type { ImageMetadata } from '@/core/types/IImageUpload';
import { IMAGE_TYPES } from '@/core/types/IImageUpload';

interface ImageUploadSectionProps {
  selectedFiles: File[];
  previewUrls: string[];
  isUploading: boolean;
  onFileSelection: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onConfirmUpload: (metadata: ImageMetadata[], featuredIndex?: number) => void;
  onCancelSelection: () => void;
}

const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  selectedFiles,
  previewUrls,
  isUploading,
  onFileSelection,
  onConfirmUpload,
  onCancelSelection,
}) => {
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata[]>([]);
  const [featuredIndex, setFeaturedIndex] = useState<number | undefined>(undefined);
  const [showMetadata, setShowMetadata] = useState(false);

  // Inicializar metadata cuando cambian los archivos seleccionados
  useEffect(() => {
    if (selectedFiles.length > 0) {
      const newMetadata = selectedFiles.map(() => ({
        type: 'main',
        altText: '',
        description: '',
      }));
      setImageMetadata(newMetadata);
      setFeaturedIndex(0); // Por defecto, la primera imagen es destacada
      setShowMetadata(true);
    } else {
      setImageMetadata([]);
      setFeaturedIndex(undefined);
      setShowMetadata(false);
    }
  }, [selectedFiles]);

  const updateMetadata = (index: number, field: keyof ImageMetadata, value: string) => {
    const updated = [...imageMetadata];
    updated[index] = { ...updated[index], [field]: value };
    setImageMetadata(updated);
  };

  const handleConfirmUpload = () => {
    onConfirmUpload(imageMetadata, featuredIndex);
  };
  return (
    <div className="space-y-6">
      {/* Sección de selección de archivos */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="image-upload" className="cursor-pointer">
              <span className="mt-2 block text-sm font-medium text-gray-900">
                {isUploading ? "Subiendo..." : "Subir imágenes"}
              </span>
              <span className="mt-1 block text-xs text-gray-500">
                PNG, JPG, GIF hasta 10MB cada una (máximo 20 imágenes)
              </span>
            </label>
            <input
              id="image-upload"
              type="file"
              multiple
              accept="image/*"
              onChange={onFileSelection}
              disabled={isUploading}
              className="hidden"
            />
            <button
              type="button"
              disabled={isUploading}
              onClick={() => document.getElementById('image-upload')?.click()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isUploading ? "Subiendo..." : "Seleccionar Imágenes"}
            </button>
          </div>
        </div>
      </div>

      {/* Preview de imágenes seleccionadas */}
      {selectedFiles.length > 0 && (
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Vista Previa ({selectedFiles.length} imagen{selectedFiles.length !== 1 ? 'es' : ''} seleccionada{selectedFiles.length !== 1 ? 's' : ''})
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleConfirmUpload}
                disabled={isUploading}
                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium rounded-md"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Confirmar Subida
                  </>
                )}
              </button>
              <button
                onClick={onCancelSelection}
                disabled={isUploading}
                className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white text-sm font-medium rounded-md"
              >
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </button>
              <button
                onClick={() => setShowMetadata(!showMetadata)}
                disabled={isUploading}
                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-md"
              >
                <ImageIcon className="w-4 h-4 mr-2" />
                {showMetadata ? 'Ocultar' : 'Configurar'} Metadatos
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className={`w-full h-32 object-cover rounded-lg border-2 ${
                    featuredIndex === index ? 'border-yellow-400' : 'border-blue-300'
                  }`}
                />
                <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg"></div>
                
                {/* Botón para marcar como destacada */}
                <button
                  onClick={() => setFeaturedIndex(featuredIndex === index ? undefined : index)}
                  className={`absolute top-2 left-2 p-1 rounded-full ${
                    featuredIndex === index 
                      ? 'bg-yellow-500 text-white' 
                      : 'bg-white bg-opacity-80 text-gray-600 hover:bg-yellow-200'
                  }`}
                  title={featuredIndex === index ? 'Imagen destacada' : 'Marcar como destacada'}
                >
                  <Star className={`w-4 h-4 ${featuredIndex === index ? 'fill-current' : ''}`} />
                </button>

                <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {selectedFiles[index].name.length > 15 
                    ? `${selectedFiles[index].name.substring(0, 15)}...` 
                    : selectedFiles[index].name}
                </div>
                <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                  {(selectedFiles[index].size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>
            ))}
          </div>
          
          {/* Panel de metadatos */}
          {showMetadata && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <ImageIcon className="w-5 h-5 mr-2" />
                Configuración de Imágenes
              </h4>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center mb-3">
                      <img
                        src={previewUrls[index]}
                        alt={`Preview ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border mr-3"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900 flex items-center">
                          {file.name}
                          {featuredIndex === index && (
                            <Star className="w-4 h-4 ml-2 text-yellow-500 fill-current" />
                          )}
                        </h5>
                        <p className="text-sm text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo de Imagen
                        </label>
                        <select
                          value={imageMetadata[index]?.type || 'main'}
                          onChange={(e) => updateMetadata(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                          {IMAGE_TYPES.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Texto Alternativo
                        </label>
                        <input
                          type="text"
                          value={imageMetadata[index]?.altText || ''}
                          onChange={(e) => updateMetadata(index, 'altText', e.target.value)}
                          placeholder="Descripción para accesibilidad"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Descripción
                        </label>
                        <input
                          type="text"
                          value={imageMetadata[index]?.description || ''}
                          onChange={(e) => updateMetadata(index, 'description', e.target.value)}
                          placeholder="Descripción detallada"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploadSection;