import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { UserStore } from './user.store';
import { User } from '../../interface/User';

@Injectable({ providedIn: 'root' })
export class UserQuery extends Query<User> {

  constructor(protected store: UserStore) {
    super(store);
  }

}
