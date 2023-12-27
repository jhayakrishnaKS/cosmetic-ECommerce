import { Address } from './address';
import { BeautyProducts } from './beautyProducts';


export interface Order {
  id: number;
  name: string;
  username: string;
  addressList: Address[]; 
  beautyProduct: BeautyProducts;
  orderStatus: number;
  orderedBeautyProductList: BeautyProducts[];
}
