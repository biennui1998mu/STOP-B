import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { CommentIssue } from '../../interface/CommentIssue';
import { Task } from '../../interface/Task';
import { User } from '../../interface/User';

export interface CommentsState extends EntityState<CommentIssue<Task, User>>, ActiveState {
}

const init = {
  active: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'comments', idKey: '_id', resettable: true })
export class CommentsStore extends EntityStore<CommentsState> {

  constructor() {
    super(init);
  }

}

