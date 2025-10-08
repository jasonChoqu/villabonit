import { InputField, TextAreaField, InputFileField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IProjectCreateRequest as ICreateRequest,
  IProjectUpdateRequest as IUpdateRequest,
  IProject as IItemResponse
} from '@/core/types/IProject';
import { ProjectService as ItemService } from '@/core/services/project/project.service';
import { toastify } from '@/core/utils/toastify';
import {
  projectStoreSchema as storeSchema,
  projectUpdateSchema as updateSchema
} from './validation';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

const ProjectModal = ({
  isOpen,
  onClose,
  initialData = null,
  load,
}: ProjectModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: ICreateRequest | IUpdateRequest = isEditing
    ? {
        title: initialData?.title || '',
        description: initialData?.description || '',
        features: initialData?.features || '',
        image: undefined, // undefined en lugar de null
      }
    : {
        title: '',
        description: '',
        features: '',
        image: undefined, // undefined en lugar de null
      };

  const handleSubmit = async (data: FormValues) => {
    console.log('Datos del formulario antes del envío:', data);
    
    try {
      if (isEditing) {
        const response = await ItemService.update(initialData!.id, data as IUpdateRequest);
        toastify.success(response.message || 'Proyecto actualizado exitosamente');
      } else {
        const response = await ItemService.create(data as ICreateRequest);
        toastify.success(response.message || 'Proyecto creado exitosamente');
      }
      onClose();
      load();
    } catch (error: any) {
      console.error('Error al guardar proyecto:', error);
      toastify.error(error.response?.data?.message || 'Error al guardar el proyecto');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Proyecto' : 'Nuevo Proyecto'}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={isEditing ? updateSchema : storeSchema}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 gap-6">
          <div>
            <InputField
              name="title"
              label="Título del proyecto"
              placeholder="Ej: Sistema Web de Gestión"
            />
          </div>

          <div>
            <TextAreaField
              name="description"
              label="Descripción"
              placeholder="Describe el proyecto en detalle..."
              rows={4}
            />
          </div>

          <div>
            <TextAreaField
              name="features"
              label="Características principales"
              placeholder="Ej: Responsive, Dashboard Admin, API REST, Autenticación..."
              rows={3}
            />
          </div>

          <div>
            <InputFileField
              name="image"
              label="Imagen del proyecto"
              accept="image/*"
              helperText="Formatos permitidos: JPG, PNG, GIF, SVG, WEBP. Tamaño máximo: 10MB"
            />
            {isEditing && initialData?.image_url && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Imagen actual:</p>
                <img 
                  src={initialData.image_url} 
                  alt={initialData.title}
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default ProjectModal;