import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  constructor() {
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.clear();
  }

  decodeJwt(){
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    console.log(decoded);
  }
}
