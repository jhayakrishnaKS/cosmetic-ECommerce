// product.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppResponse } from '../model/appResponse';
import { BeautyProducts } from '../model/beautyProducts';
import { Cart } from '../model/cart';
// import { AddBeautyProducts, BeautyProducts } from '../model/beautyProducts';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<AppResponse> {
    return this.http.get<AppResponse>(`${this.apiUrl}/BeautyProduct/all`);
  }

  postProducts(productData: FormData):Observable<AppResponse>{
    return this.http.post<AppResponse>(`${this.apiUrl}/BeautyProduct`,productData);
  }
  
  putProducts(beautyProduct: FormData): Observable<AppResponse> {
    return this.http.put<AppResponse>(`${this.apiUrl}/BeautyProduct`, beautyProduct);
  }
  

  deleteProducts(id: number): Observable<AppResponse> {
    return this.http.delete<AppResponse>(`${this.apiUrl}/BeautyProduct/${id}`);
  }
//user


// Modify your postCart method
postCart(cart:Cart): Observable<AppResponse> {
  return this.http.post<AppResponse>('http://localhost:8080/api/cart', cart);
}

  

  getUserProducts(): Observable<AppResponse> {
    return this.http.get<AppResponse>(`http://localhost:8080/api/BeautyProduct/all`);
  }
 
}
