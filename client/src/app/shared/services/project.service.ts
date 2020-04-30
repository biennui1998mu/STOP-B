import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Project } from "../interface/Project";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { BehaviorSubject, Observable, of } from "rxjs";
import { TokenService } from "./token.service";
import { APIResponse } from '../interface/API-Response';
import { User } from '../interface/User';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {

  private url = "http://localhost:3000/projects";

  private _projects = new BehaviorSubject<Project[]>([]);
  public projects = this._projects.asObservable();

  private _activeProject = new BehaviorSubject<Project<User>>(null);
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

  private _activeProjectValue: Project<User> = null;

  get activeProjectValue() {
    return this._activeProjectValue;
  }

  get header() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  /**
   * create a new project, then return that new created project
   * for angular to add to active list
   * @param credentials
   */
  createProject(credentials: Partial<Project>): Observable<Project> {
    return this.http.post<APIResponse<Project>>(
      `${this.url}/create`,
      credentials,
      { headers: this.header },
    ).pipe(
      map(result => {
        return result.data;
      }),
      catchError(error => {
        console.error(error);
        return of(null);
      }),
    );
  }

  refreshProjects() {
    this._projectsLoading.next(true);
    this._projectsLoadingValue = true;
    this.http.post<APIResponse<Project[]>>(
      `${this.url}`,
      {},
      { headers: this.header },
    ).pipe(
      tap(() => {
        this._projectsLoading.next(false);
        this._projectsLoadingValue = false;
      }),
      map(res => res.data),
      catchError(error => {
        console.error(error);
        return of([] as Project[]);
      }),
    ).subscribe(projects => {
      this._projectsValue = projects;
      this._projects.next(projects);
    });
  }

  /**
   * Get information of the project with provided id.
   * option `setActive` is used when viewing the specified project
   * @param projectId
   * @param setActive
   */
  viewProject(
    projectId: string,
    setActive: boolean = false,
  ): Observable<Project<User>> {
    if (setActive) {
      this._activeProjectLoadingValue = true;
      this._activeProjectLoading.next(true);
    }

    return this.http.post<APIResponse<Project<User>>>(
      `${this.url}/view`,
      { _id: projectId },
      { headers: this.header },
    ).pipe(
      map(result => {
        if (setActive) {
          this._activeProjectLoadingValue = false;
          this._activeProjectLoading.next(false);
          this._activeProject.next(result.data);
          this._activeProjectValue = result.data;
        }
        return result.data;
      }),
      catchError(error => {
        console.error(error);
        return of(null);
      }),
    );
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
        console.error(error);
        return [];
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
        console.error(error);
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
        console.error(error);
        return of(false);
      }),
    );
  }

}
