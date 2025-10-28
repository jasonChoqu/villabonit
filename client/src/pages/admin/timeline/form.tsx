import { InputField, InputFileField, TextAreaField } from "@/components/form-field";
import Modal from "@/components/modal/Modal";
import { FormProviderWrapper } from "@/composables/FormProviderWrapper";
import type {
  ITimelineCreateRequest as ICreateRequest,
  ITimelineUpdateRequest as IUpdateRequest,
  ITimeline as IItemResponse,
} from "@/core/types/ITimeline";
import { TimelineService as ItemService } from "@/core/services/timeline/timeline.service";
import { toastify } from "@/core/utils/toastify";
import { storeSchema, updateSchema } from "./validation";

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

/* ---------- helpers para archivos ---------- */
const isDataUrl = (v: unknown): v is string => typeof v === "string" && /^data:.*;base64,/.test(v);

const mimeToExt = (mime: string) => {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  };
  return map[mime] ?? "bin";
};

// Convierte data URL (base64) -> File
const dataUrlToFile = async (dataUrl: string, filenameBase = "gallery"): Promise<File> => {
  const res = await fetch(dataUrl); // fetch soporta data URLs
  const blob = await res.blob();
  const mime = blob.type || (dataUrl.match(/^data:(.*?);/)?.[1] ?? "application/octet-stream");
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

  if (typeof FileList !== "undefined" && input instanceof FileList && input.length > 0) {
    return input.item(0);
  }

  if (
    input &&
    typeof input === "object" &&
    "length" in (input as any) &&
    Number.isFinite((input as any).length) &&
    (input as any).length > 0 &&
    (input as any)[0] instanceof File
  ) {
    return (input as any)[0] as File;
  }

  if (isDataUrl(input)) return dataUrlToFile(input);

  if (input && typeof input === "object" && "target" in (input as any)) {
    const files = (input as any).target?.files;
    if (files?.length > 0) return files[0] as File;
  }

  if (input && typeof input === "object" && "files" in (input as any)) {
    const files = (input as any).files;
    if (files?.length > 0) return files[0] as File;
  }

  return null;
};

const SliderModal = ({ isOpen, onClose, initialData = null, load }: GalleryModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? ({
        title: initialData?.title || "",
        description: initialData?.description || "",
        year: initialData?.year || "",
        photo: null,
      } as any)
    : ({ title: "", description: "", year: "", photo: null } as any);

  const handleSubmit = async (data: any) => {
    try {
      // 1) Normaliza a File (cubre File, FileList, File[], data URL)
      const file = await extractAnyFile(data.photo);

      console.log(file);
      // 2) En creación es obligatorio; en edición no
      if (!file && !isEditing) {
        toastify.error("Debes adjuntar la imagen.");
        return;
      }

      // 3) Arma FormData (recomendado para Laravel)
      const fd = new FormData();
      fd.append("title", data.title ?? "");
      fd.append("description", data.description ?? "");
      fd.append("year", data.year ?? "");
      if (file) fd.append("photo", file); // solo si hay archivo

      // 4) Envía
      if (isEditing) {
        const payload: IUpdateRequest = {
          title: data.title,
          description: data.description ?? null,
          year: data.year,
          photo: file as File, // aquí ya es File
        };
        await ItemService.update(initialData!.id, payload);
        toastify.success("Elemento de línea de tiempo actualizado");
      } else {
        const payload: ICreateRequest = {
          title: data.title,
          description: data.description ?? null,
          year: data.year,
          photo: file as File, // aquí ya es File
        };
        await ItemService.create(payload);
        toastify.success("Elemento de línea de tiempo creado");
      }

      onClose();
      load();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.message === "string"
          ? err.message
          : "Ocurrió un error al guardar el elemento de línea de tiempo.");
      toastify.error(msg);

      const errors = err?.response?.data?.errors;
      if (errors && typeof errors === "object") {
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
      title={isEditing ? "Editar Elemento de Línea de Tiempo" : "Nuevo Elemento de Línea de Tiempo"}
      size="lg"
    >
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={isEditing ? updateSchema : storeSchema}
        defaultValues={defaultValues}
        mode={isEditing ? "edit" : "create"}
        className="w-full"
      >
        <div className="grid grid-cols-1 gap-2">
          <div className="col-span-1">
            <InputField name="title" label="Título de la imagen" placeholder="" />
          </div>
          <div className="col-span-1">
            <TextAreaField name="description" label="Descripción de la imagen" placeholder="" />
          </div>
          <div className="col-span-1 w-30">
            <InputField name="year" label="Año de la imagen" placeholder="" />
          </div>

          <div className="col-span-1">
            <InputFileField
              name="photo"
              label="Imagen a mostrar"
              helperText="Formatos aceptados: JPG, JPEG, PNG (Máx. 4MB)"
              // asegúrate que internamente haga: onChange={(e)=>field.onChange(e.target.files)}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default SliderModal;
