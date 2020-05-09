import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Message } from '../../interface/Message';

export interface MessageChatState extends EntityState<Message> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'message-chat', resettable: true, idKey: '_id' })
export class MessageChatStore extends EntityStore<MessageChatState> {

  constructor() {
    super();
  }

}

