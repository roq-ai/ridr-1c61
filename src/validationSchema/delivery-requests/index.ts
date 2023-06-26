import * as yup from 'yup';

export const deliveryRequestValidationSchema = yup.object().shape({
  pickup_location: yup.string().required(),
  delivery_location: yup.string().required(),
  item_description: yup.string().required(),
  organization_id: yup.string().nullable().required(),
});
