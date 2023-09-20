import * as yup from 'yup';

export const chapterValidationSchema = yup.object().shape({
  title: yup.string().required(),
  number: yup.number().integer().required(),
  page_start: yup.number().integer().required(),
  page_end: yup.number().integer().required(),
  textbook_id: yup.string().nullable().required(),
});
