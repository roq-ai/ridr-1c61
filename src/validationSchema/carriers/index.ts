import * as yup from 'yup';

export const carrierValidationSchema = yup.object().shape({
  user_id: yup.string().nullable().required(),
});
