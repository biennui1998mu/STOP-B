import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateChild, Router, RouterStateSnapshot } from '@angular/router';
import { UserQuery, UserService } from '../services/user';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticateGuard implements CanActivateChild {

  constructor(
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private userQuery: UserQuery,
  ) {
  }

  async canActivateChild(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    if (
      this.tokenService.decodedToken &&
      this.userQuery.getValue()._id
    ) {
      return true;
    }
    if (this.tokenService.decodedToken) {
      // get user
      const user = await this.userService.profile().toPromise();
      if (user) {
        return true;
      }
    }
    this.userService.logout();
    this.router.navigateByUrl('/login');
    return false;
  }
}
