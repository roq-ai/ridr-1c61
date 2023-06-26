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
import { createBid } from 'apiSdk/bids';
import { Error } from 'components/error';
import { bidValidationSchema } from 'validationSchema/bids';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import { CarrierInterface } from 'interfaces/carrier';
import { getDeliveryRequests } from 'apiSdk/delivery-requests';
import { getCarriers } from 'apiSdk/carriers';
import { BidInterface } from 'interfaces/bid';

function BidCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: BidInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createBid(values);
      resetForm();
      router.push('/bids');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<BidInterface>({
    initialValues: {
      price: 0,
      delivery_request_id: (router.query.delivery_request_id as string) ?? null,
      carrier_id: (router.query.carrier_id as string) ?? null,
    },
    validationSchema: bidValidationSchema,
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
            Create Bid
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="price" mb="4" isInvalid={!!formik.errors?.price}>
            <FormLabel>Price</FormLabel>
            <NumberInput
              name="price"
              value={formik.values?.price}
              onChange={(valueString, valueNumber) =>
                formik.setFieldValue('price', Number.isNaN(valueNumber) ? 0 : valueNumber)
              }
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
            {formik.errors.price && <FormErrorMessage>{formik.errors?.price}</FormErrorMessage>}
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
          <AsyncSelect<CarrierInterface>
            formik={formik}
            name={'carrier_id'}
            label={'Select Carrier'}
            placeholder={'Select Carrier'}
            fetcher={getCarriers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.id}
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
  entity: 'bid',
  operation: AccessOperationEnum.CREATE,
})(BidCreatePage);
