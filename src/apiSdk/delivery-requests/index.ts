import axios from 'axios';
import queryString from 'query-string';
import { DeliveryRequestInterface, DeliveryRequestGetQueryInterface } from 'interfaces/delivery-request';
import { GetQueryInterface } from '../../interfaces';

export const getDeliveryRequests = async (query?: DeliveryRequestGetQueryInterface) => {
  const response = await axios.get(`/api/delivery-requests${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createDeliveryRequest = async (deliveryRequest: DeliveryRequestInterface) => {
  const response = await axios.post('/api/delivery-requests', deliveryRequest);
  return response.data;
};

export const updateDeliveryRequestById = async (id: string, deliveryRequest: DeliveryRequestInterface) => {
  const response = await axios.put(`/api/delivery-requests/${id}`, deliveryRequest);
  return response.data;
};

export const getDeliveryRequestById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/delivery-requests/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteDeliveryRequestById = async (id: string) => {
  const response = await axios.delete(`/api/delivery-requests/${id}`);
  return response.data;
};
