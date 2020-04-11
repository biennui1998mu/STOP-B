import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {TokenService} from "./token.service";
import {catchError, map} from "rxjs/operators";
import {of} from "rxjs";
import {FriendRequest} from "../shared/interface/FriendRequest";
import {User} from "../shared/interface/User";

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
    return this.http.post<FriendRequest[]>(`${this.url}/request`, {}, { headers: this.header }).pipe(
      map(result => {
        if (result) {
          return result;
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

  setRequestStatus(requestId:string, credentials: {
    _id: string,
    requester: string,
    recipient: string,
    status: number
  }) {
    return this.http.post<FriendRequest[]>(`${this.url}/request/update/${requestId}`, credentials, {headers: this.header}).pipe(
      map(result => {
        if (result) {
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

  getFriends(){
    return this.http.post<User[]>(`${this.url}/list`, {}, { headers: this.header }).pipe(
      map(result => {
        if (result) {
          return result;
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

  getFriendOnline(){
    return this.http.post<User>(`${this.url}/online`, {}, { headers: this.header }).pipe(
      map(result => {
        if (result) {
          return result;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.log(error);
        return [];
      })
    )
  }
}
