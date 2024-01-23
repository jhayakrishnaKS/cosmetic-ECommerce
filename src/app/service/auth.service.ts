import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CONSTANT, urlEndpoint } from "../utils/constant";
import { Login } from "../model/login";
import { BehaviorSubject, Observable, Observer, map } from "rxjs";
import { AppResponse } from "../model/appResponse";
import { StorageService } from "./storage.service";
import { AppUser } from "../model/appUser";
import { Register } from "../model/register";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Observable to track the admin status
  private isAdminSubject = new BehaviorSubject<boolean>(false);

  // Observable to track the login status
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  // Expose isAdmin and isLoggedIn as public observables
  isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable();
  isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private storageService: StorageService
  ) {
    // Check if a user is already logged in during service initialization
    if (storageService.getLoggedInUser().id != null) {
      this.setLoggedIn(storageService.getLoggedInUser());
    }
  }

  // Get all users
  getAllUsers() {
    return this.http.get<AppResponse>(`http://localhost:8080/api/auth/allusers`);
  }

  // Login user
  login(login: Login): Observable<AppResponse> {
    return this.http
      .post<AppResponse>(`${urlEndpoint.baseUrl}/auth/login`, login)
      .pipe(
        map((user) => {
          // Set authentication data in storage
          this.storageService.setAuthData(
            window.btoa(login.username + ":" + login.password)
          );
          return user;
        })
      );
  }

  // Logout user
  logout() {
    this.storageService.removeAuthData();
    this.isAdminSubject.next(false);
    this.isLoggedInSubject.next(false);
    this.storageService.removeLoggedInUser();
    this.storageService.removeRoute();
    this.router.navigate(["/k-cosmetics"], { replaceUrl: true });   
  }

  // Check if the user is an admin
  isAdmin(): boolean {
    return this.isAdminSubject.value;
  }

  // Check if the user is logged in
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  // Set the user as logged in
  setLoggedIn(user: AppUser): void {
    this.storageService.setLoggedInUser(user);
    this.isLoggedInSubject.next(true);

    let route: string | null = this.storageService.getRoute();
    if (user.role === CONSTANT.USER) {
      if (route === null) route = "";
      this.router.navigate(["/" + route], { replaceUrl: true });
    } else if (user.role === CONSTANT.ADMIN) {
      if (route === null) route = "admin";
      this.isAdminSubject.next(true);
      this.router.navigate(["/" + route], { replaceUrl: true });
    }
  }

  // Register new user
  register(newregister: Register): Observable<AppResponse> {
    return this.http.post<AppResponse>(
      `${urlEndpoint.baseUrl}/auth/register`,
      newregister
    );
  }
}
