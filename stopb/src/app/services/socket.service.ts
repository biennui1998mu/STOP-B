import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { User } from "../shared/interface/User";
import { environment } from 'src/environments/environment';
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private user: User = null;

  private url = 'http://localhost:3000';
  private socket;

  constructor(
    private tokenService: TokenService
  ) {
  }

  setupSocketConnection() {
    this.socket = io(this.url, {
      query: {
        token: this.tokenService.getToken()
      }
    });
  }

}
