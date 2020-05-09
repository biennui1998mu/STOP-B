import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FriendRequestsStore, FriendRequestsState } from './friend-requests.store';

@Injectable({ providedIn: 'root' })
export class FriendRequestsQuery extends QueryEntity<FriendRequestsState> {

  constructor(protected store: FriendRequestsStore) {
    super(store);
  }

}
