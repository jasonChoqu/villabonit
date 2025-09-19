import * as yup from "yup";

export const clientStoreSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  email: yup.string().trim().email("Email inválido").optional(),
  phone: yup.string().trim().optional(),
  address: yup.string().trim().optional(),
});

export const clientUpdateSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("El nombre es requerido")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  email: yup.string().trim().email("Email inválido").optional(),
  phone: yup.string().trim().optional(),
  address: yup.string().trim().optional(),
});

export { clientStoreSchema as storeSchema, clientUpdateSchema as updateSchema };
