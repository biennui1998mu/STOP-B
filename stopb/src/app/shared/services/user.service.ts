import { Injectable } from '@angular/core';
import { catchError, map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../interface/User";
import { TokenService } from "./token.service";
import { Observable, of } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class UserService {

  public url = 'http://localhost:3000/users';

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  get header() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  getUserData() {
    return this.http.post<User>(`${this.url}/view`, {}, { headers: this.header }).pipe(
      map(result => {
        if (result) {
          return result;
        } else {
          return {};
        }
      }),
      catchError(error => {
        console.log(error);
        return error;
      }),
    );
  }

  getFriendData(friendId: string) {
    return this.http.post<User>(`${this.url}/friend`, { friendId: friendId }, { headers: this.header }).pipe(
      map(result => {
        if (result) {
          return result;
        } else {
          return {};
        }
      }),
      catchError(error => {
        console.log(error);
        return error;
      }),
    );
  }

  searchUser(input: string): Observable<User[]> {
    return this.http.post<User[]>(
      `${this.url}/search`,
      { input: input },
      { headers: this.header },
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

  updateUser(userId: string, status: number) {
    return this.http.post<User>(`${this.url}/update/${userId}`, { status: status}).pipe(
      map(result => {
        return !!result;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }
}
