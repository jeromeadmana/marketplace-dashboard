import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function permissionGuard(resource: string, action: 'read' | 'create' | 'update' | 'delete' = 'read'): CanActivateFn {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    if (auth.hasPermission(resource, action)) {
      return true;
    }
    return router.createUrlTree(['/']);
  };
}
