import { InputField, InputFileField } from "@/components/form-field";
import Modal from "@/components/modal/Modal";
import { FormProviderWrapper } from "@/composables/FormProviderWrapper";
import type {
  IBannerCreateRequest as ICreateRequest,
  IBannerUpdateRequest as IUpdateRequest,
  IBanner as IItemResponse,
} from "@/core/types/IBanner";
import { BannerService as ItemService } from "@/core/services/banner/banner.service";
import { toastify } from "@/core/utils/toastify";
import { storeSchema, updateSchema } from "./validation";

interface BannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: IItemResponse | null;
  load: () => void;
}

/* ---------- helpers para archivos ---------- */
const isDataUrl = (v: unknown): v is string => typeof v === "string" && /^data:.*;base64,/.test(v);

const mimeToExt = (mime: string) => {
  const map: Record<string, string> = {
    "image/png": "png",
  };
  return map[mime] ?? "bin";
};

// Convierte data URL (base64) -> File
const dataUrlToFile = async (dataUrl: string, filenameBase = "banner"): Promise<File> => {
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

const BannerModal = ({ isOpen, onClose, initialData = null, load }: BannerModalProps) => {
  const isEditing = !!initialData;

  type FormValues = ICreateRequest | IUpdateRequest;

  const defaultValues: FormValues = isEditing
    ? ({
        title: initialData?.title || "",
        subtitle: initialData?.subtitle || "",
        image: null,
      } as any)
    : ({ title: "", subtitle: "", area: "", image: null } as any);

  const handleSubmit = async (data: any) => {
    try {
      // 1) Normaliza a File (cubre File, FileList, File[], data URL)
      const file = await extractAnyFile(data.image);

      console.log(file);
      // 2) En creación es obligatorio; en edición no
      if (!file && !isEditing) {
        toastify.error("Debes adjuntar la imagen.");
        return;
      }

      // 3) Arma FormData (recomendado para Laravel)
      const fd = new FormData();
      fd.append("title", data.title ?? "");
      fd.append("subtitle", data.subtitle ?? "");
      if (file) fd.append("image", file); // solo si hay archivo

      // 4) Envía
      if (isEditing) {
        const payload: IUpdateRequest = {
          title: data.title,
          subtitle: data.subtitle ?? null,
          image: file as File, // aquí ya es File
        };
        await ItemService.update(initialData!.id, payload);
        toastify.success("Imagen actualizada");
      } else {
        const payload: ICreateRequest = {
          title: data.title,
          subtitle: data.subtitle ?? null,
          image: file as File, // aquí ya es File
        };
        await ItemService.create(payload);
        toastify.success("Imagen creada");
      }

      onClose();
      load();
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        (typeof err?.message === "string" ? err.message : "Ocurrió un error al guardar la imagen.");
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
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? "Editar Imagen" : "Nuevo Imagen"} size="lg">
      <FormProviderWrapper
        onSubmit={handleSubmit}
        validationSchema={isEditing ? updateSchema : storeSchema}
        defaultValues={defaultValues}
        mode={isEditing ? "edit" : "create"}
        className="w-full"
      >
        <div className="grid grid-cols-1 gap-6">
          <div className="col-span-1">
            <InputField name="title" label="Título" placeholder="" disabled={true} />
          </div>
          <div className="col-span-1">
            <InputField name="subtitle" label="Subtítulo" placeholder="Ej: Contrucción" />
          </div>

          <div className="col-span-1">
            <InputFileField
              name="image"
              label="Imagen a mostrar"
              helperText="Formatos aceptados: PNG (Máx. 4MB)"
              accept="image/png"
              // asegúrate que internamente haga: onChange={(e)=>field.onChange(e.target.files)}
            />
          </div>
        </div>
      </FormProviderWrapper>
    </Modal>
  );
};

export default BannerModal;
