import { Address } from "./address";

export interface AppUser {
  id: number;
  username: string;
  password: string;
  role: string;
  addressList: Address[];
  address?:Address;
}

