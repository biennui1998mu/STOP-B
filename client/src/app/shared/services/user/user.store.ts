import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { User } from '../../interface/User';

export function createInitialState(): User {
  return {
    _id: null,
    username: null,
    name: null,
    dob: null,
    status: null,
    avatar: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'user', resettable: true, idKey: '_id' })
export class UserStore extends Store<User> {

  constructor() {
    super(createInitialState());
  }

}

