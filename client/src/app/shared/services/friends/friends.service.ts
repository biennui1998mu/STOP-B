import { Injectable } from '@angular/core';
import { FriendsStore } from './friends.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';
import { TokenService } from '../token.service';
import { apiRoute } from '../../api';
import { User } from '../../interface/User';

@Injectable({ providedIn: 'root' })
export class FriendsService {
  private url = apiRoute('friends');

  constructor(
    private store: FriendsStore,
    private http: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  /**
   * Refresh and get new list friends
   */
  get() {
    this.store.setLoading(true);
    this.http.post<User[]>(
      `${this.url}/list`,
      {},
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(response => {
        if (!response) {
          return [] as User[];
        }
        return response;
      }),
      catchError(error => {
        console.log(error);
        return of([] as User[]);
      }),
    ).subscribe(users => {
      this.store.setLoading(false);
      this.store.set(users);
    });
  }
}
