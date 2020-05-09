import { Injectable } from '@angular/core';
import { Query } from '@datorama/akita';
import { RoomChatStore, RoomChatState } from './roomchat.store';

@Injectable({ providedIn: 'root' })
export class RoomchatQuery extends Query<RoomChatState> {

  constructor(protected store: RoomChatStore) {
    super(store);
  }

}
