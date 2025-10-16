import { InputField, TextAreaField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IVideoContentCreateRequest as ICreateRequest,
  IVideoContentUpdateRequest as IUpdateRequest,
  IVideoContent as IItemResponse
} from '@/core/types/IVideoContent';
import { VideoContentService as ItemService } from '@/core/services/video/video-content.service';
import { toastify } from '@/core/utils/toastify';

interface VideoContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const VideoContentModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: VideoContentModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
        title: initialData?.title || '',
        description: initialData?.description || '',
        video_url: initialData?.video_url || '',
        is_active: initialData?.is_active ?? true,
        order: initialData?.order || 1,
      }
    : {
        title: '',
        description: '',
        video_url: '',
        is_active: true,
        order: 1,
      };

  const handleSubmit = async (data: FormValues) => {
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value != null)
    );
    
    if (isEditing) {
      await ItemService.update(initialData!.id, cleanData as IUpdateRequest)
        .then((response) => {
          toastify.success(response.message || 'Video actualizado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response?.data?.message || 'Error al actualizar'));
    } else {
      await ItemService.create(cleanData as ICreateRequest)
        .then((response) => {
          toastify.success(response.message || 'Video creado');
          onClose();
          load();
        })
        .catch((error) => toastify.error(error.response?.data?.message || 'Error al crear'));
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Video Content' : 'Nuevo Video Content'}
      size="xl"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <InputField
              name="title"
              label="Título del Video"
              placeholder="Ej: Video Institucional"
              required
            />
          </div>

          <div className="md:col-span-2">
            <InputField
              name="video_url"
              label="URL del Video de YouTube"
              placeholder="Ej: https://www.youtube.com/watch?v=VIDEO_ID"
              required
              helperText="Ingresa la URL completa del video de YouTube"
            />
          </div>

          <div className="md:col-span-2">
            <TextAreaField
              name="description"
              label="Descripción"
              placeholder="Descripción del video que aparecerá junto al reproductor..."
              rows={4}
              required
            />
          </div>

          <div>
            <InputField
              name="order"
              label="Orden"
              type="number"
              placeholder="1"
              min={1}
              helperText="Orden de visualización (menor número = mayor prioridad)"
            />
          </div>

          <div className="flex items-center justify-start pt-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="is_active"
                defaultChecked={defaultValues.is_active}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Video Activo</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Determina si el video será visible en el sitio web
            </p>
          </div>
        </div>

        {/* Preview del video si existe la URL */}
        <div className="mt-6">
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Vista Previa:</h4>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">
                El video aparecerá aquí una vez que ingreses una URL válida de YouTube
              </p>
              <div className="aspect-video bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-400 text-sm">Vista previa del video</span>
              </div>
            </div>
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default VideoContentModal;