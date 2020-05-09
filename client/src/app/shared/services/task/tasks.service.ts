import { Injectable } from '@angular/core';
import { TasksStore } from './tasks.store';
import { HttpClient } from '@angular/common/http';
import { apiRoute } from '../../api';
import { TokenService } from '../token.service';
import { APIResponse } from '../../interface/API-Response';
import { Task } from '../../interface/Task';
import { User } from '../../interface/User';
import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Project } from '../../interface/Project';

@Injectable({ providedIn: 'root' })
export class TasksService {

  private url = apiRoute('tasks');

  constructor(
    private store: TasksStore,
    private tokenService: TokenService,
    private http: HttpClient,
  ) {
  }

  /**
   * get all tasks and push it to state
   * @param project
   */
  get(project: Project<User>) {
    this.store.setLoading(true);
    return this.http.post<APIResponse<{
      ongoingCount: number,
      finishedCount: number,
      tasks: Task<User>[]
    }>>(
      `${this.url}`,
      { project },
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(result => {
        this.store.setLoading(false);
        this.store.set(result.data.tasks);
        return result.data;
      }),
      catchError(error => {
        console.log(error);
        this.store.reset();
        return of({
          ongoingCount: 0,
          finishedCount: 0,
          tasks: [],
        });
      }),
    );
  }

  /**
   * get the latest created task of a project
   * @param project
   */
  getLatest(project: Project<any>) {
    return this.http.post<APIResponse<Task>>(
      `${this.url}/latest`,
      { project: project },
      { headers: this.tokenService.authorizeHeader }).pipe(
      catchError(error => {
        console.log(error);
        return of({
          message: 'Error catch!',
          data: null,
        });
      }),
    );
  }

  /**
   * get full information of the task
   * @param indicator
   * @param project
   * @param setActive
   */
  getOne(
    indicator: string,
    project: Project<any>,
    setActive: boolean = true,
  ): Observable<Task<User, Project>> {
    return this.http.post<APIResponse<Task<User, Project>>>(
      `${this.url}/view`,
      {
        indicator: indicator,
        project: project,
      },
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.log(error);
        return of(null as Task<User, Project>);
      }),
      tap(res => {
        if (res && setActive) {
          this.store.setActive(res._id);
        }
      }),
    );
  }

  /**
   * create a new task
   * @param formData
   */
  create(formData: Partial<Task<User, Project<any>>>):
    Observable<APIResponse<Task>> {
    return this.http.post<APIResponse<Task>>(
      `${this.url}/create`,
      formData,
      { headers: this.tokenService.authorizeHeader }).pipe(
      catchError(error => {
        console.log(error);
        return of({
          message: 'Error catch!',
          data: null,
        });
      }),
    );
  }

  update(taskId: string, credentials: Partial<Task>) {
    return this.http.post<{
      message: string,
      updatedTask?: Task,
      error: any
    }>(
      `${this.url}/update`,
      credentials,
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(result => result.updatedTask),
      catchError(error => {
        console.log(error);
        return of(null as Task);
      }),
    );
  }

  delete(taskId: string) {
    return this.http.post<{
      message: string
    }>(
      `${this.url}/delete`,
      { taskId: taskId },
      { headers: this.tokenService.authorizeHeader },
    ).pipe(
      map(result => {
        return !!result.message;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }
}
