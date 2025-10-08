import * as yup from 'yup';

export const projectStoreSchema = yup.object().shape({
  title: yup.string()
    .required('El título es obligatorio')
    .max(255, 'El título no puede exceder 255 caracteres'),
  description: yup.string()
    .required('La descripción es obligatoria'),
  features: yup.string()
    .required('Las características son obligatorias'),
  image: yup.mixed().optional()
});

export const projectUpdateSchema = yup.object().shape({
  title: yup.string()
    .max(255, 'El título no puede exceder 255 caracteres'),
  description: yup.string(),
  features: yup.string(),
  image: yup.mixed().optional()
});