import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Note } from "../shared/interface/Note";
import { catchError, map } from "rxjs/operators";
import { Router } from "@angular/router";
import { of } from "rxjs";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root',
})
export class NoteService {

  private url = "http://localhost:3000/notes";
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

  noteCreate(credentials: {
    noteUserId: string,
    noteTitle: string,
    noteDescription: string,
    notePriority: number,
    noteProjectId: string
  }) {
    return this.http.post<{
      token: string;
      message: string,
      createdNote?: Note,
      error: any
    }>(`${this.url}/create`, credentials, { headers: this.header }).pipe(
      map(result => {
        return !!result.createdNote;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      }),
    );
  }

  getAllNote() {
    return this.http.post<{
      token: string,
      error: any,
      count: number,
      notes: Note[]
    }>(`${this.url}`, {}, { headers: this.header }).pipe(
      map(result => {
        if (result.notes) {
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

  /**
   * Tim thong tin cua note bang ID cua note
   * @param noteId
   */
  readNote(noteId: string) {
    return this.http.post<{
      token: string,
      error: any,
      message: string,
      note: Note
    }>(`${this.url}/view`, { noteId: noteId }, { headers: this.header }).pipe(
      map(result => {
        if (result.note) {
          return result.note;
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

  updateNote(noteId: string, credentials: {
    noteId: string,
    noteTitle: string,
    noteDescription: string,
    notePriority: number,
    noteProjectId: string
  }) {
    return this.http.post<{
      message: string,
      updatedNote?: Note,
      error: any
    }>(`${this.url}/update/${noteId}`,  credentials).pipe(
      map(result => {
        if (result.updatedNote) {
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

  deleteNote(noteId: string) {
    return this.http.post<{
      message: string
    }>(`${this.url}/delete/${noteId}`, {noteId: noteId}).pipe(
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
