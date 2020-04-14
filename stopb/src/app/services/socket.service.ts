import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {BehaviorSubject, of} from 'rxjs';
import {TokenService} from "./token.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Message } from '../shared/interface/Message';
import {catchError, map} from 'rxjs/operators';
import {Room} from "../shared/interface/Room";

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private url = 'http://localhost:3000/messages';
  private header: HttpHeaders;
  private socket;

  private _friendOnline: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public friendOnline = this._friendOnline.asObservable();

  private _getUserMessage: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public getUserMessage = this._getUserMessage.asObservable();

  constructor(
    private tokenService: TokenService,
    private http: HttpClient
  ) {
    this.header = new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
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

  public userSendMessage(message, credentials: {
    roomId: string,
    message: string,
    from: string,
  }) {
    this.socket.emit("sendMessage", message);
    return this.http.post<Message>(`${this.url}/save`, credentials, { headers: this.header }).pipe(
      map( result => {
        return result;
      }),
      catchError( error => {
        console.log(error);
        return of (false);
      })
    )
  }

  public userJoinRoom(roomName, friendId){
    this.socket.emit("userJoinRoom", roomName);
    const decoded = this.tokenService.decodeJwt();
    const userId = decoded.userId;
    return this.http.post<Room>(`${this.url}/findRoom`, {roomName: roomName, listUser: [userId, friendId]}, { headers: this.header }).pipe(
      map( room => {
        if(room){
          this.socket.on("Joined", room);
          return room;
        }else{
          return this.http.post<Room>(`${this.url}/createRoom`, {roomName: roomName, listUser: [userId, friendId]} , {headers: this.header}).pipe(
            map( result => {
              if(result){
                return result
              }else{
                return false;
              }
            }),
            catchError(error => {
              console.log(error);
              return of(false);
            })
          )
        }
      }),
      catchError( error => {
        console.log(error);
        return of(false);
      })
    )
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
