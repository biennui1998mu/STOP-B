import { Injectable } from '@angular/core';
import { FriendRequestsStore } from './friend-requests.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { FriendRequest } from '../../interface/FriendRequest';
import { APIResponse } from '../../interface/API-Response';
import { apiRoute } from '../../api';
import { TokenService } from '../token.service';
import { User } from '../../interface/User';

@Injectable({ providedIn: 'root' })
export class FriendRequestsService {
  private url = apiRoute('friends');

  constructor(
    private store: FriendRequestsStore,
    private tokenService: TokenService,
    private http: HttpClient,
  ) {
  }

  /**
   * Refresh and get new list friend requests.
   */
  get() {
    this.store.setLoading(true);
    this.http.post<FriendRequest<User>[]>(
      `${this.url}/request`,
      {},
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      catchError(error => {
        console.log(error);
        return of([]);
      }),
    ).subscribe(requests => {
      this.store.set(requests);
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
    }>(
      `${this.url}/add`,
      credentials,
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
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
      { headers: this.tokenService.authorizeHeader },
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

  removeFromStore(request: FriendRequest) {
    this.store.remove(request._id);
  }
}
