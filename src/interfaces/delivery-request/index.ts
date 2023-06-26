import { BidInterface } from 'interfaces/bid';
import { DeliveryStatusInterface } from 'interfaces/delivery-status';
import { OrganizationInterface } from 'interfaces/organization';
import { GetQueryInterface } from 'interfaces';

export interface DeliveryRequestInterface {
  id?: string;
  pickup_location: string;
  delivery_location: string;
  item_description: string;
  organization_id: string;
  created_at?: any;
  updated_at?: any;
  bid?: BidInterface[];
  delivery_status?: DeliveryStatusInterface[];
  organization?: OrganizationInterface;
  _count?: {
    bid?: number;
    delivery_status?: number;
  };
}

export interface DeliveryRequestGetQueryInterface extends GetQueryInterface {
  id?: string;
  pickup_location?: string;
  delivery_location?: string;
  item_description?: string;
  organization_id?: string;
}
