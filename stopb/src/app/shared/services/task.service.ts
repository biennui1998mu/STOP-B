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

  private _activeTask = new BehaviorSubject<Task<User, Project>>(null);
  public activeTask = this._activeTask.asObservable();

  private _activeTaskLoading = new BehaviorSubject<boolean>(false);
  public activeTaskLoading = this._activeTaskLoading.asObservable();

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

  readTask(taskId: string) {
    return this.http.post<{
      token: string,
      error: any,
      task: Task
    }>(`${this.url}/view`, { taskId: taskId }, { headers: this.header }).pipe(
      map(result => {
        if (result.task) {
          return result.task;
        }
        return {};
      }),
      catchError(error => {
        console.log(error);
        return error;
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
