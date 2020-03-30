import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map} from "rxjs/operators";
import {of} from "rxjs";
import {TokenService} from "./token.service";
import {Router} from "@angular/router";
import {DataStateService} from "./data-state.service";
import {User} from "../shared/interface/User";

@Injectable({
  providedIn: 'root'
})
export class AuthorizeService {

  private url = "http://localhost:3000";
  private header: HttpHeaders;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private dataStateService: DataStateService,
    private router: Router,
  ) {
    this.header = new HttpHeaders({
      "Authorize": this.tokenService.getToken(),
    })
  }

  get isAuthorize() {
    return !!this.tokenService.getToken();
    // "" => false
    // null/undefined => false
    // "..." => true
  }

  login(credentials: {
    username: string,
    password: string
  }) {
    return this.http.post<{
      token: string;
      user?: User
      [key: string]: any
    }>(`${this.url}/users/signin`, credentials)
      .pipe(
        map(result => {
          if (result && result.token) {
            this.tokenService.setToken(result.token);
            // save user data globally
            this.dataStateService.saveUserState(result.user);
            return true;
          }
          return false;
        }),
        catchError(error => {
          console.error(error);
          return of(false);
        })
      )
  }

  logout() {
    this.tokenService.clearToken();
    this.router.navigateByUrl('/login');
  }

  signup(credentials: {
    username: string,
    password: string,
    name: string,
    dob: string}) {
    return this.http.post<{
      message: string,
      createdUser?: User,
      error: any
    }>(`${this.url}/users/signup`, credentials)
      .pipe(
        map(status => {
          if (status.createdUser) {
            // tao user thanh cong...lam gi do o day (vd quay ve login)
            return true;
          }
          // trong truong hop m tra ve cai khac.
          return false;
        }),
        catchError(error => {
          // trong truowng hop no co status 409 hoac 500
          console.error(error);
          return of(false);
        })
      )
  }
}
