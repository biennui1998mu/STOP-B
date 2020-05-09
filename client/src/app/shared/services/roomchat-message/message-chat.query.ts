import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { MessageChatStore, MessageChatState } from './message-chat.store';

@Injectable({ providedIn: 'root' })
export class MessageChatQuery extends QueryEntity<MessageChatState> {

  constructor(protected store: MessageChatStore) {
    super(store);
  }

}
