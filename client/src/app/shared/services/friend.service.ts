import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TokenService } from "./token.service";
import { catchError, map } from "rxjs/operators";
import { BehaviorSubject, Observable, of } from "rxjs";
import { FriendRequest } from "../interface/FriendRequest";
import { User } from "../interface/User";
import { APIResponse } from '../interface/API-Response';

@Injectable({
  providedIn: 'root',
})
export class FriendService {
  public url = 'http://localhost:3000/friends';

  private _friends: BehaviorSubject<User[]> =
    new BehaviorSubject([]);
  public friends = this._friends.asObservable();

  private _friendsLoading: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  public friendLoading = this._friendsLoading.asObservable();

  public friendRequestLoading = this._friendsLoading.asObservable();
  private _friendRequest: BehaviorSubject<FriendRequest<User>[]> =
    new BehaviorSubject([]);

  public friendRequest = this._friendRequest.asObservable();
  private _friendRequestLoading: BehaviorSubject<boolean> =
    new BehaviorSubject(false);

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

  sendFriendRequest(credentials: {
    requester: string,
    recipient: string,
    status: 0
  }): Observable<FriendRequest> {
    return this.http.post<{
      token: string;
      message: string,
      sendRequest?: FriendRequest,
      error: any
    }>(`${this.url}/add`, credentials, { headers: this.header }).pipe(
      map(result => {
        return result.sendRequest;
      }),
      catchError(error => {
        console.log(error);
        return of(null);
      }),
    );
  }

  responseFriendRequest(
    requestId: string,
    updateInfo: Partial<FriendRequest>,
  ): Observable<FriendRequest> {
    return this.http.post<APIResponse<FriendRequest>>(
      `${this.url}/request/update/${requestId}`,
      updateInfo,
      { headers: this.header },
    ).pipe(
      map(result => {
        return result.data;
      }),
      catchError(error => {
        console.log(error);
        return of(null);
      }),
    );
  }

  /**
   * Refresh and get new list friends
   */
  refreshFriendList() {
    this._friendsLoading.next(true);
    return this.http.post<User[]>(
      `${this.url}/list`,
      {},
      { headers: this.header },
    ).pipe(
      catchError(error => {
        console.log(error);
        return of([]);
      }),
    ).subscribe(listFriends => {
      this._friendsLoading.next(false);
      this._friends.next(listFriends);
    });
  }

  /**
   * Refresh and get new list friend requests.
   */
  refreshFriendRequest() {
    this._friendRequestLoading.next(true);
    this.http.post<FriendRequest<User>[]>(
      `${this.url}/request`,
      {},
      { headers: this.header },
    ).pipe(
      catchError(error => {
        console.log(error);
        return of([]);
      }),
    ).subscribe(request => {
      this._friendRequestLoading.next(false);
      this._friendRequest.next(request);
    });
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
