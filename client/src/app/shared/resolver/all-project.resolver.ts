import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ProjectsQuery, ProjectsService } from '../services/projects';
import { User } from '../interface/User';
import { Project } from '../interface/Project';

@Injectable({ providedIn: 'root' })
export class AllProjectResolver implements Resolve<Project<User>[]> {
  constructor(
    private service: ProjectsService,
    private query: ProjectsQuery,
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<Project<User>[]> {
    return this.service.get();
  }
}
