import { Injectable } from "@angular/core";
import { AppUser } from "../model/appUser";

@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor() {}

  // Set the logged-in user in local storage
  setLoggedInUser(user: AppUser): void {
    localStorage.setItem("loggedInUser", JSON.stringify(user));
  }

  // Get the logged-in user from local storage
  public getLoggedInUser(): AppUser {
    return JSON.parse(localStorage.getItem("loggedInUser") || "{}");
  }

  // Remove the logged-in user from local storage
  public removeLoggedInUser(): void {
    localStorage.removeItem("loggedInUser");
  }

  // Set the current route in local storage
  public setRoute(route: string | null): void {
    if (route !== null) {
      localStorage.setItem("currentRoute", route);
    }
  }

  // Get the current route from local storage
  public getCurrentRoute(): string | null {
    return localStorage.getItem("currentRoute");
  }

  // Get the stored route from local storage
  public getRoute(): string | null {
    return localStorage.getItem("route");
  }

  // Remove the stored route from local storage
  public removeRoute(): void {
    localStorage.removeItem("route");
  }

  // Set authentication data in local storage
  setAuthData(authData: string) {
    localStorage.setItem("authData", authData);
  }

  // Get authentication data from local storage
  public getAuthData(): string | null {
    return localStorage.getItem("authData");
  }

  // Remove authentication data from local storage
  public removeAuthData(): void {
    localStorage.removeItem("authData");
  }
}
