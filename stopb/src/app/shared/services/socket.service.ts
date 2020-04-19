import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { TokenService } from "./token.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Message } from '../interface/Message';
import { catchError, map } from 'rxjs/operators';
import { Room } from "../interface/Room";
import { User } from '../interface/User';
import { APIResponse } from '../interface/API-Response';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private url = 'http://localhost:3000/messages';
  private socket: SocketIOClient.Socket;

  private _friendOnline: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public friendOnline = this._friendOnline.asObservable();

  private _friendOffline: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public friendOffline = this._friendOffline.asObservable();

  private _getUserMessage: Subject<Message> = new Subject();
  public getUserMessage = this._getUserMessage.asObservable();

  private _roomChat: BehaviorSubject<Room> = new BehaviorSubject<Room>(null);
  public roomChat = this._roomChat.asObservable();

  constructor(
    private tokenService: TokenService,
    private http: HttpClient,
  ) {

    this.socket = io('http://localhost:3000', {
      query: {
        token: this.tokenService.getToken(),
      },
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

    // listen room event
    this.userJoinedRoom();

    // Lấy user có trong mảng User/ = online
    this.getUserLogOut();
  }

  /**
   * create/join a room chat with a selected user id
   * @param friendsId
   */
  public getRoomChat(friendsId: string[]): Observable<Room<User>> {
    return this.http.post<APIResponse<Room>>(
      `${this.url}/room/get`,
      { listUser: [...friendsId, this.tokenService.user.userId] },
      { headers: this.header },
    ).pipe(
      map(result => {
        if (result.data) {
          this.socket.emit("user-join-room-chat", result.data);
          return result.data;
        }
        return null;
      }),
      catchError(error => {
        console.log(error);
        return of(null);
      }),
    );
  }

  sendChatMessage(message: string, roomId: string): Observable<Message> {
    return this.http.post<Message>(`${this.url}/save`, {
      message: message,
      roomId: roomId,
    }, { headers: this.header }).pipe(
      map(result => {
        this.socket.emit("send-Message-toServer", result);
        return result;
      }),
      catchError(error => {
        console.log(error);
        return of(null);
      }),
    );
  }

  /**
   * TODO: performance hit when too many message
   * @param roomId
   */
  getMessages(roomId): Observable<{
    count: number,
    messages: Message[]
  }> {
    return this.http.post<{
      count: number,
      messages: Message[]
    }>(`${this.url}`, { roomId: roomId }, { headers: this.header }).pipe(
      map(result => {
        if (result) {
          return result;
        } else {
          return {
            count: 0,
            messages: [] as Message[],
          };
        }
      }),
      catchError(error => {
        console.log(error);
        return of({
          count: 0,
          messages: [] as Message[],
        });
      }),
    );
  }

  public getUserLogOut() {
    const _this = this;
    this.socket.on("Offline", result => {
      _this._friendOffline.next(result);
      return result;
    });
  }

  private userJoinedRoom() {
    const _ = this;
    this.socket.on("Joined", function (room: Room) {
      _._roomChat.next(room);
    });
  }

  private getUserOnline() {
    // this không còn là this của services nữa mà là this của function
    const _this = this;
    this.socket.on("User-online", function (Users) {
        if (Users) {
          _this._friendOnline.next(Users);
        }
      },
    );
  }

  private listenNewMessage() {
    const _this = this;
    this.socket.on("Server-send-message", function (data) {
      _this._getUserMessage.next(data);
    });
  }

}
