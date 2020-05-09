import { Injectable } from '@angular/core';
import { CommentsStore } from './comments.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { apiRoute } from '../../api';
import { TokenService } from '../token.service';
import { APIResponse } from '../../interface/API-Response';
import { CommentIssue } from '../../interface/CommentIssue';
import { Task } from '../../interface/Task';
import { User } from '../../interface/User';
import { Observable, of } from 'rxjs';
import { Project } from '../../interface/Project';
import { TasksQuery } from '../task';
import { ProjectsQuery } from '../projects';

@Injectable({ providedIn: 'root' })
export class CommentsService {

  private url = apiRoute('comments');

  constructor(
    private store: CommentsStore,
    private token: TokenService,
    private tasksQuery: TasksQuery,
    private projectsQuery: ProjectsQuery,
    private http: HttpClient,
  ) {
  }

  /**
   * get all comments in a task and push them to state
   * @param task
   * @param project
   */
  get(task: Task, project: Project) {
    this.store.setLoading(true);
    this.http.post<APIResponse<CommentIssue<Task, User>[]>>(
      `${this.url}/all`,
      {
        task, project,
      },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(error);
        return of([] as CommentIssue<Task, User>[]);
      }),
    ).subscribe(comments => {
      this.store.setLoading(false);
      this.store.set(comments);
    });
  }

  /**
   * create a new comment in a task. The function will also push the new comment to
   * the active list state; while also return the new comment.
   * @param task
   * @param project
   * @param content
   * @return new comment
   */
  create(
    task: Task,
    project: Project,
    content: string,
  ): Observable<CommentIssue<Task, User>> {
    return this.http.post<APIResponse<CommentIssue<Task, User>>>(
      `${this.url}/create`,
      {
        task, project, content,
      },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(error);
        return of(null as CommentIssue<Task, User>);
      }),
      tap(resolve => {
        if (resolve) {
          this.store.add(resolve);
        }
      }),
    );
  }

  /**
   * Update a comment
   * @param task
   * @param project
   * @param comment
   * @return CommentIssue updated comment
   */
  update(
    task: Task,
    project: Project,
    comment: CommentIssue,
  ): Observable<CommentIssue<Task, User>> {
    return this.http.post<APIResponse<CommentIssue<Task, User>>>(
      `${this.url}/update`,
      {
        task,
        project,
        id: comment._id,          // id of the updating comment
        content: comment.content, // content of the updating comment
      },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(response => response.data),
      catchError(error => {
        console.error(error);
        return of(null as CommentIssue<Task, User>);
      }),
      tap(comment => {
        if (comment) {
          // update the comment in the storage
          this.store.update(
            comment._id, // ID to update
            () => comment, // new data
          );
        }
      }),
    );
  }
}
