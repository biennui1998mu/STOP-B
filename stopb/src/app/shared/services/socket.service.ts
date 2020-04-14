import {Injectable} from '@angular/core';
import * as io from 'socket.io-client';
import {BehaviorSubject, of} from 'rxjs';
import {TokenService} from "./token.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Message} from '../interface/Message';
import {catchError, map} from 'rxjs/operators';
import {Room} from "../interface/Room";

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private url = 'http://localhost:3000/messages';
  private socket: SocketIOClient.Socket;

  private _friendOnline: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public friendOnline = this._friendOnline.asObservable();

  private _getUserMessage: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public getUserMessage = this._getUserMessage.asObservable();

  private _getRoomChat: BehaviorSubject<Room> = new BehaviorSubject<Room>(null);
  public getRoomChat = this._getRoomChat.asObservable();

  constructor(
    private tokenService: TokenService,
    private http: HttpClient
  ) {

    this.socket = io('http://localhost:3000', {
      query: {
        token: this.tokenService.getToken()
      }
    });
  }

  get header() {
    return new HttpHeaders({
      "Authorization": "Bearer " + this.tokenService.getToken(),
    });
  }

  // Setup listener cho cac socket event.
  setupSocketConnection() {
    // Lấy messages
    this.listenNewMessage();

    // listen room event TODO: today job
    this.userJoinedRoom();

    // NoTi typing
    this.noTiTyping();

    // NoTi not typing
    this.noTiNotTyping();

    // Lấy user có trong mảng User/ = online
    this.getUserOnline();
  }

  /**
   * create/join a room chat with a selected user id
   * @param roomName
   * @param friendsId
   */
  public userJoinRoom(roomName, ...friendsId: string[]) {
    return this.http.post<{ room: Room, message: string }>(
      `${this.url}/room/get`,
      {roomName: roomName, listUser: friendsId},
      {headers: this.header}
    ).pipe(
      map(result => {
        if (result.room) {
          this.socket.emit("userJoinRoom", result.room);
          return result.room;
        }
        return false;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      })
    )
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

  private userJoinedRoom() {
    const _ = this;
    this.socket.on("Joined", function (room: Room) {
      _._getRoomChat.next(room);
    })
  }

  private listenNewMessage() {
    const _this = this;
    this.socket.on("Server-send-message", function (data) {
      if (data) {
        _this._getUserMessage.next(data);
      }
    });
  }

  private getUserOnline() {
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

  private userSendMessage(message, credentials: {
    roomId: string,
    message: string,
    from: string,
  }) {
    this.socket.emit("sendMessage", message);
    return this.http.post<Message>(`${this.url}/save`, credentials, {headers: this.header}).pipe(
      map(result => {
        return result;
      }),
      catchError(error => {
        console.log(error);
        return of(false);
      })
    )
  }
}
