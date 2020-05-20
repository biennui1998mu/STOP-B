import { Injectable } from '@angular/core';
import { ProjectsStore } from './projects.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { TokenService } from '../token.service';
import { Project } from '../../interface/Project';
import { Observable, of } from 'rxjs';
import { APIResponse } from '../../interface/API-Response';
import { apiRoute } from '../../api';
import { User } from '../../interface/User';

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private url = apiRoute('projects');

  constructor(
    private store: ProjectsStore,
    private token: TokenService,
    private http: HttpClient,
  ) {
  }

  get() {
    this.store.setLoading(true);
    return this.http.post<APIResponse<Project<User>[]>>(
      `${this.url}`,
      {},
      { headers: this.token.authorizeHeader },
    ).pipe(
      tap(() => {
        this.store.setLoading(false);
      }),
      map(res => res.data),
      catchError(error => {
        console.error(error);
        return of([] as Project<User>[]);
      }),
      tap(projects => {
        this.store.set(projects);
      }),
    );
  }

  /**
   * Get information of the project with provided id.
   * option `setActive` is used when viewing the specified project
   * @param projectId
   * @param setActive
   */
  getOne(
    projectId: string,
    setActive: boolean = false,
  ): Observable<Project<User>> {
    if (setActive) {
      this.store.setLoading(true);
    }

    return this.http.post<APIResponse<Project<User>>>(
      `${this.url}/view`,
      { _id: projectId },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => {
        if (setActive) {
          this.store.setLoading(false);
          this.store.setActive(result.data._id);
        }
        return result.data;
      }),
      catchError(error => {
        console.error(error);
        return of(null);
      }),
    );
  }

  getImportant() {
    return this.http.post<Project[]>(
      `${this.url}/important`,
      {},
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => {
        if (result) {
          return result;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.error(error);
        return [];
      }),
    );
  }

  setActive(project_id: string) {
    this.store.setActive(project_id);
  }

  create(credentials: Partial<Project>): Observable<Project> {
    return this.http.post<APIResponse<Project<User>>>(
      `${this.url}/create`,
      credentials,
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => result.data),
      tap(project => {
        if (project) {
          this.store.add(project);
        }
      }),
      catchError(error => {
        console.error(error);
        return of(null);
      }),
    );
  }

  update(credentials: Partial<Project>) {
    return this.http.post<APIResponse<Project<User>>>(
      `${this.url}/update`,
      credentials,
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => {
        return result.data;
      }),
      catchError(error => {
        console.error(error);
        return of(null);
      }),
      tap(data => {
        if (data) {
          this.store.update(data._id, () => data);
        }
      }),
    );
  }

  delete(projectId: string) {
    return this.http.post<{
      message: string
    }>(
      `${this.url}/delete`,
      { projectId: projectId },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => {
        return !!result.message;
      }),
      catchError(error => {
        console.error(error);
        return of(false);
      }),
    );
  }
}
