import {  Address } from './address';

export interface UserDetail {
  id: number,
  username: string,
  name: string,
  roles: string,
  joinedAt: string,
  addressList:Address[],
}
