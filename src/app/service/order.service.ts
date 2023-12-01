import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../model/appResponse';
import { Order } from '../model/order';
import { StorageService } from './storage.service';
import { OrderStatus } from '../model/order-status';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}
  //admin
  getUserOrders(): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      `http://localhost:8080/api/admin/order/all`
    );
  }

  getAllOrderStatus(): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      `http://localhost:8080/api/admin/order/status/all`
    );
  }
  putOrderStatus(orderStatusData: OrderStatus): Observable<AppResponse> {
    return this.http.put<AppResponse>(
      `http://localhost:8080/api/admin/order/status`,
      orderStatusData
    );
  }
  
  

  //user
  getOrders(): Observable<AppResponse> {
    const userId = this.storageService.getLoggedInUser().id;
    return this.http.get<AppResponse>(
      `http://localhost:8080/api/order/${userId}`
    );
  }

  postOrder(address:any): Observable<AppResponse> {
    return this.http.post<AppResponse>(`http://localhost:8080/api/order`,address);
  }
}
