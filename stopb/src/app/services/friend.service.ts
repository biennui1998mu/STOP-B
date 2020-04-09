import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {catchError, map} from "rxjs/operators";
import {of} from "rxjs";
import {FriendRequest} from "../shared/interface/FriendRequest";

@Injectable({
  providedIn: 'root'
})
export class FriendService {
  public url = 'http://localhost:3000/friends';
  private header: HttpHeaders;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
    this.header = new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  getAllRequest() {
    return this.http.post<{
      token: string,
      error: any,
      requests: FriendRequest[]
    }>(`${this.url}/request`, {}, { headers: this.header }).pipe(
      map(result => {
        if (result.requests) {
          return result.requests;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.log(error);
        return [];
      }),
    );
  }

  sendRequest(credentials: {
    requester: string,
    recipient: string,
    status: number
  }) {
    return this.http.post<{
      token: string;
      message: string,
      sendRequest?: FriendRequest,
      error: any
    }>(`${this.url}/add`, credentials, { headers: this.header }).pipe(
      map(result => {
        return !!result.sendRequest;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }

  setRequestStatus(credentials: {
    _id: string,
    requester: string,
    recipient: string,
    status: number
  }) {
    return this.http.post<{
      message: string,
      updateStatus?: FriendRequest,
      error: any
    }>(`${this.url}/request/update`, credentials).pipe(
      map(result => {
        if (result.updateStatus) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }
}
