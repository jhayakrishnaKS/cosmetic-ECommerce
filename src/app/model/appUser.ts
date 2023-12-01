import { AddAddress } from "./address";

export interface AppUser {
  id: number;
  username: string;
  password: string;
  role: string;
  addressList: AddAddress[];
}

