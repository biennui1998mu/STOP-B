import { Injectable } from '@angular/core';
import { MessageChatStore } from './message-chat.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from '../token.service';
import { Message } from '../../interface/Message';
import { of } from 'rxjs';
import { apiRoute } from '../../api';
import { SOCKET_REQUEST_EVENT, SocketService } from '../socket.service';
import {APIResponse} from "../../interface/API-Response";

@Injectable({ providedIn: 'root' })
export class MessageChatService {
  private readonly url = apiRoute('messages');

  constructor(
    private store: MessageChatStore,
    private token: TokenService,
    private socketService: SocketService,
    private http: HttpClient,
  ) {
    this.socketService.getUserMessage.subscribe(message => {
      if (message) {
        this.store.add(message);
      }
    });
  }

  get(roomId: string) {
    this.store.setLoading(true);
    this.http.post<APIResponse<Message[]>>(
      `${this.url}`,
      { roomId: roomId },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => {
        if (result) {
          return result.data;
        } else {
          return [] as Message[];
        }
      }),
      catchError(error => {
        console.log(error);
        return of([] as Message[]);
      }),
    ).subscribe(info => {
      this.store.setLoading(false);
      this.store.set(info);
    });
  }

  /**
   * send the message
   */
  send(message: string, roomId: string) {
    if (!roomId) {
      console.log('room_id missing');
      return;
    }

    this.store.setLoading(true);
    this.http.post<APIResponse<Message>>(
      `${this.url}/save`,
      {
        message: message,
        roomId: roomId,
      },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => {
        if (result) {
          this.socketService.socketEmit(
            SOCKET_REQUEST_EVENT.sendMessage,
            result.data,
          );
        }
        return result.data;
      }),
      catchError(error => {
        console.log(error);
        return of(null as Message);
      }),
    ).subscribe(message => {
      this.store.setLoading(false);
      if (message) {
        this.store.add(message);
      }
    });
  }
}
