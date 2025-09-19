import * as yup from "yup";

// Convierte '' -> null para campos opcionales/nullable
const toNullIfEmpty = (v: unknown, originalValue: unknown) =>
  typeof originalValue === "string" && originalValue.trim() === "" ? null : v;

const urlField = yup
  .string()
  .url("URL inválida")
  .nullable()
  .notRequired()
  .transform(toNullIfEmpty);

const textField = yup
  .string()
  .nullable()
  .notRequired()
  .transform(toNullIfEmpty);

export const ResourceBeginStoreSchema = yup.object().shape({
  url: urlField,
  text: textField,
  logo_url: urlField,
});

export const ResourceBeginUpdateSchema = yup.object().shape({
  url: urlField,
  text: textField,
  logo_url: urlField,
});
