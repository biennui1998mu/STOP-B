import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { BehaviorSubject, Subject } from 'rxjs';
import { TokenService } from "./token.service";
import { Message } from '../interface/Message';
import { Room } from "../interface/Room";
import { apiRoute, host } from '../api';
import { User } from '../interface/User';

@Injectable({
  providedIn: 'root',
})
export class SocketService {

  private readonly url = apiRoute('messages');
  private readonly _socket: SocketIOClient.Socket;

  private _friendOnline: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public friendOnline = this._friendOnline.asObservable();

  private _friendOffline: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public friendOffline = this._friendOffline.asObservable();

  private _getUserMessage: Subject<Message> = new Subject();
  public getUserMessage = this._getUserMessage.asObservable();

  private _roomChat: BehaviorSubject<Room<User>> = new BehaviorSubject(null);
  public roomChat = this._roomChat.asObservable();

  constructor(private tokenService: TokenService) {
    this._socket = io(host, {
      query: {
        token: this.tokenService.token,
      },
    });
  }

  get socket() {
    return this._socket;
  }

  public socketEmit<T>(event: SOCKET_REQUEST_EVENT, data: T) {
    this.socket.emit(event, data);
  }

  // Setup listener cho cac socket event.
  setupSocketConnection() {
    // Lấy messages
    this.listenNewMessage();

    // listen room event
    this.listenRoomChat();

    // Lấy user có trong mảng User/ = online
    this.listenUserOffline();

    // Lấy user có trong mảng User/ = offline
    this.listenUserOnline();
  }

  public listenUserOffline() {
    const _this = this;
    this.socket.on(SOCKET_RESPONSE_EVENT.userOffline, result => {
      _this._friendOffline.next(result);
      return result;
    });
  }

  private listenRoomChat() {
    // this không còn là this của services nữa mà là this của function
    const _ = this;
    this.socket.on(SOCKET_RESPONSE_EVENT.joinRoomChat, function (room: Room<User>) {
      _._roomChat.next(room);
    });
  }

  private listenUserOnline() {
    // this không còn là this của services nữa mà là this của function
    const _ = this;
    this.socket.on(SOCKET_RESPONSE_EVENT.userOnline, function (Users) {
        if (Users) {
          _._friendOnline.next(Users);
        }
      },
    );
  }

  private listenNewMessage() {
    // this không còn là this của services nữa mà là this của function
    const _ = this;
    this.socket.on(SOCKET_RESPONSE_EVENT.receiveMessage, function (data) {
      _._getUserMessage.next(data);
    });
  }

}

export enum SOCKET_REQUEST_EVENT {
  sendMessage = 'send-Message-toServer',
  joinRoomChat = 'user-join-room-chat',
}

export enum SOCKET_RESPONSE_EVENT {
  receiveMessage = 'Server-send-message',
  joinRoomChat = 'Joined-room',
  userOnline = 'User-online',
  userOffline = 'User-offline',
}
