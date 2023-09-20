import * as yup from 'yup';

export const studySessionValidationSchema = yup.object().shape({
  start_time: yup.date().required(),
  end_time: yup.date().required(),
  user_id: yup.string().nullable().required(),
  textbook_id: yup.string().nullable().required(),
});
