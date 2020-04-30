import { Injectable } from '@angular/core';
import * as jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  constructor() {
  }

  get user() {
    try {
      return this.decodeJwt();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  clearToken() {
    localStorage.removeItem('token');
    localStorage.clear();
  }

  decodeJwt(token?): {
    username: string,
    userId: string,
    name: string,
    iat: number,
    exp: number,
  } {
    const tokenToDecode = token || localStorage.getItem('token');
    return jwtDecode(tokenToDecode);
  }
}
