import axios from 'axios';
import queryString from 'query-string';
import { CarrierInterface, CarrierGetQueryInterface } from 'interfaces/carrier';
import { GetQueryInterface } from '../../interfaces';

export const getCarriers = async (query?: CarrierGetQueryInterface) => {
  const response = await axios.get(`/api/carriers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createCarrier = async (carrier: CarrierInterface) => {
  const response = await axios.post('/api/carriers', carrier);
  return response.data;
};

export const updateCarrierById = async (id: string, carrier: CarrierInterface) => {
  const response = await axios.put(`/api/carriers/${id}`, carrier);
  return response.data;
};

export const getCarrierById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/carriers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteCarrierById = async (id: string) => {
  const response = await axios.delete(`/api/carriers/${id}`);
  return response.data;
};
