import { Injectable } from '@angular/core';
import {Task} from "../shared/interface/Task";
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
    taskPara: string
  }) {
    return this.http.post<{
      message: string,
      createdTask?: Task,
      error: any
    }>(`${this.url}/createTask`, credentials).pipe(
      map(result => {
        if (result.createdTask) {
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

  getTask(taskId: string) {
    return this.http.post<{
      error: any,
      task: Task
    }>(`${this.url}/view`, { taskId: taskId }).pipe(
      map(result => {
        if (result.task) {
          return result.task;
        } else {
          return {};
        }
      }),
      catchError(error => {
        console.log(error);
        return error;
      }),
    );
  }

  taskDelete(taskId: string){
    return this.http.delete<{
      message: string
    }>(`${this.url}/${taskId}`).pipe(
      map( result => {
        return !!result.message;
      }),
      catchError( error => {
        console.log(error);
        return of(false);
      })
    )
  }
}
