import { BidInterface } from 'interfaces/bid';
import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface CarrierInterface {
  id?: string;
  user_id: string;
  created_at?: any;
  updated_at?: any;
  bid?: BidInterface[];
  user?: UserInterface;
  _count?: {
    bid?: number;
  };
}

export interface CarrierGetQueryInterface extends GetQueryInterface {
  id?: string;
  user_id?: string;
}
