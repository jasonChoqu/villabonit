import * as yup from "yup";

export const imageSchema = yup
  .mixed()
  .nullable()
  .test("file-type-size", "Solo PNG hasta 4MB", (value) => {
    if (!value) return true;

    // value puede ser base64 string o File
    if (typeof value === "string") {
      // Debe ser data URL PNG
      const isBase64Png = value.startsWith("data:image/png");
      if (!isBase64Png) return false;
      // tamaño no es trivial desde base64, asumimos que el componente previo ya limitó a 4MB
      return true;
    }

    if (value instanceof File) {
      const isPng = value.type === "image/png" || /\.png$/i.test(value.name);
      const isSmall = value.size <= 4 * 1024 * 1024;
      return isPng && isSmall;
    }

    return false;
  });

const BannerStoreSchema = yup.object().shape({
  title: yup.string().required("El título es requerido").max(100, "El título no puede exceder los 100 caracteres"),
  subtitle: yup
    .string()
    .required("El subtítulo es requerido")
    .max(2000, "El subtítulo no puede exceder los 2000 caracteres"),
  image: imageSchema,
});

const BannerUpdateSchema = yup.object().shape({
  title: yup.string().required("El título es requerido").max(100, "El título no puede exceder los 100 caracteres"),
  subtitle: yup
    .string()
    .required("El subtítulo es requerido")
    .max(2000, "El subtítulo no puede exceder los 2000 caracteres"),
  image: imageSchema,
});

export { BannerStoreSchema as storeSchema, BannerUpdateSchema as updateSchema };
