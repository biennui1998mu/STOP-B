import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { AuthorizeService } from "../services/authorize.service";

@Injectable({
  providedIn: 'root',
})
export class AuthenticateGuard implements CanActivateChild {

  constructor(
    private router: Router,
    private authorizeService: AuthorizeService,
  ) {
  }

  canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (this.authorizeService.isAuthorize) {
      return true;
    }
    this.router.navigateByUrl('/login');
    return false;
  }

}
