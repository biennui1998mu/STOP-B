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
export class GeneralService {

  private url = "http://localhost:3000";
  private header: HttpHeaders;

  constructor(
    private http: HttpClient,
    private router: Router,
    private tokenService: TokenService
  ) {
    this.header = new HttpHeaders({
      "Authorization": "bearer " + this.tokenService.getToken()
    })
  }

  // get isAuthorize(){
  //   return !!this.tokenService.getToken();
  // }

  noteCreate(credentials: {
    noteTitle: string,
    notePara: string,
    notePriority: boolean,
    noteDate: string}) {
    return this.http.post<{
      token: string;
      message: string,
      createdNote? : Note,
      error: any
    }>(`${this.url}/notes/createNote`, credentials, {headers: this.header}).pipe(
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
}
