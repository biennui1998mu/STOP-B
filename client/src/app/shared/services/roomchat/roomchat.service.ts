import { Injectable } from '@angular/core';
import { RoomChatStore } from './roomchat.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { TokenService } from '../token.service';
import { SOCKET_REQUEST_EVENT, SocketService } from '../socket.service';
import { of } from 'rxjs';
import { Room } from '../../interface/Room';
import { User } from '../../interface/User';
import { APIResponse } from '../../interface/API-Response';
import { apiRoute } from '../../api';
import { UserQuery } from '../user';

@Injectable({ providedIn: 'root' })
export class RoomChatService {

  private url = apiRoute('messages');

  constructor(
    private store: RoomChatStore,
    private token: TokenService,
    private socketService: SocketService,
    private userQuery: UserQuery,
    private http: HttpClient,
  ) {
    this.socketService.roomChat.subscribe(room => {
      if (room) {
        this.store.update(room);
      } else {
        this.store.reset();
      }
    });
  }

  /**
   * create/join a room chat with a selected user id
   * @param friendsId
   * @param userId
   * @param socketNotice
   */
  get(
    friendsId: string[],
    userId: string = this.userQuery.getValue()._id,
    socketNotice: boolean = true,
  ) {
    this.store.setLoading(true);
    this.http.post<APIResponse<Room<User>>>(
      `${this.url}/room/get`,
      { listUser: [...friendsId, userId] },
      { headers: this.token.authorizeHeader },
    ).pipe(
      map(result => {
        if (result.data && socketNotice) {
          this.socketService.socketEmit(
            SOCKET_REQUEST_EVENT.joinRoomChat,
            result.data,
          );
        }
        return result.data;
      }),
      catchError(error => {
        console.log(error);
        return of(null as Room<User>);
      }),
    ).subscribe(roomChat => {
      this.store.setLoading(false);
      if (!roomChat) {
        this.store.reset();
      }
    });
  }

  clearRoom() {
    this.store.reset();
  }
}
