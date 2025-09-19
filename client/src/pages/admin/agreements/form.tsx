import { InputField, TextAreaField, InputFileField } from '@/components/form-field';
import Modal from '@/components/modal/Modal';
import { FormProviderWrapper } from '@/composables/FormProviderWrapper';
import type {
  IAgreementCreateRequest as ICreateRequest,
  IAgreementUpdateRequest as IUpdateRequest,
  IAgreement as IItemResponse
} from '@/core/types/IAgreement';
import { AgreementService as ItemService } from '@/core/services/agreement/agreement.service';
import { toastify } from '@/core/utils/toastify';
import { AgreementStoreSchema as storeSchema, AgreementUpdateSchema as updateSchema } from './validation';

interface AgreementModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

/* ---------- helpers para archivos ---------- */
const isDataUrl = (v: unknown): v is string =>
  typeof v === 'string' && /^data:.*;base64,/.test(v);

const mimeToExt = (mime: string) => {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'image/webp': 'webp',
    'application/pdf': 'pdf',
  };
  return map[mime] ?? 'bin';
};

// Convierte data URL (base64) -> File
const dataUrlToFile = async (dataUrl: string, filenameBase = 'agreement'): Promise<File> => {
  const res = await fetch(dataUrl);            // fetch soporta data URLs
  const blob = await res.blob();
  const mime = blob.type || (dataUrl.match(/^data:(.*?);/)?.[1] ?? 'application/octet-stream');
  const ext = mimeToExt(mime);
  return new File([blob], `${filenameBase}.${ext}`, { type: mime });


};

// Obtiene SIEMPRE el primer File válido (File, File[], FileList, data URL, array de data URL)
const extractAnyFile = async (input: unknown): Promise<File | null> => {
  if (input instanceof File) return input;

  if (Array.isArray(input) && input.length) {
    const first = input[0];
    if (first instanceof File) return first;
    if (isDataUrl(first)) return dataUrlToFile(first);
  }

  if (typeof FileList !== 'undefined' && input instanceof FileList && input.length > 0) {
    return input.item(0);
  }

  if (
    input && typeof input === 'object' &&
    'length' in (input as any) &&
    Number.isFinite((input as any).length) &&
    (input as any).length > 0 &&
    (input as any)[0] instanceof File
  ) {
    return (input as any)[0] as File;
  }

  if (isDataUrl(input)) return dataUrlToFile(input);

  if (input && typeof input === 'object' && 'target' in (input as any)) {
    const files = (input as any).target?.files;
    if (files?.length > 0) return files[0] as File;
  }

  if (input && typeof input === 'object' && 'files' in (input as any)) {
    const files = (input as any).files;
    if (files?.length > 0) return files[0] as File;
  }

  return null;
};

const AgreementModal = ({ isOpen, onClose, initialData = null, load }: AgreementModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? { name: initialData?.name || '', description: initialData?.description || '' } as any
    : { name: '', description: '', photo: null } as any;

  const handleSubmit = async (data: any) => {
    try {

      
      console.log(data.name);
      console.log(data.description);
      // 1) Normaliza a File (cubre File, FileList, File[], data URL)
      const file = await extractAnyFile(data.photo);

       console.log(file);
      // 2) En creación es obligatorio; en edición no
      if (!file && !isEditing) {
        toastify.error('Debes adjuntar el archivo del acuerdo.');
        return;
      }

      // 3) Arma FormData (recomendado para Laravel)
      const fd = new FormData();
      fd.append('name', data.name ?? '');
      fd.append('description', data.description ?? '');
      if (file) fd.append('photo', file); // solo si hay archivo


      // 4) Envía
      if (isEditing) {
        const payload: IUpdateRequest = {
          name: data.name,
          description: data.description ?? null,
          photo: file as File, // aquí ya es File
        };
        await ItemService.update(initialData!.id, payload);
        toastify.success('Alianza actualizada');
      } else {
        const payload: ICreateRequest = {
          name: data.name,
          description: data.description ?? null,
          photo: file as File, // aquí ya es File
        };
        await ItemService.create(payload);
        toastify.success('Alianza creada');
      }

      onClose();
      load();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.message === 'string' ? err.message : 'Ocurrió un error al guardar el acuerdo.');
      toastify.error(msg);

      const errors = err?.response?.data?.errors;
      if (errors && typeof errors === 'object') {
        const firstField = Object.keys(errors)[0];
        const firstError = errors[firstField]?.[0];
        if (firstError) toastify.error(firstError);
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Alianza' : 'Agregar Alianza'}
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
          <div className="col-span-1">
            <InputField
              name="name"
              label="Nombre de la institución"
              placeholder="Ej: Universidad Nacional, Empresa XYZ..."
            />
          </div>

          <div className="col-span-1">
            <TextAreaField
              name="description"
              label="Detalles del acuerdo"
              placeholder="Descripción del tipo de convenio o colaboración..."
              rows={5}
            />
          </div>

          <div className="col-span-1">
            <InputFileField
              name="photo"
              label="Documento o Fotografía del acuerdo"
              helperText="Formatos aceptados: JPG, JPEG, PNG, PDF (Máx. 4MB)"
              // asegúrate que internamente haga: onChange={(e)=>field.onChange(e.target.files)}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default AgreementModal;