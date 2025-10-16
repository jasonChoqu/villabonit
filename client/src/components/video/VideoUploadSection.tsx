import React, { useState, useEffect } from 'react';
import { Plus, X, Star, Video, Play, Settings } from 'lucide-react';
import type { VideoMetadata } from '@/core/types/IPropertyVideo';
import { VIDEO_TYPES, validateYouTubeUrl, extractVideoId } from '@/core/types/IPropertyVideo';

interface VideoUploadSectionProps {
  isUploading: boolean;
  onAddVideo: (metadata: VideoMetadata & { youtube_url: string }, isFeatured?: boolean) => void;
}

const VideoUploadSection: React.FC<VideoUploadSectionProps> = ({
  isUploading,
  onAddVideo,
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoMetadata, setVideoMetadata] = useState<VideoMetadata>({
    title: '',
    description: '',
    video_type: 'tour_virtual',
    allow_autoplay: false,
    show_controls: true,
    show_info: true,
  });
  const [isFeatured, setIsFeatured] = useState(false);
  const [showMetadata, setShowMetadata] = useState(false);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isValidUrl, setIsValidUrl] = useState(false);

  // Validar URL cuando cambia
  useEffect(() => {
    if (youtubeUrl.trim()) {
      const valid = validateYouTubeUrl(youtubeUrl);
      setIsValidUrl(valid);
      if (valid) {
        const id = extractVideoId(youtubeUrl);
        setVideoId(id);
      } else {
        setVideoId(null);
      }
    } else {
      setIsValidUrl(false);
      setVideoId(null);
    }
  }, [youtubeUrl]);

  const updateMetadata = (field: keyof VideoMetadata, value: any) => {
    setVideoMetadata(prev => ({ ...prev, [field]: value }));
  };

  const handleAddVideo = () => {
    if (!youtubeUrl.trim() || !isValidUrl) return;
    
    onAddVideo({
      ...videoMetadata,
      youtube_url: youtubeUrl.trim(),
    }, isFeatured);
    
    // Reset form
    setYoutubeUrl('');
    setVideoMetadata({
      title: '',
      description: '',
      video_type: 'tour_virtual',
      allow_autoplay: false,
      show_controls: true,
      show_info: true,
    });
    setIsFeatured(false);
    setShowMetadata(false);
  };

  const cancelForm = () => {
    setYoutubeUrl('');
    setVideoMetadata({
      title: '',
      description: '',
      video_type: 'tour_virtual',
      allow_autoplay: false,
      show_controls: true,
      show_info: true,
    });
    setIsFeatured(false);
    setShowMetadata(false);
  };

  return (
    <div className="space-y-6">
      {/* Sección de entrada de URL */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
        <div className="text-center">
          <Video className="mx-auto h-12 w-12 text-gray-400" />
          <div className="mt-4">
            <label htmlFor="youtube-url" className="block text-sm font-medium text-gray-900 mb-2">
              URL de YouTube
            </label>
            <input
              id="youtube-url"
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
              disabled={isUploading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                youtubeUrl && !isValidUrl 
                  ? 'border-red-300 focus:ring-red-500' 
                  : isValidUrl 
                    ? 'border-green-300 focus:ring-green-500'
                    : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {youtubeUrl && !isValidUrl && (
              <p className="mt-1 text-sm text-red-600">
                URL de YouTube no válida
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Ingresa una URL válida de YouTube
            </p>
          </div>
        </div>
      </div>

      {/* Preview del video */}
      {isValidUrl && videoId && (
        <div className="border border-blue-200 bg-blue-50 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Vista Previa del Video
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={handleAddVideo}
                disabled={isUploading || !isValidUrl}
                className={`inline-flex items-center px-4 py-2 text-white text-sm font-medium rounded-md disabled:opacity-50 ${
                  !isValidUrl || isUploading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Agregando...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Video
                  </>
                )}
              </button>
              <button
                onClick={cancelForm}
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
                <Settings className="w-4 h-4 mr-2" />
                {showMetadata ? 'Ocultar' : 'Configurar'}
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Thumbnail del video */}
            <div className="relative">
              <img
                src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                alt="Video thumbnail"
                className={`w-full h-48 object-cover rounded-lg border-2 ${
                  isFeatured ? 'border-yellow-400' : 'border-blue-300'
                }`}
              />
              <div className="absolute inset-0 bg-blue-500 bg-opacity-20 rounded-lg"></div>
              
              {/* Botón para marcar como destacado */}
              <button
                onClick={() => setIsFeatured(!isFeatured)}
                className={`absolute top-2 left-2 p-1 rounded-full ${
                  isFeatured 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-white bg-opacity-80 text-gray-600 hover:bg-yellow-200'
                }`}
                title={isFeatured ? 'Video destacado' : 'Marcar como destacado'}
              >
                <Star className={`w-4 h-4 ${isFeatured ? 'fill-current' : ''}`} />
              </button>

              <div className="absolute bottom-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                Video ID: {videoId}
              </div>
            </div>

            {/* Información básica */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título del Video
                </label>
                <input
                  type="text"
                  value={videoMetadata.title}
                  onChange={(e) => updateMetadata('title', e.target.value)}
                  placeholder="Título descriptivo del video"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Video
                </label>
                <select
                  value={videoMetadata.video_type}
                  onChange={(e) => updateMetadata('video_type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  {VIDEO_TYPES.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  value={videoMetadata.description}
                  onChange={(e) => updateMetadata('description', e.target.value)}
                  placeholder="Descripción del video"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
          
          {/* Panel de configuraciones avanzadas */}
          {showMetadata && (
            <div className="mt-6 space-y-4 border-t pt-4">
              <h4 className="text-md font-medium text-gray-900 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuraciones de Reproducción
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="allow_autoplay"
                    checked={videoMetadata.allow_autoplay}
                    onChange={(e) => updateMetadata('allow_autoplay', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="allow_autoplay" className="text-sm text-gray-700">
                    Reproducción automática
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show_controls"
                    checked={videoMetadata.show_controls}
                    onChange={(e) => updateMetadata('show_controls', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="show_controls" className="text-sm text-gray-700">
                    Mostrar controles
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show_info"
                    checked={videoMetadata.show_info}
                    onChange={(e) => updateMetadata('show_info', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="show_info" className="text-sm text-gray-700">
                    Mostrar información
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VideoUploadSection;