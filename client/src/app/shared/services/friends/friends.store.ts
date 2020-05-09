import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { User } from '../../interface/User';

export interface FriendsState extends EntityState<User>, ActiveState {
}

const initState = {
  active: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'friends', resettable: true, idKey: '_id' })
export class FriendsStore extends EntityStore<FriendsState> {

  constructor() {
    super(initState);
  }
}

