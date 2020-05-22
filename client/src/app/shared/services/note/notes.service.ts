import { Injectable } from '@angular/core';
import { NotesStore } from './notes.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { apiRoute } from '../../api';
import { Note } from '../../interface/Note';
import { of } from 'rxjs';
import { TokenService } from '../token.service';
import { APIResponse } from '../../interface/API-Response';
import { UserQuery } from '../user';
import { Project } from '../../interface/Project';
import {User} from "../../interface/User";

@Injectable({ providedIn: 'root' })
export class NotesService {
  private readonly url = apiRoute('notes');

  constructor(
    private store: NotesStore,
    private token: TokenService,
    private http: HttpClient,
    private userQuery: UserQuery,
  ) {
  }

  get() {
    this.store.setLoading(true);
    this.http.post<APIResponse<Note<Project, User>[]>>(
      `${this.url}`,
      {},
      { headers: this.token.authorizeHeader })
      .pipe(
        map(result => result.data),
        catchError(error => {
          console.error(error);
          return of([] as Note[]);
        }),
      ).subscribe((notes: Note[]) => {
      this.store.setLoading(false);
      this.store.set(notes);
    });
  }

  getOne(noteId: string) {
    return this.http.post<APIResponse<Note>>(
      `${this.url}/view`,
      { noteId: noteId },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => result.data),
      catchError(error => {
        console.log(error);
        return of(null as Note);
      }),
      tap(note => {
        this.store.setActive(note._id);
      }),
    );
  }

  create(credentials: Note) {
    return this.http.post<APIResponse<Note<string>>>(
      `${this.url}/create`,
      credentials,
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => result.data),
      catchError(error => {
        console.log(error);
        return of(null as Note<string>);
      }),
      tap(note => {
        if (note) {
          this.store.add(note);
        }
      }),
    );
  }

  update(id: string, credentials: Partial<Note>) {
    return this.http.post<APIResponse<Note<Project>>>(
      `${this.url}/update/${id}`,
      credentials,
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => result.data),
      catchError(error => {
        console.log(error);
        return of(null as Note<Project>);
      }),
      tap(note => {
        if (note) {
          this.store.update(note._id, () => note);
        }
      }),
    );
  }

  delete(noteId: string) {
    return this.http.post<APIResponse>(
      `${this.url}/delete/${noteId}`,
      { noteId: noteId },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => result.message),
      catchError(error => {
        console.log(error);
        return of(null as string);
      }),
      tap(message => {
        if (message) {
          this.store.remove(noteId);
        }
      }),
    );
  }
}
