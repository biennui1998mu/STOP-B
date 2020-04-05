import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
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
    this.socket = io(this.url, {
      query: {
        token: this.tokenService.getToken()
      }
    });
  }

  public getUserOnline(){
    this.socket.on("User-online", function (Users) {
      Users.forEach(function (i) {
        document.getElementById('listFriend')
          .innerHTML +=
          "<p>" + i + "</p>"
      })
      }
    )
  }

  public getUserLogOut(){
    this.socket.emit("logout");
  }

  public userSendMessage(message){
    this.socket.emit("sendMessage", message)
  }

  public getMessage(){
      this.socket.on("Server-send-message", (data) => {
        document.getElementById('chat-box').innerHTML +=
          "<p>" + data.username + ": " + data.message + "</p>"
      });
  }

  public onFocus(){
    this.socket.emit("input-inFocus")
  }
  public outFocus(){
    this.socket.emit("input-outFocus")
  }

  public noTiTyping(){
    this.socket.on("isTyping", (noTi) => {
      document.getElementById('noTi-typing').innerHTML +=
        "<p>" + noTi + "</p>"
    });
  }
  public noTiNotTyping(){
    this.socket.on("isNotTyping", () => {
      document.getElementById('noTi-typing').innerHTML +=
        "<p></p>"
    });
  }
}
