import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { Supabase } from "./supabase";
import { AuthService } from "./auth.service";

export const LogInGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const supaBase = inject(Supabase);
  const guest = inject(AuthService);
  const user = await supaBase.getUser();
  if(!user && !guest.canAccess()) return router.parseUrl('/login');
  return true;
}
