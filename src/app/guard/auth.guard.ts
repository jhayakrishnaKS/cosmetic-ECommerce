import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../service/auth.service";
import { StorageService } from "../service/storage.service";

export const authGuard: CanActivateFn = (route, state) => {
  const storageService = inject(StorageService);
  const loginService = inject(AuthService);
  const router = inject(Router);

  const storedRoute = storageService.getCurrentRoute();

  storageService.setRoute(
    route.routeConfig?.path !== undefined ? route.routeConfig.path : null
  );

  if (!loginService.isLoggedIn()) {
    if (storedRoute) {
      router.navigate([storedRoute], { replaceUrl: true });
    } else {
      router.navigate(["/login"], { replaceUrl: true });
    }
  }

  return loginService.isLoggedIn();
};
