import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import {User} from "../shared/interface/User";

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private user: User = null;

  private url = 'http://localhost:3000';
  private socket;

  constructor() {
    this.socket = io(this.url);
  }


  public sendMessage(message) {
    this.socket.emit('send-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('receive-message', function(message) {
        observer.next(message);
      });
    });
  }

}
