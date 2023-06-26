import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import { CarrierInterface } from 'interfaces/carrier';
import { GetQueryInterface } from 'interfaces';

export interface BidInterface {
  id?: string;
  price: number;
  delivery_request_id: string;
  carrier_id: string;
  created_at?: any;
  updated_at?: any;

  delivery_request?: DeliveryRequestInterface;
  carrier?: CarrierInterface;
  _count?: {};
}

export interface BidGetQueryInterface extends GetQueryInterface {
  id?: string;
  delivery_request_id?: string;
  carrier_id?: string;
}
