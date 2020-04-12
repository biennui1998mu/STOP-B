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

  private _friendOnline: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public friendOnline = this._friendOnline.asObservable();

  private _getUserMessage: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public getUserMessage = this._getUserMessage.asObservable();

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

  public getUserOnline() {
    // this không còn là this của services nữa mà là this của function
    const _this = this;
    this.socket.on("User-online", function (Users) {
      if (Users) {
          _this._friendOnline.next(Users);
        }
      }
    )
  }

  public getUserLogOut() {
    this.socket.emit("logout");
  }

  public userSendMessage(message) {
    this.socket.emit("sendMessage", message)
  }

  public getMessage() {
    const _this = this;
    this.socket.on("Server-send-message", function(data) {
      if(data){
        _this._getUserMessage.next(data);
      }
    });
  }

  public onFocus() {
    this.socket.emit("input-inFocus")
  }

  public outFocus() {
    this.socket.emit("input-outFocus")
  }

  public noTiTyping() {
    this.socket.on("isTyping", (noTi) => {
      document.getElementById('noTi-typing').innerHTML +=
        "<p>" + noTi + "</p>"
    });
  }

  public noTiNotTyping() {
    this.socket.on("isNotTyping", () => {
      document.getElementById('noTi-typing').innerHTML +=
        "<p></p>"
    });
  }
}
