import * as yup from "yup";

export const imageSchema = yup
  .mixed()
  .nullable()
  .test("file-size", "El tamaño máximo permitido es 1MB", (value) => {
    if (!value) return true;

    if (typeof value === "string") {
      const isBase64Image = value.startsWith("data:image/");
      const isImageUrl = /\.(jpe?g|png|gif|webp)$/i.test(value.split("?")[0]);
      return isBase64Image || isImageUrl; // Si no cumple, retorna false
    }

    if (value instanceof File) {
      return value.size <= 1 * 1024 * 1024;
    }

    return false;
  });

const GalleryStoreSchema = yup.object().shape({
  title: yup.string().required("El título es requerido").max(50, "El título no puede exceder los 50 caracteres"),
  description2: yup.string().max(100, "La descripción no puede exceder los 100 caracteres"),
  year: yup.string().required("El año es requerido").max(4, "El año no puede exceder los 4 caracteres"),
  photo: imageSchema,
});

const GalleryUpdateSchema = yup.object().shape({
  title: yup.string().required("El título es requerido").max(50, "El título no puede exceder los 50 caracteres"),
  description2: yup.string().max(100, "La descripción no puede exceder los 100 caracteres"),
  year: yup.string().required("El año es requerido").max(4, "El año no puede exceder los 4 caracteres"),
  photo: imageSchema,
});

export { GalleryStoreSchema as storeSchema, GalleryUpdateSchema as updateSchema };
