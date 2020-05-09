import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Task } from '../../interface/Task';
import { User } from '../../interface/User';

export interface TasksState extends EntityState<Task<User, any>>, ActiveState {
}

const init = {
  active: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'tasks', resettable: true, idKey: '_id' })
export class TasksStore extends EntityStore<TasksState> {

  constructor() {
    super(init);
  }

}

