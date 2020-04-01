import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Plan} from "../shared/interface/Plan";
import {catchError, map} from "rxjs/operators";
import {Router} from "@angular/router";
import {of} from "rxjs";
import {TokenService} from "./token.service";
import { Task } from '../shared/interface/Task';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  private url = "http://localhost:3000/plans";
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

  planCreate(credentials: {
    planTitle: string,
    planPriority: boolean,
    planDate: string,
    planMember: []
  }) {
    return this.http.post<{
      token: string;
      message: string,
      createdplan? : Plan,
      error: any
    }>(`${this.url}/createPlan`, credentials, {headers: this.header}).pipe(
      map(result => {
        if(result.createdplan && result.token){
          this.tokenService.setToken(result.token);
          return true;
        }else{
          return false;
        }
      }),
      catchError( error => {
        console.log(error);
        return of(false);
      })
    )
  }

  getPlan(){
    return this.http.get<{
      token: string,
      error: any,
      count: number,
      plans: Plan[]
    }>(`${this.url}`, {headers: this.header}).pipe(
      map( result => {
        if(result.plans){
          return result;
        }else{
          return [];
        }
      }),
      catchError( error => {
        console.log(error);
        return [];
      })
    )
  }

  readPlan(planId: string){
    return this.http.post<{
      token: string,
      error: any,
      plan: Plan
    }>(`${this.url}/view`, {planId: planId}, {headers: this.header}).pipe(
      map( result => {
        if(result.plan){
          return result.plan;
        }
        return {}
      }),
      catchError( error => {
        console.log(error);
        return error;
      })
    )
  }
}
