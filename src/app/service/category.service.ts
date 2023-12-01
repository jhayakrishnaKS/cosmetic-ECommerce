import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppResponse } from '../model/appResponse';
import { Category } from '../model/category';
import { urlEndpoint } from '../utils/constant';


@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  getCategories(): Observable<AppResponse> {
    return this.http.get<AppResponse>(
      'http://localhost:8080/api/admin/category/all'
    );
  }
  postCategories(category: Category): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      `${urlEndpoint.baseUrl}/admin/category`,
      category
    );
  }
  putCategory(category: Category): Observable<AppResponse> {
    return this.http.put<AppResponse>(
      `${urlEndpoint.baseUrl}/admin/category`,
      category
    );
  }
  deleteCategory(id: number): Observable<AppResponse> {
    return this.http.delete<AppResponse>(
      `${urlEndpoint.baseUrl}/admin/category/${id}`
    );
  }
}
