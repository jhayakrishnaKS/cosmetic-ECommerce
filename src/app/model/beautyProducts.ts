import { Category } from "./category";

export interface BeautyProducts {
  id: number,
  title: string,
  description: string,
  brand: string,
  photo?: string,
  price: number,
  categoryId?: number,
  category?:Category,
}

// export interface AddBeautyProducts {
//   id: number,
//   title: string,
//   description: string,
//   brand: string,
//   price: number,
//   categoryId?: number,
//   photo: null,
// }
