import axios from 'axios';
import queryString from 'query-string';
import { BidInterface, BidGetQueryInterface } from 'interfaces/bid';
import { GetQueryInterface } from '../../interfaces';

export const getBids = async (query?: BidGetQueryInterface) => {
  const response = await axios.get(`/api/bids${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createBid = async (bid: BidInterface) => {
  const response = await axios.post('/api/bids', bid);
  return response.data;
};

export const updateBidById = async (id: string, bid: BidInterface) => {
  const response = await axios.put(`/api/bids/${id}`, bid);
  return response.data;
};

export const getBidById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/bids/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteBidById = async (id: string) => {
  const response = await axios.delete(`/api/bids/${id}`);
  return response.data;
};
