import axios from 'axios';
import queryString from 'query-string';
import { DeliveryStatusInterface, DeliveryStatusGetQueryInterface } from 'interfaces/delivery-status';
import { GetQueryInterface } from '../../interfaces';

export const getDeliveryStatuses = async (query?: DeliveryStatusGetQueryInterface) => {
  const response = await axios.get(`/api/delivery-statuses${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDeliveryStatus = async (deliveryStatus: DeliveryStatusInterface) => {
  const response = await axios.post('/api/delivery-statuses', deliveryStatus);
  return response.data;
};

export const updateDeliveryStatusById = async (id: string, deliveryStatus: DeliveryStatusInterface) => {
  const response = await axios.put(`/api/delivery-statuses/${id}`, deliveryStatus);
  return response.data;
};

export const getDeliveryStatusById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/delivery-statuses/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDeliveryStatusById = async (id: string) => {
  const response = await axios.delete(`/api/delivery-statuses/${id}`);
  return response.data;
};
