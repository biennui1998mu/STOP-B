import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { CommentsStore, CommentsState } from './comments.store';

@Injectable({ providedIn: 'root' })
export class CommentsQuery extends QueryEntity<CommentsState> {

  constructor(protected store: CommentsStore) {
    super(store);
  }

}
