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

}
