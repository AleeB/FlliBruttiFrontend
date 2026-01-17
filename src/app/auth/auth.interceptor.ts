import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const isAuthRequest =
    req.url.endsWith('/api/Login') ||
    req.url.endsWith('/api/Login/refresh') ||
    req.url.endsWith('/api/Login/Logout');
  const token = authService.getToken();

  const authRequest =
    !token || isAuthRequest
      ? req
      : req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(authRequest).pipe(
    catchError((error: unknown) => {
      if (
        error instanceof HttpErrorResponse &&
        error.status === 401 &&
        !isAuthRequest
      ) {
        const refreshToken = authService.getRefreshToken();
        if (!refreshToken) {
          authService.logout();
          return throwError(() => error);
        }

        return authService.refreshAccessToken().pipe(
          switchMap((newToken) => {
            const retryRequest = req.clone({
              setHeaders: { Authorization: `Bearer ${newToken}` }
            });
            return next(retryRequest);
          }),
          catchError((refreshError) => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
