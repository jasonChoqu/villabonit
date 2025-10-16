import React from 'react';
import { Star, X, Play, Settings, Edit } from 'lucide-react';
import type { IPropertyVideo } from '@/core/types/IPropertyVideo';
import { VIDEO_TYPES } from '@/core/types/IPropertyVideo';

interface VideoGallerySectionProps {
  videos: IPropertyVideo[];
  isLoading: boolean;
  onSetFeatured: (videoId: number) => void;
  onDeleteVideo: (videoId: number) => void;
  onEditVideo?: (video: IPropertyVideo) => void;
}

const VideoGallerySection: React.FC<VideoGallerySectionProps> = ({
  videos,
  isLoading,
  onSetFeatured,
  onDeleteVideo,
  onEditVideo,
}) => {
  const getVideoTypeLabel = (type: string) => {
    const videoType = VIDEO_TYPES.find(t => t.value === type);
    return videoType ? videoType.label : type;
  };

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Videos de la Propiedad ({videos.length})
      </h3>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay videos para esta propiedad
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video: IPropertyVideo) => (
            <div key={video.id} className="relative group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Thumbnail del video */}
              <div className="relative aspect-video">
                <img
                  src={video.thumbnail_url || video.youtube_thumbnail || `https://img.youtube.com/vi/${video.youtube_video_id}/maxresdefault.jpg`}
                  alt={video.title || 'Video de propiedad'}
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay de play */}
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <div className="bg-white bg-opacity-90 rounded-full p-3">
                    <Play className="w-6 h-6 text-gray-800" />
                  </div>
                </div>
                
                {/* Overlay con acciones */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 flex space-x-2">
                    <button
                      onClick={() => onSetFeatured(video.id)}
                      className={`p-2 rounded-full ${video.is_featured ? 'bg-yellow-500 text-white' : 'bg-white text-gray-700'} hover:bg-yellow-500 hover:text-white transition-colors`}
                      title={video.is_featured ? 'Video destacado' : 'Establecer como destacado'}
                    >
                      <Star className="w-4 h-4" />
                    </button>
                    
                    {onEditVideo && (
                      <button
                        onClick={() => onEditVideo(video)}
                        className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-500 hover:text-white transition-colors"
                        title="Editar video"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onDeleteVideo(video.id)}
                      className="p-2 rounded-full bg-white text-red-600 hover:bg-red-500 hover:text-white transition-colors"
                      title="Eliminar video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                {/* Indicador de video destacado */}
                {video.is_featured && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Destacado
                  </div>
                )}
                
                {/* Duración del video (si está disponible) */}
                {video.duration_seconds && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                    {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              
              {/* Información del video */}
              <div className="p-4">
                <div className="mb-2">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {video.title || 'Video sin título'}
                  </h4>
                  {video.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {video.description}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    {getVideoTypeLabel(video.video_type)}
                  </span>
                  <span>
                    Orden: {video.sort_order}
                  </span>
                </div>
                
                {/* Configuraciones de reproducción */}
                <div className="mt-2 flex space-x-2">
                  {video.allow_autoplay && (
                    <span className="inline-flex items-center text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      <Play className="w-3 h-3 mr-1" />
                      Auto
                    </span>
                  )}
                  {!video.show_controls && (
                    <span className="inline-flex items-center text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                      <Settings className="w-3 h-3 mr-1" />
                      Sin controles
                    </span>
                  )}
                  {!video.is_active && (
                    <span className="inline-flex items-center text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                      Inactivo
                    </span>
                  )}
                </div>
                
                {/* Enlace directo a YouTube */}
                <div className="mt-2">
                  <a
                    href={video.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Ver en YouTube
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VideoGallerySection;