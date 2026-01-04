import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!auth.getToken()) {
    router.navigate(['/login']);
    return false;
  }

  if (!auth.isAdmin() && !auth.isModerator?.()) {
    router.navigate(['/my-dropoffs']);
    return false;
  }

  return true;
};
