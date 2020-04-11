import {Injectable} from '@angular/core';
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

  decodeJwt(token?){
    const tokenToDecode = token || localStorage.getItem('token');
    return jwtDecode(tokenToDecode);
  }
}
