import * as yup from 'yup';

export const CertificationStoreSchema = yup.object().shape({
  user_id: yup.number().nullable(),
  student_id: yup.number().nullable(),
  course_id: yup.number().nullable(),
  title: yup.string().required('Title is required'),
  full_name: yup.string().required('Full name is required'),
  national_registry: yup.string().nullable(),
  content: yup.string().nullable(),
  issue_date: yup.string().required('Issue date is required'),
  issue_city: yup.string().required('Issue city is required'),
  signature_1_name: yup.string().nullable(),
  signature_1_position: yup.string().nullable(),
  signature_2_name: yup.string().nullable(),
  signature_2_position: yup.string().nullable(),
  signature_3_name: yup.string().nullable(),
  signature_3_position: yup.string().nullable(),
  verification_code: yup.string().required('Verification code is required'),
  qr_url: yup.string().nullable(),
  pdf_file: yup.string().nullable(),
  template: yup.string().nullable(),
});

export const CertificationUpdateSchema = CertificationStoreSchema;
