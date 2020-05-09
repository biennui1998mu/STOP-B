import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Note } from '../../interface/Note';

export interface NotesState extends EntityState<Note>, ActiveState {
}

const init = {
  active: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'notes', resettable: true, idKey: '_id' })
export class NotesStore extends EntityStore<NotesState> {

  constructor() {
    super(init);
  }

}

