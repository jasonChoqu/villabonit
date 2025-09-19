// src/pages/admin/resourcebegin/ResourceBeginModal.tsx
import React from 'react';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import { useFormContext } from 'react-hook-form';
import { toastify } from '@/core/utils/toastify';
import { ResourceBeginService } from '@/core/services/resource-begin/resource-begin.service';
import InputField from '@/components/form-field/InputField';

// Si ya tienes tipos globales, usa esos.
// Aquí dejo un tipo mínimo local para el item:
type ResourceBeginItem = {
  id: number | string;
  url: string | null;
  logo_url: string | null;
  text: string | null;
};

interface Props {
  isOpen: boolean;
  onClose: () => void;
  load: () => void;               // refrescar listado
  initialData?: ResourceBeginItem | null; // si llega, es edición
}

/** Campo file simple (si tu InputField no soporta type="file") */
const FileField = ({
  name,
  label,
  accept,
  required,
}: {
  name: 'url' | 'logo_url';
  label: string;
  accept: string;
  required?: boolean;
}) => {
  // Usar el contexto correcto de react-hook-form
  const { setValue, watch } = useFormContext();
  const file: File | undefined = watch(name);

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium">
        {label}{required ? ' *' : ''}
      </label>
      <input
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0];
          setValue(name, f as any, { shouldValidate: true });
        }}
      />
      {file && <span className="text-xs text-gray-500">Seleccionado: {file.name}</span>}
    </div>
  );
};

type FormValues = {
  url?: File;              // imagen o video
  logo_url?: File | null;  // imagen
  text?: string | null;
};

const ResourceBeginModal: React.FC<Props> = ({ isOpen, onClose, load, initialData = null }) => {
  const isEditing = !!initialData;

  const defaultValues: FormValues = {
    text: initialData?.text ?? '',
  };

  const handleSubmit = async (data: FormValues) => {
    try {
      if (!isEditing) {
        if (!data.url) {
          toastify.error('Debes seleccionar un archivo (imagen o video) para "Contenido".');
          return;
        }
        await ResourceBeginService.create({
          url: data.url,
          logo_url: data.logo_url ?? null,
          text: data.text ?? null,
        });
        toastify.success('Recurso creado correctamente');
      } else {
        await ResourceBeginService.update(initialData!.id, {
          url: data.url,
          logo_url: data.logo_url ?? null,
          text: data.text ?? null,
        });
        toastify.success('Recurso actualizado correctamente');
      }

      onClose();
      load();
    } catch (error: any) {
      toastify.error(error?.response?.data?.message || 'Error inesperado');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar recurso inicial' : 'Nuevo recurso inicial'}
      size="lg"
    >
      <FormProviderWrapper 
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        mode={isEditing ? 'edit' : 'create'}
        className="w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FileField
              name="url"
              label="Contenido (imagen o video)"
              accept="image/*,video/*"
              required={!isEditing}
            />
            {isEditing && initialData?.url && (
              <p className="mt-1 text-xs text-gray-500">
                Actual: <code>{initialData.url}</code> (se mantiene si no subes otro archivo)
              </p>
            )}
          </div>

          <div className="col-span-1">
            <FileField
              name="logo_url"
              label="Logo (imagen opcional)"
              accept="image/*"
            />
            {isEditing && initialData?.logo_url && (
              <p className="mt-1 text-xs text-gray-500">
                Actual: <code>{initialData.logo_url}</code> (se mantiene si no subes otro archivo)
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            {/* Si tu InputField soporta texto normal, úsalo */}
            {/* @ts-ignore: depende de tu componente */}
            <InputField
              name="text"
              label="Texto (opcional)"
              placeholder="Texto introductorio o descriptivo"
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default ResourceBeginModal;
