import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getDeliveryRequestById, updateDeliveryRequestById } from 'apiSdk/delivery-requests';
import { Error } from 'components/error';
import { deliveryRequestValidationSchema } from 'validationSchema/delivery-requests';
import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { OrganizationInterface } from 'interfaces/organization';
import { getOrganizations } from 'apiSdk/organizations';

function DeliveryRequestEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<DeliveryRequestInterface>(
    () => (id ? `/delivery-requests/${id}` : null),
    () => getDeliveryRequestById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: DeliveryRequestInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateDeliveryRequestById(id, values);
      mutate(updated);
      resetForm();
      router.push('/delivery-requests');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<DeliveryRequestInterface>({
    initialValues: data,
    validationSchema: deliveryRequestValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Edit Delivery Request
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
          <form onSubmit={formik.handleSubmit}>
            <FormControl id="pickup_location" mb="4" isInvalid={!!formik.errors?.pickup_location}>
              <FormLabel>Pickup Location</FormLabel>
              <Input
                type="text"
                name="pickup_location"
                value={formik.values?.pickup_location}
                onChange={formik.handleChange}
              />
              {formik.errors.pickup_location && <FormErrorMessage>{formik.errors?.pickup_location}</FormErrorMessage>}
            </FormControl>
            <FormControl id="delivery_location" mb="4" isInvalid={!!formik.errors?.delivery_location}>
              <FormLabel>Delivery Location</FormLabel>
              <Input
                type="text"
                name="delivery_location"
                value={formik.values?.delivery_location}
                onChange={formik.handleChange}
              />
              {formik.errors.delivery_location && (
                <FormErrorMessage>{formik.errors?.delivery_location}</FormErrorMessage>
              )}
            </FormControl>
            <FormControl id="item_description" mb="4" isInvalid={!!formik.errors?.item_description}>
              <FormLabel>Item Description</FormLabel>
              <Input
                type="text"
                name="item_description"
                value={formik.values?.item_description}
                onChange={formik.handleChange}
              />
              {formik.errors.item_description && <FormErrorMessage>{formik.errors?.item_description}</FormErrorMessage>}
            </FormControl>
            <AsyncSelect<OrganizationInterface>
              formik={formik}
              name={'organization_id'}
              label={'Select Organization'}
              placeholder={'Select Organization'}
              fetcher={getOrganizations}
              renderOption={(record) => (
                <option key={record.id} value={record.id}>
                  {record?.name}
                </option>
              )}
            />
            <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
              Submit
            </Button>
          </form>
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'delivery_request',
  operation: AccessOperationEnum.UPDATE,
})(DeliveryRequestEditPage);
