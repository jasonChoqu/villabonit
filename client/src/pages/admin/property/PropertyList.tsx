import React, { useState, useEffect } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { PropertyService as ItemService } from "@/core/services/properties/property.service";
import type { IProperty as IItemResource } from "@/core/types/IProperties";
import { Search, Plus, Trash2, Edit, EyeIcon, ImageIcon, Video } from "lucide-react";
import Form from "./form";
import { useResource } from "@/core/hooks/useResource";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { toastify } from "@/core/utils/toastify";
import DataTable from "@/components/table/DataTable";
import Modal from "@/components/modal/Modal";
import PropertyViewModal from "@/components/modal/PropertyViewModal";
import { ImageUploadSection, ImageGallerySection } from "@/components/image";
import { VideoUploadSection, VideoGallerySection } from "@/components/video";
import type { ImageMetadata } from "@/core/types/IImageUpload";
import type { IPropertyVideo, VideoMetadata } from "@/core/types/IPropertyVideo";

const columns = [
  {
    key: "id",
    header: "ID",
    render: (item: IItemResource) => (
      <div className="flex items-center gap-3">
        <div className="font-bold">{item.id}</div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "title",
    header: "Propiedad",
    render: (item: IItemResource) => (
      <div className="flex items-center">
        {item.featured_image && (
          <img
            className="h-12 w-12 rounded-lg object-cover mr-4"
            src={item.featured_image.image_url || item.featured_image.thumbnail_url || `${import.meta.env.VITE_API_URL?.replace('/api', '') || window.location.origin}/${String(item.featured_image.image_path).replace(/^\/+/, "")}`}
            alt={item.title}
            onError={(e) => {
              console.error('Error loading featured image in PropertyList:', {
                src: e.currentTarget.src,
                image_url: item.featured_image?.image_url,
                thumbnail_url: item.featured_image?.thumbnail_url,
                image_path: item.featured_image?.image_path,
                property_id: item.id,
                property_title: item.title
              });
              // Opcional: puedes cambiar a una imagen por defecto
              // e.currentTarget.src = '/images/default-property.jpg';
            }}
          />
        )}
        <div>
          <div className="text-sm font-medium text-gray-900">
            {item.title}
            {item.is_featured && (
              <span className="ml-2 text-yellow-500">⭐</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {item.description ? item.description.substring(0, 50) + '...' : 'Sin descripción'}
          </div>
        </div>
      </div>
    ),
    sortable: true,
  },
  {
    key: "property_type",
    header: "Tipo",
    render: (item: IItemResource) => (
      <div className="text-gray-600 capitalize">
        {item.property_type.replace('_', ' ')}
      </div>
    ),
    sortable: true,
  },
  {
    key: "price",
    header: "Precio",
    render: (item: IItemResource) => (
      <div className="font-medium">
        {new Intl.NumberFormat('es-ES', {
          style: 'currency',
          currency: item.currency || 'USD',
        }).format(item.price)}
      </div>
    ),
    sortable: true,
  },
  {
    key: "status",
    header: "Estado",
    render: (item: IItemResource) => {
      const statusClasses = {
        available: 'bg-green-100 text-green-800',
        sold: 'bg-red-100 text-red-800',
        reserved: 'bg-yellow-100 text-yellow-800',
        rented: 'bg-blue-100 text-blue-800',
        off_market: 'bg-gray-100 text-gray-800',
      };

      const statusLabels = {
        available: 'Disponible',
        sold: 'Vendida',
        reserved: 'Reservada',
        rented: 'Alquilada',
        off_market: 'Fuera del Mercado',
      };

      return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusClasses[item.status as keyof typeof statusClasses] || statusClasses.available}`}>
          {statusLabels[item.status as keyof typeof statusLabels] || item.status}
        </span>
      );
    },
    sortable: true,
  },
  {
    key: "location",
    header: "Ubicación",
    render: (item: IItemResource) => (
      <div className="text-gray-600">
        {item.city && <div>{item.city}</div>}
        {item.state && <div className="text-gray-500 text-sm">{item.state}</div>}
      </div>
    ),
    sortable: false,
  },
  {
    key: "details",
    header: "Detalles",
    render: (item: IItemResource) => (
      <div className="space-y-1">
        {item.area_m2 && <div className="text-sm">{item.area_m2} m²</div>}
        <div className="flex space-x-2 text-gray-500 text-xs">
          {item.bedrooms !== undefined && <span>{item.bedrooms} hab</span>}
          {item.bathrooms !== undefined && <span>{item.bathrooms} baños</span>}
          {item.parking !== undefined && <span>{item.parking} park</span>}
        </div>
      </div>
    ),
    sortable: false,
  },
  {
    key: "created_at",
    header: "Fecha de creación",
    render: (item: IItemResource) => (
      <div className="text-gray-600">
        {new Date(item.created_at).toLocaleDateString()}
      </div>
    ),
    sortable: true,
  },
];

export default function PropertyList() {
  const {
    items,
    loading,
    pagination,
    sort,
    searchInput,
    handlePageChange,
    handleSortChange,
    handleFilterChange,
    handleLimitChange,
    handleSearch,
    fetchItems,
  } = useResource({
    service: ItemService,
    defaultSort: { key: "id", direction: "asc" },
    defaultPerPage: 5,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<IItemResource | null>(null);
  const [selectedPropertyForImages, setSelectedPropertyForImages] = useState<IItemResource | null>(null);
  const [selectedPropertyForVideos, setSelectedPropertyForVideos] = useState<IItemResource | null>(null);
  const [selectedPropertyForView, setSelectedPropertyForView] = useState<IItemResource | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger";
  } | null>(null);

  const openDialog = (
    title: string,
    message: string,
    onConfirm: () => void,
    variant: "primary" | "danger" = "primary"
  ) => {
    setDialogConfig({
      isOpen: true,
      title,
      message,
      onConfirm,
      variant,
    });
  };

  const closeDialog = () => {
    setDialogConfig(null);
  };

  const handleEdit = (item: IItemResource) => {
    setCurrentItem(item);
    setIsModalOpen(true);
  };

  const handleView = (item: IItemResource) => {
    setSelectedPropertyForView(item);
    setIsViewModalOpen(true);
  };

  const handleManageImages = (item: IItemResource) => {
    setSelectedPropertyForImages(item);
    setIsImageModalOpen(true);
  };

  const handleManageVideos = (item: IItemResource) => {
    setSelectedPropertyForVideos(item);
    setIsVideoModalOpen(true);
  };

  const confirmDelete = (item: IItemResource) => {
    openDialog(
      "Confirmar eliminación",
      `¿Estás seguro que deseas eliminar la propiedad "${item.title}"?`,
      () => handleDelete(item),
      "danger"
    );
  };

  const handleDelete = async (item: IItemResource) => {
    setIsProcessing(true);
    try {
      const response = await ItemService.remove(item.id);
      toastify.success(response?.message || "Propiedad eliminada exitosamente");
      fetchItems();
    } catch (error) {
      console.error("Error al eliminar propiedad:", error);
      toastify.error("Error al eliminar la propiedad");
    } finally {
      setIsProcessing(false);
      closeDialog();
    }
  };

  const actions = [
    {
      label: "Ver detalle",
      icon: <EyeIcon className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleView(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Gestionar Imágenes",
      icon: <ImageIcon className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleManageImages(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Gestionar Videos",
      icon: <Video className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleManageVideos(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Editar",
      icon: <Edit className="w-4 h-4" />,
      onClick: (item: IItemResource) => handleEdit(item),
      variant: "primary" as const,
      show: () => true,
    },
    {
      label: "Eliminar",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (item: IItemResource) => confirmDelete(item),
      variant: "danger" as const,
      show: () => true,
    },
  ];

  const renderToolbar = () => (
    <div className="flex flex-col gap-4 w-full sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-2">
        <button
          className="bg-gray-600 text-white font-bold flex items-center gap-2 rounded-xl py-3 px-10 hover:bg-gray-700 hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
          onClick={() => {
            setCurrentItem(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5" />
          Agregar Propiedad
        </button>
      </div>
      <div className="relative w-full sm:w-64">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-700 dark:text-gray-300">
          <Search className="w-5 h-5" />
        </div>
        <input
          type="text"
          placeholder="Buscar propiedades..."
          className="input w-full pl-10 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
          value={searchInput}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-12">
      <div className="col-span-12">
        <PageBreadcrumb pageTitle="Propiedades" />
        <DataTable
          data={items as IItemResource[]}
          columns={columns}
          actions={actions}
          sort={sort}
          onSortChange={handleSortChange}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          pagination={pagination}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
          availableLimits={[5, 10, 20, 50]}
          loading={loading}
          renderTopToolbar={renderToolbar}
        />
        <Form
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentItem(null);
          }}
          initialData={currentItem}
          load={fetchItems}
        />
        
        {/* Modal de Gestión de Imágenes */}
        {isImageModalOpen && selectedPropertyForImages && (
          <ImageManagerModal
            isOpen={isImageModalOpen}
            onClose={() => {
              setIsImageModalOpen(false);
              setSelectedPropertyForImages(null);
            }}
            property={selectedPropertyForImages}
            onImagesUpdated={fetchItems}
          />
        )}

        {/* Modal de Gestión de Videos */}
        {isVideoModalOpen && selectedPropertyForVideos && (
          <VideoManagerModal
            isOpen={isVideoModalOpen}
            onClose={() => {
              setIsVideoModalOpen(false);
              setSelectedPropertyForVideos(null);
            }}
            property={selectedPropertyForVideos}
            onVideosUpdated={fetchItems}
          />
        )}
        
        {/* Modal de Vista Detallada */}
        <PropertyViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedPropertyForView(null);
          }}
          property={selectedPropertyForView}
        />
        
        {dialogConfig && (
          <ConfirmDialog
            isOpen={dialogConfig.isOpen}
            title={dialogConfig.title}
            message={dialogConfig.message}
            onConfirm={dialogConfig.onConfirm}
            onCancel={closeDialog}
            isProcessing={isProcessing}
            variant={dialogConfig.variant}
            confirmText={dialogConfig.variant === "danger" ? "Eliminar" : "Confirmar"}
          />
        )}
      </div>
    </div>
  );
}

// Componente para gestionar imágenes
interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: IItemResource;
  onImagesUpdated: () => void;
}

const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  isOpen,
  onClose,
  property,
  onImagesUpdated
}) => {
  const [images, setImages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Cargar imágenes cuando se abre el modal
  const loadImages = async () => {
    setIsLoading(true);
    try {
      const response = await ItemService.getPropertyImages(property.id);
      console.log(response);
      setImages(response.data || []);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
      toastify.error("Error al cargar las imágenes");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && property) {
      loadImages();
    }
    // Limpiar previews cuando se cierra el modal
    if (!isOpen) {
      setSelectedFiles([]);
      setPreviewUrls([]);
    }
  }, [isOpen, property]);

  // Limpiar URLs de preview cuando se desmonte el componente
  useEffect(() => {
    return () => {
      previewUrls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  // Manejar selección de archivos y crear previews
  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);
    setSelectedFiles(filesArray);

    // Crear URLs de preview
    const urls = filesArray.map(file => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  // Confirmar subida de imágenes
  const confirmUpload = async (metadata: ImageMetadata[], featuredIndex?: number) => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      
      // Agregar archivos de imagen - Laravel espera images[] como array
      selectedFiles.forEach((file) => {
        formData.append('images[]', file);
      });

      // Agregar metadatos de imagen
      metadata.forEach((meta, index) => {
        if (meta.type) {
          formData.append(`image_types[${index}]`, meta.type);
        }
        if (meta.altText && meta.altText.trim()) {
          formData.append(`alt_texts[${index}]`, meta.altText.trim());
        }
        if (meta.description && meta.description.trim()) {
          formData.append(`descriptions[${index}]`, meta.description.trim());
        }
      });

      // Agregar índice de imagen destacada
      if (featuredIndex !== undefined && featuredIndex >= 0) {
        formData.append('set_featured', featuredIndex.toString());
      }

      // Debug: mostrar el contenido del FormData
      console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, ':', value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
      }

      const response = await ItemService.uploadImages(property.id, formData);
      console.log('Upload response:', response);
      
      toastify.success("Imágenes subidas exitosamente");
      loadImages();
      onImagesUpdated();
      
      // Limpiar selección
      setSelectedFiles([]);
      previewUrls.forEach(url => URL.revokeObjectURL(url));
      setPreviewUrls([]);
    } catch (error: any) {
      console.error("Error al subir imágenes:", error);
      
      // Mostrar más detalles del error
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        toastify.error(`Error al subir las imágenes: ${error.response.data.message || 'Error desconocido'}`);
      } else {
        toastify.error("Error de conexión al subir las imágenes");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Cancelar selección
  const cancelSelection = () => {
    setSelectedFiles([]);
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
  };

  // Manejar selección de archivos (renombrado para mejor claridad)
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelection(event);
    // Limpiar el input para permitir seleccionar los mismos archivos nuevamente
    event.target.value = '';
  };

  // Eliminar imagen
  const handleDeleteImage = async (imageId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar esta imagen?")) return;

    try {
      await ItemService.deleteImage(property.id, imageId);
      toastify.success("Imagen eliminada exitosamente");
      loadImages();
      onImagesUpdated();
    } catch (error) {
      console.error("Error al eliminar imagen:", error);
      toastify.error("Error al eliminar la imagen");
    }
  };

  // Establecer imagen destacada
  const handleSetFeatured = async (imageId: number) => {
    try {
      await ItemService.setFeaturedImage(property.id, imageId);
      toastify.success("Imagen destacada establecida");
      loadImages();
      onImagesUpdated();
    } catch (error) {
      console.error("Error al establecer imagen destacada:", error);
      toastify.error("Error al establecer imagen destacada");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestionar Imágenes - ${property.title}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Sección de subida de imágenes */}
        <ImageUploadSection
          selectedFiles={selectedFiles}
          previewUrls={previewUrls}
          isUploading={isUploading}
          onFileSelection={handleImageUpload}
          onConfirmUpload={confirmUpload}
          onCancelSelection={cancelSelection}
        />

        {/* Galería de imágenes existentes */}
        <ImageGallerySection
          images={images}
          isLoading={isLoading}
          onSetFeatured={handleSetFeatured}
          onDeleteImage={handleDeleteImage}
        />

        {/* Botones de acción */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};

// Componente para gestionar videos
interface VideoManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: IItemResource;
  onVideosUpdated: () => void;
}

const VideoManagerModal: React.FC<VideoManagerModalProps> = ({
  isOpen,
  onClose,
  property,
  onVideosUpdated
}) => {
  const [videos, setVideos] = useState<IPropertyVideo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Cargar videos cuando se abre el modal
  const loadVideos = async () => {
    setIsLoading(true);
    try {
      const response = await ItemService.getPropertyVideos(property.id);
      console.log('Videos response:', response);
      setVideos(response.data || []);
    } catch (error) {
      console.error("Error al cargar videos:", error);
      toastify.error("Error al cargar los videos");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && property) {
      loadVideos();
    }
  }, [isOpen, property]);

  // Agregar nuevo video
  const handleAddVideo = async (videoData: VideoMetadata & { youtube_url: string }, isFeatured?: boolean) => {
    setIsUploading(true);
    try {
      const response = await ItemService.addVideo(property.id, {
        ...videoData,
        is_featured: isFeatured || false,
      });
      
      console.log('Add video response:', response);
      toastify.success("Video agregado exitosamente");
      loadVideos();
      onVideosUpdated();
    } catch (error: any) {
      console.error("Error al agregar video:", error);
      
      if (error.response) {
        console.error("Response data:", error.response.data);
        toastify.error(`Error al agregar el video: ${error.response.data.message || 'Error desconocido'}`);
      } else {
        toastify.error("Error de conexión al agregar el video");
      }
    } finally {
      setIsUploading(false);
    }
  };

  // Eliminar video
  const handleDeleteVideo = async (videoId: number) => {
    if (!window.confirm("¿Estás seguro de eliminar este video?")) return;

    try {
      await ItemService.deleteVideo(property.id, videoId);
      toastify.success("Video eliminado exitosamente");
      loadVideos();
      onVideosUpdated();
    } catch (error) {
      console.error("Error al eliminar video:", error);
      toastify.error("Error al eliminar el video");
    }
  };

  // Establecer video destacado
  const handleSetFeatured = async (videoId: number) => {
    try {
      const video = videos.find(v => v.id === videoId);
      if (!video) return;

      await ItemService.updateVideo(property.id, videoId, {
        is_featured: !video.is_featured
      });
      
      toastify.success(video.is_featured ? "Video ya no es destacado" : "Video destacado establecido");
      loadVideos();
      onVideosUpdated();
    } catch (error) {
      console.error("Error al establecer video destacado:", error);
      toastify.error("Error al establecer video destacado");
    }
  };

  // Editar video (funcionalidad básica)
  const handleEditVideo = async (video: IPropertyVideo) => {
    const newTitle = prompt("Nuevo título del video:", video.title || "");
    if (newTitle === null) return; // Usuario canceló

    try {
      await ItemService.updateVideo(property.id, video.id, {
        title: newTitle.trim()
      });
      
      toastify.success("Video actualizado exitosamente");
      loadVideos();
      onVideosUpdated();
    } catch (error) {
      console.error("Error al actualizar video:", error);
      toastify.error("Error al actualizar el video");
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestionar Videos - ${property.title}`}
      size="xl"
    >
      <div className="space-y-6">
        {/* Sección de agregar videos */}
        <VideoUploadSection
          isUploading={isUploading}
          onAddVideo={handleAddVideo}
        />

        {/* Galería de videos existentes */}
        <VideoGallerySection
          videos={videos}
          isLoading={isLoading}
          onSetFeatured={handleSetFeatured}
          onDeleteVideo={handleDeleteVideo}
          onEditVideo={handleEditVideo}
        />

        {/* Botones de acción */}
        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
};