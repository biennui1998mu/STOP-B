import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { FriendsStore, FriendsState } from './friends.store';

@Injectable({ providedIn: 'root' })
export class FriendsQuery extends QueryEntity<FriendsState> {

  constructor(protected store: FriendsStore) {
    super(store);
  }

}
