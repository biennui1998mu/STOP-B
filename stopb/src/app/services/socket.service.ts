import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {BehaviorSubject} from 'rxjs';
import {TokenService} from "./token.service";

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private url = 'http://localhost:3000';
  private socket;

  constructor(
    private tokenService: TokenService
  ) {
  }

  setupSocketConnection() {
    // this.socket = io(this.url, {
    //   query: {
    //     token: this.tokenService.getToken()
    //   }
    // });
  }
}
