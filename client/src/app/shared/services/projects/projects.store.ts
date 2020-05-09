import { Injectable } from '@angular/core';
import { ActiveState, EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Project } from '../../interface/Project';
import { User } from '../../interface/User';

export interface ProjectsState extends EntityState<Project<User>>, ActiveState {
}

const init = {
  active: null,
};

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'projects', resettable: true, idKey: '_id' })
export class ProjectsStore extends EntityStore<ProjectsState> {

  constructor() {
    super(init);
  }

}

