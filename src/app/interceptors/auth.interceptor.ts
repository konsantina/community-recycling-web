import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const snack = inject(MatSnackBar);

  const token = auth.getToken(); // ✅ ΜΟΝΟ αυτό
  const url = req.url.toLowerCase();

  const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');

  const authReq =
    token && !isAuthEndpoint
      ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
      : req;

  return next(authReq).pipe(
    catchError((err: unknown) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          auth.logout(); // ✅ να υπάρχει
          snack.open('Χρειάζεται σύνδεση.', 'OK', { duration: 2500 });
          router.navigate(['/login']);
        } else if (err.status === 403) {
          snack.open('Δεν έχεις δικαίωμα για αυτή την ενέργεια.', 'OK', { duration: 3000 });
        }
      }
      return throwError(() => err);
    })
  );
};
