import * as yup from "yup";

export const imageSchema = yup
  .mixed()
  .nullable()
  .test("file-size", "El tamaño máximo permitido es 4MB", (value) => {
    if (!value) return true;

    if (typeof value === "string") {
      const isBase64Image = value.startsWith("data:image/");
      const isImageUrl = /\.(jpe?g|png|gif|webp)$/i.test(value.split("?")[0]);
      return isBase64Image || isImageUrl; // Si no cumple, retorna false
    }

    if (value instanceof File) {
      return value.size <= 4 * 1024 * 1024;
    }

    return false;
  });

const GalleryStoreSchema = yup.object().shape({
  description: yup
    .string()
    .required("La descripción es requerida")
    .max(100, "La descripción no puede exceder los 100 caracteres"),
  description2: yup.string().max(2000, "La descripción no puede exceder los 2000 caracteres"),
  area: yup.string().required("La área es requerida"),
  photo: imageSchema,
});

const GalleryUpdateSchema = yup.object().shape({
  description: yup
    .string()
    .required("La descripción es requerida")
    .max(100, "La descripción no puede exceder los 100 caracteres"),
  description2: yup.string().max(2000, "La descripción no puede exceder los 2000 caracteres"),
  area: yup.string().required("La área es requerida"),
  photo: imageSchema,
});

export { GalleryStoreSchema as storeSchema, GalleryUpdateSchema as updateSchema };
