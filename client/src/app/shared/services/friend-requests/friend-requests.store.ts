import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { FriendRequest } from '../../interface/FriendRequest';

export interface FriendRequestsState extends EntityState<FriendRequest> {
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'friend-requests', idKey: '_id', resettable: true })
export class FriendRequestsStore extends EntityStore<FriendRequestsState> {

  constructor() {
    super();
  }

}

