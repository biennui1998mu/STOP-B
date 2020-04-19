import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Project } from "../interface/Project";
import { catchError, map, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private url = "http://localhost:3000/projects";

  private _projects = new BehaviorSubject<Project[]>([]);
  public projects = this._projects.asObservable();

  private _activeProject = new BehaviorSubject<Project>(null);
  public activeProject = this._activeProject.asObservable();

  private _projectsLoading = new BehaviorSubject<boolean>(false);
  public projectsLoading = this._projectsLoading.asObservable();

  private _activeProjectLoading = new BehaviorSubject<boolean>(false);
  public activeProjectLoading = this._activeProjectLoading.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService,
  ) {
  }

  private _projectsLoadingValue = false;

  get projectsLoadingValue() {
    return this._projectsLoadingValue;
  }

  private _activeProjectLoadingValue = false;

  get activeProjectLoadingValue() {
    return this._activeProjectLoadingValue;
  }

  private _projectsValue: Project[] = [];

  get projectsValue() {
    return this._projectsValue;
  }

  private _activeProjectValue: Project = null;

  get activeProjectValue() {
    return this._activeProjectValue;
  }

  get header() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  createProject(credentials: {
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

  refreshProjects() {
    this._projectsLoading.next(true);
    this._projectsLoadingValue = true;
    this.http.post<Project[]>(
      `${this.url}`,
      {},
      { headers: this.header },
    ).pipe(
      tap(() => {
        this._projectsLoading.next(false);
        this._projectsLoadingValue = false;
      }),
      catchError(error => {
        console.log(error);
        return [];
      }),
    ).subscribe(projects => {
      this._projectsValue = projects;
      this._projects.next(projects);
    });
  }

  getProjectHighPriority() {
    return this.http.post<Project[]>(
      `${this.url}/important`,
      {},
      { headers: this.header },
    ).pipe(
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

  viewProject(projectId: string): Observable<Project> {
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

  updateProject(projectId: string, credentials: Partial<Project>) {
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
