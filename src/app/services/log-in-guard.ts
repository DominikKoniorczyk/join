import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Supabase } from "./supabase";
import { AuthService } from "./auth.service";

/**
 * Route guard that prevents access to certain routes for unauthenticated users.
 *
 * Checks if a user is logged in via Supabase or if a guest has access.
 * Redirects to the login page if neither condition is met.
 *
 * @returns {Promise<boolean|UrlTree>} True if access is allowed, otherwise a UrlTree redirecting to '/login'.
 */
export const LogInGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const supaBase = inject(Supabase);
  const guest = inject(AuthService);
  const user = await supaBase.getUser();
  if (!user && !guest.canAccess()) return router.parseUrl('/login');
  return true;
}
