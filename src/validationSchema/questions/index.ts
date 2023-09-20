import * as yup from 'yup';

export const questionValidationSchema = yup.object().shape({
  content: yup.string().required(),
  difficulty_level: yup.number().integer().required(),
  question_type: yup.string().required(),
  answer: yup.string().required(),
  chapter_id: yup.string().nullable().required(),
});
