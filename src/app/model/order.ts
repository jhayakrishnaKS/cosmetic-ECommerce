import { Address } from './address';
import { BeautyProducts } from './beautyProducts';


export interface Order {
  id: number;
  name: string;
  username: string;
  addressList: Address[]; 
  address:Address;
  beautyProduct: BeautyProducts;
  orderStatus: number;
  orderStatus1?:string;
  orderedBeautyProductList: BeautyProducts[];
}
