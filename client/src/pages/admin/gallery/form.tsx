import { InputField, InputFileField, SelectField } from "@/components/form-field";
import Modal from "@/components/modal/Modal";
import { FormProviderWrapper } from "@/composables/FormProviderWrapper";
import type {
  IGalleryCreateRequest as ICreateRequest,
  IGalleryUpdateRequest as IUpdateRequest,
  IGallery as IItemResponse,
} from "@/core/types/IGallery";
import { GalleryService as ItemService } from "@/core/services/gallery/gallery.service";
import { toastify } from "@/core/utils/toastify";
import { storeSchema, updateSchema } from "./validation";
import { useState } from "react";

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
        description: initialData?.description || "",
        description2: initialData?.description2 || "",
        area: initialData?.area || "",
        photo: null,
      } as any)
    : ({ description: "", description2: "", area: "", photo: null } as any);

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
      fd.append("area", data.area ?? "");
      fd.append("description", data.description ?? "");
      fd.append("description2", data.description2 ?? "");
      if (file) fd.append("photo", file); // solo si hay archivo

      // 4) Envía
      if (isEditing) {
        const payload: IUpdateRequest = {
          description: data.description,
          description2: data.description2 ?? null,
          area: data.area,
          photo: file as File, // aquí ya es File
        };
        await ItemService.update(initialData!.id, payload);
        toastify.success("Imagen actualizada");
      } else {
        const payload: ICreateRequest = {
          description: data.description,
          description2: data.description2 ?? null,
          area: data.area,
          photo: file as File, // aquí ya es File
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
  const [controlArea, setControlArea] = useState("");
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
            <SelectField
              name="area"
              label="Área de la imagen"
              placeholder="Selecciona un área"
              options={[
                { label: "Inicio", value: "inicio" },
                { label: "Proyectos", value: "proyectos" },
                { label: "Servicios", value: "servicios" },
              ]}
              onChange={(e) => setControlArea(e.target.value)}
            />
          </div>
          <div className="col-span-1">
            <InputField name="description" label="Descripción de la imagen" placeholder="Ej: Contrucción" />
          </div>
          {controlArea === "inicio" && (
            <div className="col-span-1">
              <InputField
                name="description2"
                label="Descripción de la imagen, complemento"
                placeholder="Ej: Bienes raíces"
              />
            </div>
          )}
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
