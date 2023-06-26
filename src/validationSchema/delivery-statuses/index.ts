import * as yup from 'yup';

export const deliveryStatusValidationSchema = yup.object().shape({
  status: yup.string().required(),
  delivery_request_id: yup.string().nullable().required(),
  customer_id: yup.string().nullable().required(),
});
