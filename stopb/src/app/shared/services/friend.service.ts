import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenService } from "./token.service";
import { catchError, map } from "rxjs/operators";
import { BehaviorSubject, of } from "rxjs";
import { FriendRequest } from "../interface/FriendRequest";
import { User } from "../interface/User";

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  public url = 'http://localhost:3000/friends';

  private _friends: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);
  public friends = this._friends.asObservable();

  private _friendRequest: BehaviorSubject<FriendRequest<User>[]> = new BehaviorSubject([]);
  public friendRequest = this._friendRequest.asObservable();

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

  getFriendRequests() {
    this.http.post<FriendRequest<User>[]>(
      `${this.url}/request`,
      {},
      { headers: this.header },
    ).pipe(
      map(result => {
        if (result) {
          return result;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.log(error);
        return of([]);
      }),
    ).subscribe(request => this._friendRequest.next(request));
  }

  sendRequest(credentials: {
    requester: string,
    recipient: string,
    status: 0
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

  setRequestStatus(requestId: string, credentials: {
    _id: string,
    requester: string,
    recipient: string,
    status: number
  }) {
    return this.http.post<FriendRequest[]>(
      `${this.url}/request/update/${requestId}`,
      credentials,
      { headers: this.header },
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

  /**
   * Refresh and get new list friends
   */
  getFriends() {
    return this.http.post<User[]>(
      `${this.url}/list`,
      {},
      { headers: this.header },
    ).pipe(
      map(result => {
        if (result) {
          return result;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.log(error);
        return of([]);
      }),
    ).subscribe(listFriends => this._friends.next(listFriends));
  }

  getFriendOnline() {
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
      }),
    );
  }
}
