import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CommentIssue } from '../interface/CommentIssue';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Task } from '../interface/Task';
import { TokenService } from './token.service';
import { Project } from '../interface/Project';
import { catchError, map } from 'rxjs/operators';
import { APIResponse } from '../interface/API-Response';
import { User } from '../interface/User';

@Injectable({
  providedIn: 'root',
})
export class TaskCommentService {
  private url = "http://localhost:3000/comments";

  private _comments: BehaviorSubject<CommentIssue<Task, User>[]> = new BehaviorSubject([]);
  public comments = this._comments.asObservable();
  private _commentsLoading: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public commentsLoading = this._commentsLoading.asObservable();

  constructor(
    private httpClient: HttpClient,
    private tokenService: TokenService,
  ) {
  }

  private _commentsValue: CommentIssue<Task, User>[] = [];

  get commentsValue() {
    return this._commentsValue;
  };

  get header() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  /**
   * get all comments in a task and push them to state
   * @param task
   * @param project
   */
  refreshAll(task: Task, project: Project) {
    this._commentsLoading.next(true);
    this.httpClient.post<APIResponse<CommentIssue<Task, User>[]>>(
      `${this.url}/all`,
      {
        task, project,
      },
      { headers: this.header },
    ).pipe(
      map(response => {
        this._commentsLoading.next(false);
        return response.data;
      }),
      catchError(error => {
        this._commentsLoading.next(false);
        console.error(error);
        return of([] as CommentIssue<Task, User>[]);
      }),
    ).subscribe(comments => {
      this._comments.next(comments);
      this._commentsValue = comments;
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
  createComment(task: Task, project: Project, content: string): Observable<CommentIssue<Task, User>> {
    return this.httpClient.post<APIResponse<CommentIssue<Task, User>>>(
      `${this.url}/create`,
      {
        task, project, content,
      },
      { headers: this.header },
    ).pipe(
      map(response => {
        if (response.data) {
          /**
           * prevent pass-by-reference
           */
          const current = [...this.commentsValue];
          current.push(response.data);
          this._comments.next(current);
          this._commentsValue = current;
        }
        return response.data;
      }),
      catchError(error => {
        console.error(error);
        return of(null as CommentIssue<Task, User>);
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
  updateComment(
    task: Task,
    project: Project,
    comment: CommentIssue,
  ): Observable<CommentIssue<Task, User>> {
    return this.httpClient.post<APIResponse<CommentIssue<Task, User>>>(
      `${this.url}/update`,
      {
        task,
        project,
        id: comment._id,          // id of the updating comment
        content: comment.content, // content of the updating comment
      },
      { headers: this.header },
    ).pipe(
      map(response => {
        let newComment: CommentIssue<Task, User> = null;
        if (response.data) {
          newComment = response.data;
          /**
           * prevent pass-by-reference
           */
          const current = [...this.commentsValue];
          let isFound = false;
          this.commentsValue.every((comment, index) => {
            if (comment._id === newComment._id) {
              // find in current list and update it
              current[index] = newComment;
              isFound = true;
              return false;
            }
            return true;
          });
          if (!isFound) {
            // if not found then push the updated comment as new.
            // TODO: might need to change behavior, like, refresh the page?
            current.push(newComment);
          }
          this._comments.next(current);
          this._commentsValue = current;
        }
        return newComment;
      }),
      catchError(error => {
        console.error(error);
        return of(null as CommentIssue<Task, User>);
      }),
    );
  }
}
