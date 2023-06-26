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
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createDeliveryStatus } from 'apiSdk/delivery-statuses';
import { Error } from 'components/error';
import { deliveryStatusValidationSchema } from 'validationSchema/delivery-statuses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import { UserInterface } from 'interfaces/user';
import { getDeliveryRequests } from 'apiSdk/delivery-requests';
import { getUsers } from 'apiSdk/users';
import { DeliveryStatusInterface } from 'interfaces/delivery-status';

function DeliveryStatusCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: DeliveryStatusInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createDeliveryStatus(values);
      resetForm();
      router.push('/delivery-statuses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<DeliveryStatusInterface>({
    initialValues: {
      status: '',
      delivery_request_id: (router.query.delivery_request_id as string) ?? null,
      customer_id: (router.query.customer_id as string) ?? null,
    },
    validationSchema: deliveryStatusValidationSchema,
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
            Create Delivery Status
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="status" mb="4" isInvalid={!!formik.errors?.status}>
            <FormLabel>Status</FormLabel>
            <Input type="text" name="status" value={formik.values?.status} onChange={formik.handleChange} />
            {formik.errors.status && <FormErrorMessage>{formik.errors?.status}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<DeliveryRequestInterface>
            formik={formik}
            name={'delivery_request_id'}
            label={'Select Delivery Request'}
            placeholder={'Select Delivery Request'}
            fetcher={getDeliveryRequests}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.pickup_location}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'customer_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'delivery_status',
  operation: AccessOperationEnum.CREATE,
})(DeliveryStatusCreatePage);
