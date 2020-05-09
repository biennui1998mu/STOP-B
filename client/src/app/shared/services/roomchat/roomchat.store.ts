import { Injectable } from '@angular/core';
import { Store, StoreConfig } from '@datorama/akita';
import { Room } from '../../interface/Room';
import { User } from '../../interface/User';

export interface RoomChatState extends Room<User> {
}

export function createInitialState(): Room<User> {
  return {
    _id: null,
    listUser: [],
    createdAt: null,
  };
}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'roomchat', resettable: true, idKey: '_id' })
export class RoomChatStore extends Store<RoomChatState> {

  constructor() {
    super(createInitialState());
  }

}

