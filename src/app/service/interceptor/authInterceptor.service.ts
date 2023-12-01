import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../auth.service";
import { urlEndpoint } from "../../utils/constant";
import { StorageService } from "../storage.service";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private storageService: StorageService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authData = this.storageService.getAuthData();
    const isApiUrl = !request.url.startsWith(urlEndpoint.baseUrl + "/auth");

    if (authData !== null && isApiUrl) {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${authData}`,
        },
      });
    }

    return next.handle(request);
  }
}
