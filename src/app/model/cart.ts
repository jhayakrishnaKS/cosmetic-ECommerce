import { BeautyProducts } from './beautyProducts';

export interface Cart {
  id?:number,
  beautyProducts: BeautyProducts;
  beautyProductId: number;
  count: number;
  userId?:number,
}
