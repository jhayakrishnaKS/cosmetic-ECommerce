import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { urlEndpoint } from '../utils/constant';
import { AppResponse } from '../model/appResponse';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  error: String = '';
  private selectedProduct: any;

  constructor(private http: HttpClient) {}

  // Get all beauty products
  getAllBeautyProduct(): void {
    console.log('called');

    this.http.get<AppResponse>(`${urlEndpoint.baseUrl}/BeautyProduct/all`).subscribe({
      next: (response) => {
        console.log(response.data);
        return response;
      },
      error: (err) => {
        let message: String = err.error.error.message;
        this.error = message.includes(',') ? message.split(',')[0] : message;
      },
    });
  }

  // Get the currently selected product
  getSelectedProduct(): any {
    return this.selectedProduct;
  }

  // Set the selected product
  setSelectedProduct(product: any): void {
    this.selectedProduct = product;
  }
}
