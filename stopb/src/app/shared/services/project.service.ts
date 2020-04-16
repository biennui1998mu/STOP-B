import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Project } from "../interface/Project";
import { catchError, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { Observable, of } from "rxjs";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private url = "http://localhost:3000/projects";

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

  projectCreate(credentials: {
    Title: string,
    Description: string,
    Priority: number,
    StartDate: string,
    EndDate: string,
    Status: boolean,
    Manager: string,
    Moderator: string,
    Member: string
  }) {
    return this.http.post<{
      // token: string;
      message: string,
      createdProject?: Project,
      error: any
    }>(`${this.url}/create`, credentials, { headers: this.header }).pipe(
      map(result => {
        return !!result.createdProject;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }

  getAllProject() {
    return this.http.post<Project[]>(`${this.url}`, {}, { headers: this.header }).pipe(
      map(result => {
        if (result) {
          return result;
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

  getProjectHighPriority() {
    return this.http.post<Project[]>(`${this.url}/important`, {}, { headers: this.header }).pipe(
      map(result => {
        if (result) {
          return result;
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

  readProject(projectId: string): Observable<Project> {
    return this.http.post<{
      token: string,
      error: any,
      project: Project,
    }>(`${this.url}/view`, { projectId: projectId }, { headers: this.header })
      .pipe(
        map(result => {
          if (result && result.project) {
            return result.project;
          }
          return null;
        }),
        catchError(error => {
          console.log(error);
          return of(null);
        }),
      );
  }

  updateProject(projectId: string, credentials: {
    projectId: string,
    Title: string,
    Description: string,
    Priority: number,
    StartDate: string,
    EndDate: string,
    Status: boolean,
    Manager: string,
    Moderator: string,
    Member: string
  }) {
    return this.http.post<{
      message: string,
      updatedProject?: Project,
      error: any
    }>(`${this.url}/update`, credentials).pipe(
      map(result => {
        return !!result.updatedProject;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }

  deleteProject(projectId: string) {
    return this.http.post<{
      message: string
    }>(`${this.url}/delete`, { projectId: projectId }).pipe(
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
