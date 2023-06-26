import * as yup from 'yup';

export const bidValidationSchema = yup.object().shape({
  price: yup.number().integer().required(),
  delivery_request_id: yup.string().nullable().required(),
  carrier_id: yup.string().nullable().required(),
});
