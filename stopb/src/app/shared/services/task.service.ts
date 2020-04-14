import { Injectable } from '@angular/core';
import {Task} from "../interface/Task";
import {catchError, map} from "rxjs/operators";
import {of} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Router} from "@angular/router";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private url = "http://localhost:3000/tasks";
  private header: HttpHeaders;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
  ) {
    this.header = new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  taskCreate(credentials: {
    taskTitle: string,
    taskDescription: string,
    taskPriority: number,
    taskStartDate: string,
    taskEndDate: string,
    taskStatus: boolean,
    taskManager: string,
    projectId : string
  }) {
    return this.http.post<{
      // token: string;
      message: string,
      createdTask?: Task,
      error: any
    }>(`${this.url}/create`, credentials, { headers: this.header}).pipe(
      map(result => {
        return !!result.createdTask;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }

  getAllTask() {
    return this.http.post<{
      token: string,
      error: any,
      count: number,
      tasks: Task[]
    }>(`${this.url}`, { headers: this.header }).pipe(
      map(result => {
        if (result.tasks) {
          return result.tasks;
        } else {
          return [];
        }
      }),
      catchError(error => {
        console.log(error);
        return [];
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
    taskTitle: string,
    taskDescription: string,
    taskPriority: number,
    taskStartDate: string,
    taskEndDate: string,
    taskStatus: boolean,
    taskManager: string,
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
    }>(`${this.url}/delete`, {taskId: taskId}).pipe(
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
