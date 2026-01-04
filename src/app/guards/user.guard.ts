import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const userGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  // admin/mod δεν πρέπει να βλέπουν user pages
  if (auth.isAdmin() || auth.isModerator?.()) {
    router.navigate(['/admin/dropoffs/pending']);
    return false;
  }

  return true;
};
