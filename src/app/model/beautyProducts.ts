import { Category } from "./category";

export interface BeautyProducts {
  id: number,
  title: string,
  description: string,
  brand: string,
  photo?: string,
  price: number|null,
  categoryId?: number,
  category?:Category,
}


