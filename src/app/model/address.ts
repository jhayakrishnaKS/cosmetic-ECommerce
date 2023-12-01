export interface Address {
  id: number;
  address: string;
  city: string;
  zipcode:   number;
}
export interface AddAddress {
  id: number,
  userId?: number,
  address: string,
  city: string,
  zipcode: number,
}
