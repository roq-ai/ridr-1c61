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
import { getBidById, updateBidById } from 'apiSdk/bids';
import { Error } from 'components/error';
import { bidValidationSchema } from 'validationSchema/bids';
import { BidInterface } from 'interfaces/bid';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, withAuthorization } from '@roq/nextjs';
import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import { CarrierInterface } from 'interfaces/carrier';
import { getDeliveryRequests } from 'apiSdk/delivery-requests';
import { getCarriers } from 'apiSdk/carriers';

function BidEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<BidInterface>(
    () => (id ? `/bids/${id}` : null),
    () => getBidById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: BidInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateBidById(id, values);
      mutate(updated);
      resetForm();
      router.push('/bids');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<BidInterface>({
    initialValues: data,
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
            Edit Bid
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
        )}
      </Box>
    </AppLayout>
  );
}

export default withAuthorization({
  service: AccessServiceEnum.PROJECT,
  entity: 'bid',
  operation: AccessOperationEnum.UPDATE,
})(BidEditPage);
