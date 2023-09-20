import * as yup from 'yup';

export const textbookValidationSchema = yup.object().shape({
  title: yup.string().required(),
  subject: yup.string().required(),
  grade_level: yup.number().integer().required(),
  publication_year: yup.date().required(),
  publisher: yup.string().required(),
  provider_id: yup.string().nullable().required(),
});
