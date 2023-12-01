import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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

  getCart(): Observable<AppResponse> {
    const userId = this.storageService.getLoggedInUser().id;
    return this.http.get<AppResponse>(
      `http://localhost:8080/api/cart/${userId}`
    );
  }

  deleteCart(productId: number): Observable<AppResponse> {
    const userId = this.storageService.getLoggedInUser().id;
    return this.http.delete<AppResponse>(
      `http://localhost:8080/api/cart/${userId}/${productId}`
    );
  }
}
