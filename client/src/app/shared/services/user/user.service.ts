import { Injectable } from '@angular/core';
import { UserStore } from './user.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { apiRoute } from '../../api';
import { Observable, of } from 'rxjs';
import { User } from '../../interface/User';
import { APIResponse } from '../../interface/API-Response';
import { TokenService } from '../token.service';

@Injectable({ providedIn: 'root' })
export class UserService {

  private url = apiRoute('users');

  constructor(
    private store: UserStore,
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  profile(): Observable<User> {
    return this.http.post<APIResponse<User>>(
      `${this.url}/view`,
      {},
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(result => {
        if (result.data) {
          this.store.update(result.data);
        } else {
          this.store.reset();
        }
        return result.data;
      }),
      catchError(error => {
        console.log(error);
        return of(null as User);
      }),
    );
  }

  profileById(id: string) {
    return this.http.post<APIResponse<User>>(
      `${this.url}/friend`,
      { friendId: id },
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(result => {
        if (result.data) {
          return result.data;
        } else {
          return null as User;
        }
      }),
      catchError(error => {
        console.log(error);
        return of(null as User);
      }),
    );
  }

  find(input: string): Observable<User[]> {
    return this.http.post<User[]>(
      `${this.url}/search`,
      { input: input },
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(result => {
        if (result) {
          return result;
        }
        return [];
      }),
      catchError(error => {
        console.log(error);
        return [];
      }),
    );
  }

  update(
    userId: string,
    credentials: {
      name: string,
      dob: string,
      avatar: string
    },
  ) {
    return this.http.post<{
      message: string,
      updatedUser?: User,
      error: any
    }>(`${this.url}/update/${userId}`, credentials).pipe(
      map(result => result.updatedUser),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }

  changeStatusUser(userId: string, status: number) {
    return this.http.post<User>(
      `${this.url}/update/${userId}`,
      { status: status },
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(result => {
        return !!result;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }

  login(credentials: {
    username: string,
    password: string
  }) {
    return this.http.post<APIResponse<{ token: string, user: User }>>(
      `${this.url}/login`,
      credentials,
    ).pipe(
      map(result => {
        if (result.data && result.data.token && result.data.user) {
          this.tokenService.token = result.data.token;
          // save user data globally
          this.store.update(result.data.user);
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

  register(credentials: {
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

  logout() {
    this.tokenService.clearToken();
    this.reset();
  }

  reset() {
    this.store.reset();
  }
}
