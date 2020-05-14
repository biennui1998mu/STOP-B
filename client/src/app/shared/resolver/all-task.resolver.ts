import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Task } from '../interface/Task';
import { TasksQuery, TasksService } from '../services/task';
import { Observable, of } from 'rxjs';
import { ProjectsQuery, ProjectsService } from '../services/projects';
import { User } from '../interface/User';

@Injectable({ providedIn: 'root' })
export class AllTaskResolver implements Resolve<Task<User>[]> {
  constructor(
    private service: TasksService,
    private query: TasksQuery,
    private projectsQuery: ProjectsQuery,
    private projectsService: ProjectsService,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<Task<User>[]> {
    if (this.projectsQuery.getAll().length > 0) {
      let projectId = this.projectsQuery.getActive()?._id;
      if (!projectId) {
        const currentId = route.paramMap.get('id');
        if (!currentId) {
          return of([]);
        }
        const project = this.projectsQuery.getEntity(currentId);
        if (!project) {
          return of([]);
        }
        this.projectsService.setActive(currentId);
        projectId = currentId;
      }
      return this.service.get(
        projectId,
      );
    }
    return of([] as Task<User>[]);
  }
}
