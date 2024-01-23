import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppResponse } from '../model/appResponse';
import { BeautyProducts } from '../model/beautyProducts';
import { Cart } from '../model/cart';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient, storageService: StorageService) {}

  // Admin section
  // Get all beauty products
  getProducts(): Observable<AppResponse> {
    return this.http.get<AppResponse>(`${this.apiUrl}/BeautyProduct/all`);
  }
  


  // Add a new beauty product
  postProducts(productData: FormData): Observable<AppResponse> {
    return this.http.post<AppResponse>(`${this.apiUrl}/BeautyProduct`, productData);
  }

  // Update an existing beauty product
  putProducts(beautyProduct: FormData): Observable<AppResponse> {
    return this.http.put<AppResponse>(`${this.apiUrl}/BeautyProduct`, beautyProduct);
  }

  // Delete a beauty product
  deleteProducts(id: number): Observable<AppResponse> {
    return this.http.delete<AppResponse>(`${this.apiUrl}/BeautyProduct/${id}`);
  }

  // User section
  // Add a product to the user's cart
  postCart(cart: Cart): Observable<AppResponse> {
    return this.http.post<AppResponse>('http://localhost:8080/api/cart', cart);
  }

  // Get all beauty products for the user
  getUserProducts(): Observable<AppResponse> {
    return this.http.get<AppResponse>(`http://localhost:8080/api/BeautyProduct/all`);
  }
  getProductCategory(categoryId: number): Observable<AppResponse> {
    return this.http.get<AppResponse>(`http://localhost:8080/api/BeautyProduct/category/${categoryId}`);
  }
}
