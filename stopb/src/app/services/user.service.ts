import { Injectable } from '@angular/core';
import {catchError, map} from "rxjs/operators";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {User} from "../shared/interface/User";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public url = 'http://localhost:3000/users';
  private header: HttpHeaders;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
    this.header = new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  getMyInfo(username: string) {
    return this.http.post<{
      token: string,
      error: any,
      user: User
    }>(`${this.url}/view`, { username: username }, { headers: this.header }).pipe(
      map(result => {
        if (result.user) {
          return result.user;
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
}
