import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { AppResponse } from "../model/appResponse";
import { urlEndpoint } from "../utils/constant";
import { Observable, Observer } from "rxjs";
import { StorageService } from "./storage.service";
import {  Address } from "../model/address";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private http: HttpClient,private storageService:StorageService) {}

  getUserDetails(): Observable<AppResponse> {
    return this.http.get<AppResponse>(`${urlEndpoint.baseUrl}/admin/user/all`);
  }
  
  getUsersAddress():Observable<AppResponse>{
    const userId = this.storageService.getLoggedInUser().id;
    return this.http.get<AppResponse>(`${urlEndpoint.baseUrl}/user/${userId}`);
  }

  postUsersAddress(address: Address): Observable<AppResponse> {
    return this.http.post<AppResponse>(`${urlEndpoint.baseUrl}/user/address`, address);
  }
  
  putUserAddress(address: Address): Observable<AppResponse> {
    return this.http.put<AppResponse>(`${urlEndpoint.baseUrl}/user/address`, address);
  }
  
  
  deleteUsersAddress(id: number): Observable<AppResponse> {
    return this.http.delete<AppResponse>(`${urlEndpoint.baseUrl}/user/address/${id}`);
  }
  
}