import { Injectable } from '@angular/core';
import { Task } from "../interface/Task";
import { catchError, map } from "rxjs/operators";
import { BehaviorSubject, Observable, of } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Router } from "@angular/router";
import { TokenService } from "./token.service";
import { User } from '../interface/User';
import { Project } from '../interface/Project';
import { APIResponse } from '../interface/API-Response';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private url = "http://localhost:3000/tasks";

  private _tasks = new BehaviorSubject<Task<User>[]>([]);
  public tasks = this._tasks.asObservable();

  private _tasksLoading = new BehaviorSubject<boolean>(false);
  public tasksLoading = this._tasksLoading.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
  ) {
  }

  get header() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  private _tasksLoadingValue: boolean = false;

  get tasksLoadingValue() {
    return this._tasksLoadingValue;
  }

  private _tasksValue: Task<User, Project>[] = [];

  get tasksValue() {
    return this._tasksValue;
  }

  /**
   * get all tasks and push it to state
   * @param project
   */
  refreshTasks(project: Project<User>) {
    this._tasksLoading.next(true);
    this._tasksLoadingValue = true;

    return this.http.post<APIResponse<{
      ongoingCount: number,
      finishedCount: number,
      tasks: Task<User>[]
    }>>(
      `${this.url}`,
      { project },
      { headers: this.header },
    ).pipe(
      map(result => {
        this._tasksLoading.next(false);
        this._tasksLoadingValue = false;
        this._tasks.next(result.data.tasks);
        return result.data;
      }),
      catchError(error => {
        console.log(error);
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
  getLatestTask(project: Project<any>) {
    return this.http.post<APIResponse<Task>>(
      `${this.url}/latest`,
      { project: project },
      { headers: this.header }).pipe(
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
   * create a new task
   * @param formData
   */
  createTask(formData: Partial<Task<User, Project<any>>>):
    Observable<APIResponse<Task>> {
    return this.http.post<APIResponse<Task>>(
      `${this.url}/create`,
      formData,
      { headers: this.header }).pipe(
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
   */
  viewTask(indicator: string, project: Project<any>): Observable<Task<User, Project>> {
    return this.http.post<APIResponse<Task<User, Project>>>(
      `${this.url}/view`,
      {
        indicator: indicator,
        project: project,
      },
      { headers: this.header },
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.log(error);
        return of(null);
      }),
    );
  }

  updateTask(taskId: string, credentials: {
    taskId: string,
    Title: string,
    Description: string,
    Priority: number,
    StartDate: string,
    EndDate: string,
    Status: boolean,
    Manager: string,
    projectId: string
  }) {
    return this.http.post<{
      message: string,
      updatedTask?: Task,
      error: any
    }>(`${this.url}/update`, credentials).pipe(
      map(result => {
        if (result.updatedTask) {
          return true;
        } else {
          return false;
        }
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }

  DeleteTask(taskId: string) {
    return this.http.post<{
      message: string
    }>(`${this.url}/delete`, { taskId: taskId }).pipe(
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
