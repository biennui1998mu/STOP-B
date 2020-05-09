import { Injectable } from '@angular/core';
import * as jwtDecoder from 'jwt-decode';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  private _token: string = null;

  get token() {
    if (!this._token) {
      this._token = TokenService.getToken();
    }

    return this._token;
  }

  set token(token: string) {
    this._token = token;
    TokenService.setToken(token);
  }

  /**
   * if null => not authorize or token invalid
   */
  get decodedToken(): {
    _id: string,
    username: string,
    name: string;
  } {
    const token = this.token;
    if (!token) {
      return null;
    }

    try {
      return jwtDecoder(token);
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  /**
   * get the header with associated token.
   */
  get authorizeHeader() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.token,
    });
  }

  private static setToken(token: string) {
    localStorage.setItem('token', token);
  }

  private static getToken() {
    return localStorage.getItem('token');
  }

  /**
   * use in logout
   */
  clearToken() {
    localStorage.removeItem('token');
    localStorage.clear();
    this._token = null;
  }
}
