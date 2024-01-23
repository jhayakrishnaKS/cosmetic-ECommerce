import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AppResponse } from '../model/appResponse';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}

  // Get the cart items for the logged-in user
  getCart(): Observable<AppResponse> {
    const userId = this.storageService.getLoggedInUser().id;
    return this.http.get<AppResponse>(
      `http://localhost:8080/api/cart/${userId}`
    );
  }

  // Delete a product from the cart
  deleteCart(productId: number): Observable<AppResponse> {
    const userId = this.storageService.getLoggedInUser().id;
    return this.http.delete<AppResponse>(
      `http://localhost:8080/api/cart/${userId}/${productId}`
    );
  }

  // Update the count of a product in the cart
  updateCartCount(userId: number, beautyProductId: number, count: number): Observable<AppResponse> {
    if (beautyProductId == null) {
      // Handle the case where beautyProductId is null
      return throwError("beautyProductId cannot be null");
    }
  
    const data = {
      userId: userId,
      beautyProductId: beautyProductId,
      count: count
    };
  
    const loggedInUserId = this.storageService.getLoggedInUser().id;
  
    return this.http.put<AppResponse>(
      `http://localhost:8080/api/cart/${loggedInUserId}`,
      data
    );
  }
}
