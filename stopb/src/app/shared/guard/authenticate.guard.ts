import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
  CanActivateChild
} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthorizeService} from "../../services/authorize.service";

@Injectable({
  providedIn: 'root'
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
    console.log(next);
    console.log(state);
    this.router.navigateByUrl('/login');
    return false;
  }

}
