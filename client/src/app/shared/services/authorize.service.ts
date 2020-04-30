import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { TokenService } from "./token.service";
import { Router } from "@angular/router";
import { DataStateService } from "./state/data-state.service";
import { User } from "../interface/User";
import * as io from 'socket.io-client';
import { APIResponse } from '../interface/API-Response';

@Injectable({
  providedIn: 'root',
})
export class AuthorizeService {

  private baseUrl = "http://localhost:3000";
  private url = `${this.baseUrl}/users`;
  private socket;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private dataStateService: DataStateService,
    private router: Router,
  ) {
    this.socket = io(this.baseUrl);
  }

  private _user: User = null;

  get user() {
    return this._user;
  }

  get header() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  get isHavingToken() {
    // "" => false
    // null/undefined => false
    // "..." => true
    const tokenString = this.tokenService.getToken();
    if (!tokenString) return false;

    try {
      // TODO: API check token tren server
      this.tokenService.decodeJwt(tokenString);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  login(credentials: {
    username: string,
    password: string
  }) {
    return this.http.post<APIResponse<{
      token: string,
      user: User
    }>>(`${this.url}/login`, credentials)
      .pipe(
        map(result => {
          if (result.data && result.data.token && result.data.user) {
            this.tokenService.setToken(result.data.token);
            // save user data globally
            this._user = result.data.user;
            // share user status
            return true;
          } else {
            // this.socket.emit("FAIL-TO-LOGIN");
            return false;
          }
        }),
        catchError(error => {
          console.error(error);
          return of(false);
        }),
      );
  }

  /**
   * to remove both token on backend-frontend
   */
  logout() {
    this.http.post<APIResponse<boolean>>(
      `${this.url}/logout`,
      {},
      { headers: this.header },
    ).subscribe(result => {
      console.log(result);
    });
    this.tokenService.clearToken();
    this.router.navigateByUrl('/login');
  }

  /**
   * View profile of the current user
   */
  viewProfile(): Observable<User> {
    return this.http.post<APIResponse<User>>(
      `${this.url}/view`,
      {},
      { headers: this.header },
    ).pipe(
      map(result => {
        return result.data;
      }),
      catchError(error => {
        console.log(error);
        return of(null as User);
      }),
    );
  }

  signUp(credentials: {
    username: string,
    password: string,
    name: string,
    dob: string
  }) {
    return this.http.post<{
      message: string,
      createdUser?: User,
      error: any
    }>(`${this.url}/register`, credentials)
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
        }),
      );
  }
}
