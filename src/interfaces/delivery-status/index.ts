import { DeliveryRequestInterface } from 'interfaces/delivery-request';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface DeliveryStatusInterface {
  id?: string;
  status: string;
  delivery_request_id: string;
  customer_id: string;
  created_at?: any;
  updated_at?: any;

  delivery_request?: DeliveryRequestInterface;
  user?: UserInterface;
  _count?: {};
}

export interface DeliveryStatusGetQueryInterface extends GetQueryInterface {
  id?: string;
  status?: string;
  delivery_request_id?: string;
  customer_id?: string;
}
