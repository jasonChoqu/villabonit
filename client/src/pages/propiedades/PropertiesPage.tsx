import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Bed, Bath, Car, Square, Eye, ChevronDown, Play, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PropertyService } from '@/core/services/properties/property.service';
import type { IProperty, PropertyType, PropertyStatus } from '@/core/types/IProperties';
import type { IPropertyVideo } from '@/core/types/IPropertyVideo';
import { PROPERTY_TYPES } from '@/core/types/IProperties';
import { VIDEO_TYPES } from '@/core/types/IPropertyVideo';
import './PropertiesPage.css';

interface Filters {
  search: string;
  property_type: PropertyType | '';
  status: PropertyStatus | '';
  min_price: string;
  max_price: string;
  bedrooms: string;
  bathrooms: string;
  city: string;
  featured: boolean | undefined;
}

const PropertiesPage: React.FC = () => {
  const [properties, setProperties] = useState<IProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState<IProperty | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  
  const [filters, setFilters] = useState<Filters>({
    search: '',
    property_type: '',
    status: 'available', // Por defecto solo propiedades disponibles
    min_price: '',
    max_price: '',
    bedrooms: '',
    bathrooms: '',
    city: '',
    featured: undefined,
  });

  // Cargar propiedades
  const loadProperties = async (page = 1) => {
    setLoading(true);
    try {
      const params: any = {
        page,
        per_page: 12,
        // Filtrar campos vacíos
        ...(filters.search && { search: filters.search }),
        ...(filters.property_type && { type: filters.property_type }),
        ...(filters.status && { status: filters.status }),
        ...(filters.min_price && { min_price: Number(filters.min_price) }),
        ...(filters.max_price && { max_price: Number(filters.max_price) }),
        ...(filters.bedrooms && { bedrooms: Number(filters.bedrooms) }),
        ...(filters.bathrooms && { bathrooms: Number(filters.bathrooms) }),
        ...(filters.city && { city: filters.city }),
        ...(filters.featured !== undefined && { featured: filters.featured }),
      };

      const response = await PropertyService.getAllPaginated(params);
      setProperties(response.data || []);
      
      if (response.meta?.pagination) {
        setTotalPages(response.meta.pagination.total_pages);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties(currentPage);
  }, [currentPage]);

  // Manejar búsqueda con debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      setCurrentPage(1);
      loadProperties(1);
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [filters]);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getPropertyTypeLabel = (type: PropertyType) => {
    const typeOption = PROPERTY_TYPES.find(option => option.value === type);
    return typeOption?.label || type;
  };

  const openGalleryModal = (property: IProperty) => {
    setSelectedProperty(property);
    setShowGalleryModal(true);
  };

  const closeGalleryModal = () => {
    setSelectedProperty(null);
    setShowGalleryModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero Section */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Propiedades a la Venta
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Encuentra tu hogar ideal entre nuestra selección de propiedades
            </p>
            
            {/* Barra de búsqueda principal */}
            <div className="max-w-2xl mx-auto relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, ubicación o descripción..."
                className="w-full pl-10 pr-4 py-4 rounded-xl bg-white text-gray-900 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filtros */}
        <div className="mb-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-shadow mb-4"
          >
            <Filter className="h-5 w-5" />
            Filtros
            <ChevronDown className={`h-5 w-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white p-6 rounded-lg shadow-md overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Tipo de Propiedad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tipo de Propiedad
                    </label>
                    <select
                      value={filters.property_type}
                      onChange={(e) => handleFilterChange('property_type', e.target.value as PropertyType)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Todos los tipos</option>
                      {PROPERTY_TYPES.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Precio Mínimo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Mínimo
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.min_price}
                      onChange={(e) => handleFilterChange('min_price', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Precio Máximo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Máximo
                    </label>
                    <input
                      type="number"
                      placeholder="Sin límite"
                      value={filters.max_price}
                      onChange={(e) => handleFilterChange('max_price', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Habitaciones */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Habitaciones
                    </label>
                    <select
                      value={filters.bedrooms}
                      onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Cualquier cantidad</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                    </select>
                  </div>

                  {/* Baños */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Baños
                    </label>
                    <select
                      value={filters.bathrooms}
                      onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                      <option value="">Cualquier cantidad</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                    </select>
                  </div>

                  {/* Ciudad */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      placeholder="Buscar ciudad..."
                      value={filters.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />
                  </div>

                  {/* Solo Destacadas */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="featured"
                      checked={filters.featured === true}
                      onChange={(e) => handleFilterChange('featured', e.target.checked ? true : undefined)}
                      className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                    />
                    <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700">
                      Solo propiedades destacadas
                    </label>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Resultados */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Cargando...' : `${properties.length} propiedades encontradas`}
          </p>
        </div>

        {/* Grid de Propiedades */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 rounded w-20"></div>
                    <div className="h-4 bg-gray-300 rounded w-16"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : properties.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-[500px] group"
              >
                {/* Imagen que ocupa toda la card */}
                <div className="relative h-full overflow-hidden">
                  {property.featured_image ? (
                    <img
                      src={property.featured_image.image_url || property.featured_image.thumbnail_url || `${import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin}/${String(property.featured_image.image_path).replace(/^\/+/, "")}`}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-400 flex items-center justify-center">
                      <span className="text-gray-500 text-lg font-medium">Sin imagen</span>
                    </div>
                  )}
                  
                  {/* Overlay gradiente */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                  
                  {/* Badges superiores */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                    {property.is_featured && (
                      <span className="bg-yellow-400 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                        ⭐ Destacada
                      </span>
                    )}
                    <span 
                      style={{ backgroundColor: 'rgb(0, 108, 46)' }} 
                      className="text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg"
                    >
                      {getPropertyTypeLabel(property.property_type)}
                    </span>
                  </div>

                  {/* Precio en la parte superior derecha */}
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                      <div className="text-lg font-bold" style={{ color: 'rgb(0, 108, 46)' }}>
                        {formatPrice(property.price, property.currency)}
                      </div>
                    </div>
                  </div>

                  {/* Contenido superpuesto en la parte inferior */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    {/* Título */}
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 drop-shadow-lg">
                      {property.title}
                    </h3>

                    {/* Ubicación */}
                    <div className="flex items-center mb-3 opacity-90">
                      {(property.address || property.city) ? (
                        <>
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm line-clamp-1">
                            {property.address ? property.address : property.city}
                            {property.city && property.address && `, ${property.city}`}
                          </span>
                        </>
                      ) : (
                        <>
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          <span className="text-sm opacity-75">Ubicación no especificada</span>
                        </>
                      )}
                    </div>

                    {/* Características */}
                    <div className="flex items-center justify-between mb-4">
                      {property.property_type === 'terreno' ? (
                        // Para terrenos solo mostrar área
                        <div className="flex items-center justify-center w-full">
                          {property.area_m2 && (
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              <Square className="h-4 w-4 mr-2" />
                              <span className="text-sm font-medium">{property.area_m2} m²</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Para otras propiedades mostrar características normales
                        <div className="flex items-center gap-3 flex-wrap">
                          {property.bedrooms !== undefined && (
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              <Bed className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">{property.bedrooms}</span>
                            </div>
                          )}
                          {property.bathrooms !== undefined && (
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              <Bath className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">{property.bathrooms}</span>
                            </div>
                          )}
                          {property.parking !== undefined && (
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              <Car className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">{property.parking}</span>
                            </div>
                          )}
                          {property.area_m2 && (
                            <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                              <Square className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">{property.area_m2} m²</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Botón Ver Más */}
                    <button 
                      onClick={() => openGalleryModal(property)}
                      className="w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-105 shadow-lg"
                      style={{ 
                        backgroundColor: 'rgb(0, 108, 46)',
                        color: 'white'
                      }}
                    >
                      <Eye className="h-4 w-4" />
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">
              No se encontraron propiedades
            </h3>
            <p className="text-gray-600">
              Intenta ajustar los filtros de búsqueda
            </p>
          </div>
        )}

        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Anterior
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, index) => {
                const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? 'bg-yellow-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50"
              >
                Siguiente
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Galería */}
      {showGalleryModal && selectedProperty && (
        <PropertyGalleryModal
          property={selectedProperty}
          isOpen={showGalleryModal}
          onClose={closeGalleryModal}
        />
      )}
    </div>
  );
};

// Componente Modal de Galería
interface PropertyGalleryModalProps {
  property: IProperty;
  isOpen: boolean;
  onClose: () => void;
}

interface MediaItem {
  type: 'image' | 'video';
  data: any;
}

const PropertyGalleryModal: React.FC<PropertyGalleryModalProps> = ({
  property,
  isOpen,
  onClose
}) => {
  const [propertyImages, setPropertyImages] = useState<any[]>([]);
  const [propertyVideos, setPropertyVideos] = useState<IPropertyVideo[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'all' | 'images' | 'videos'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen && property) {
      loadPropertyMedia();
    }
  }, [isOpen, property]);

  useEffect(() => {
    // Combinar imágenes y videos según el tab activo
    const combinedMedia: MediaItem[] = [];
    
    if (activeTab === 'all' || activeTab === 'images') {
      propertyImages.forEach(image => {
        combinedMedia.push({ type: 'image', data: image });
      });
    }
    
    if (activeTab === 'all' || activeTab === 'videos') {
      propertyVideos.forEach(video => {
        combinedMedia.push({ type: 'video', data: video });
      });
    }
    
    setMediaItems(combinedMedia);
    setCurrentMediaIndex(0);
  }, [propertyImages, propertyVideos, activeTab]);

  const loadPropertyMedia = async () => {
    setLoading(true);
    try {
      const [imagesResponse, videosResponse] = await Promise.all([
        PropertyService.getPropertyImages(property.id),
        PropertyService.getPropertyVideos(property.id)
      ]);
      
      setPropertyImages(imagesResponse.data || []);
      setPropertyVideos(videosResponse.data || []);
    } catch (error) {
      console.error('Error loading property media:', error);
      setPropertyImages([]);
      setPropertyVideos([]);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === mediaItems.length - 1 ? 0 : prev + 1
    );
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => 
      prev === 0 ? mediaItems.length - 1 : prev - 1
    );
  };

  const getVideoTypeLabel = (type: string) => {
    const videoType = VIDEO_TYPES.find(t => t.value === type);
    return videoType ? videoType.label : type;
  };

  if (!isOpen) return null;

  const currentMedia = mediaItems[currentMediaIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-white rounded-2xl max-w-7xl w-full max-h-[95vh] overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header del Modal */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-white">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{property.title}</h2>
                <p className="text-2xl font-semibold text-green-600">
                  {formatPrice(property.price, property.currency)}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-3 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Tabs de navegación */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                onClick={() => setActiveTab('all')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'text-yellow-600 border-b-2 border-yellow-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Todo ({propertyImages.length + propertyVideos.length})
              </button>
              <button
                onClick={() => setActiveTab('images')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'images'
                    ? 'text-yellow-600 border-b-2 border-yellow-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Fotos ({propertyImages.length})
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-6 py-3 font-medium text-sm transition-colors ${
                  activeTab === 'videos'
                    ? 'text-yellow-600 border-b-2 border-yellow-600 bg-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Videos ({propertyVideos.length})
              </button>
            </div>

            <div className="flex flex-col lg:flex-row overflow-hidden max-h-[calc(95vh-160px)]">
              {/* Galería Principal */}
              <div className="lg:w-3/4 relative bg-black">
                {loading ? (
                  <div className="h-96 lg:h-full bg-gray-900 animate-pulse flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                      <span className="text-white">Cargando contenido...</span>
                    </div>
                  </div>
                ) : mediaItems.length > 0 && currentMedia ? (
                  <div className="relative h-96 lg:h-full">
                    {currentMedia.type === 'image' ? (
                      <img
                        src={currentMedia.data?.image_url || currentMedia.data?.thumbnail_url || `${import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin}/${String(currentMedia.data?.image_path).replace(/^\/+/, "")}`}
                        alt={`${property.title} - Imagen ${currentMediaIndex + 1}`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <iframe
                          src={currentMedia.data?.embed_url}
                          title={currentMedia.data?.title || `Video ${currentMediaIndex + 1}`}
                          className="w-full h-full max-w-4xl max-h-[80vh]"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      </div>
                    )}
                    
                    {/* Indicadores de contenido destacado */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {currentMedia.data?.is_featured && (
                        <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          ⭐ Destacado
                        </span>
                      )}
                      {currentMedia.type === 'video' && (
                        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Play className="w-3 h-3" />
                          {getVideoTypeLabel(currentMedia.data?.video_type)}
                        </span>
                      )}
                    </div>

                    {/* Controles de navegación */}
                    {mediaItems.length > 1 && (
                      <>
                        <button
                          onClick={prevMedia}
                          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-4 rounded-full hover:bg-opacity-80 transition-opacity"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <button
                          onClick={nextMedia}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-60 text-white p-4 rounded-full hover:bg-opacity-80 transition-opacity"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      </>
                    )}

                    {/* Contador de contenido */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-60 text-white px-4 py-2 rounded-full text-sm">
                      {currentMediaIndex + 1} / {mediaItems.length}
                      {currentMedia.type === 'video' ? ' (Video)' : ' (Foto)'}
                    </div>
                  </div>
                ) : (
                  <div className="h-96 lg:h-full bg-gray-800 flex items-center justify-center">
                    <div className="text-center text-gray-400">
                      <Eye className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <span>No hay contenido disponible</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Panel lateral con información */}
              <div className="lg:w-1/4 p-6 overflow-y-auto bg-gray-50">
                <div className="space-y-6">
                  {/* Características principales */}
                  <div className="grid grid-cols-2 gap-3">
                    {property.property_type === 'terreno' ? (
                      // Para terrenos solo mostrar área
                      <>
                        {property.area_m2 && (
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm col-span-2">
                            <Square className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                            <span className="text-xs text-gray-500 block">Área Total</span>
                            <span className="text-lg font-semibold">{property.area_m2} m²</span>
                          </div>
                        )}
                      </>
                    ) : (
                      // Para otras propiedades mostrar características normales
                      <>
                        {property.bedrooms !== undefined && (
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <Bed className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                            <span className="text-xs text-gray-500 block">Habitaciones</span>
                            <span className="text-lg font-semibold">{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms !== undefined && (
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <Bath className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                            <span className="text-xs text-gray-500 block">Baños</span>
                            <span className="text-lg font-semibold">{property.bathrooms}</span>
                          </div>
                        )}
                        {property.area_m2 && (
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <Square className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                            <span className="text-xs text-gray-500 block">Área</span>
                            <span className="text-lg font-semibold">{property.area_m2} m²</span>
                          </div>
                        )}
                        {property.parking !== undefined && (
                          <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                            <Car className="h-6 w-6 mx-auto mb-1 text-gray-600" />
                            <span className="text-xs text-gray-500 block">Parking</span>
                            <span className="text-lg font-semibold">{property.parking}</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Información del contenido actual */}
                  {currentMedia && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {currentMedia.type === 'video' ? '🎥 Video Actual' : '📷 Imagen Actual'}
                      </h4>
                      {currentMedia.data?.title && (
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          {currentMedia.data.title}
                        </p>
                      )}
                      {currentMedia.data?.description && (
                        <p className="text-xs text-gray-600">
                          {currentMedia.data.description}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Ubicación */}
                  {(property.address || property.city) && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-2 flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-gray-600" />
                        Ubicación
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {property.address}
                        {property.city && property.address && ', '}
                        {property.city}
                        {property.state && `, ${property.state}`}
                      </p>
                    </div>
                  )}

                  {/* Descripción */}
                  {property.description && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-2">Descripción</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{property.description}</p>
                    </div>
                  )}

                  {/* Miniaturas del contenido */}
                  {mediaItems.length > 1 && (
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h3 className="text-lg font-semibold mb-3">
                        Galería ({mediaItems.length})
                      </h3>
                      <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                        {mediaItems.map((media, index) => (
                          <button
                            key={`${media.type}-${media.data.id}`}
                            onClick={() => setCurrentMediaIndex(index)}
                            className={`relative aspect-square rounded-lg overflow-hidden ${
                              index === currentMediaIndex ? 'ring-2 ring-yellow-500' : ''
                            }`}
                          >
                            {media.type === 'image' ? (
                              <img
                                src={media.data.thumbnail_url || media.data.image_url || `${import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin}/${String(media.data.image_path).replace(/^\/+/, "")}`}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                              />
                            ) : (
                              <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                                <img
                                  src={media.data.thumbnail_url || media.data.youtube_thumbnail || `https://img.youtube.com/vi/${media.data.youtube_video_id}/maxresdefault.jpg`}
                                  alt={`Video thumbnail ${index + 1}`}
                                  className="w-full h-full object-cover hover:opacity-80 transition-opacity"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                                  <Play className="w-4 h-4 text-white" />
                                </div>
                              </div>
                            )}
                            
                            {media.data.is_featured && (
                              <div className="absolute top-1 right-1 bg-yellow-500 text-white rounded-full p-1">
                                <svg className="w-2 h-2" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold mb-3">Información</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tipo:</span>
                        <span className="font-medium">{PROPERTY_TYPES.find(t => t.value === property.property_type)?.label}</span>
                      </div>
                      {property.built_year && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Año:</span>
                          <span className="font-medium">{property.built_year}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-500">Fotos:</span>
                        <span className="font-medium">{propertyImages.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Videos:</span>
                        <span className="font-medium">{propertyVideos.length}</span>
                      </div>
                      {property.views_count !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">Vistas:</span>
                          <span className="font-medium">{property.views_count}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PropertiesPage;