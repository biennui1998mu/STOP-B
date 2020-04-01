import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Note} from "../shared/interface/Note";
import {catchError, map} from "rxjs/operators";
import {Router} from "@angular/router";
import {of} from "rxjs";
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  private url = "http://localhost:3000/notes";
  private header: HttpHeaders;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.header = new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken()
    })
  }

  noteCreate(credentials: {
    noteTitle: string,
    notePara: string,
    notePriority: boolean,
    noteDate: string
  }) {
    return this.http.post<{
      token: string;
      message: string,
      createdNote? : Note,
      error: any
    }>(`${this.url}/createNote`, credentials, {headers: this.header}).pipe(
      map( result => {
        if(result.createdNote && result.token){
          this.tokenService.setToken(result.token);
          // this.router.navigateByUrl('/dashboard');
          return true;
        }else{
          return false;
        }
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      })
    )
  }

  getNote(){
    return this.http.get<{
      token: string,
      error: any,
      count: number,
      notes: Note[]
    }>(`${this.url}`, {headers: this.header}).pipe(
      map( result => {
        if(result.notes){
          return result;
        }else{
          return [];
        }
      }),
      catchError( error => {
        console.log(error);
        return [];
      })
    );
  }

  /**
   * Tim thong tin cua note bang ID cua note
   * @param noteId
   */
  readNote(noteId: string){
    return this.http.post<{
      token: string,
      error: any,
      note: Note
    }>(`${this.url}/view`, {noteId: noteId}, {headers: this.header}).pipe(
      map( result => {
        if(result.note){
          return result.note
        }else {
          return {}
        }
      }),
      catchError( error => {
        console.log(error);
        return error;
      })
    )
  }

  updateNote(noteId: string, credentials: {
    noteTitle: string,
    notePara: string,
    notePriority: boolean,
    noteDate: string}) {
    return this.http.patch<{
      token: string;
      message: string,
      updatenote? : Note,
      error: any
    }>(`${this.url}/${noteId}`, credentials,  {headers: this.header}).pipe(
      map( result => {
        if(result.updatenote){
          return true;
        }else{
          return false;
        }
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      })
    )
  }
}
