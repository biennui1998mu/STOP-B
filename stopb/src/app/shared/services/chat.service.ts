import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../interface/Message';
import { Room } from '../interface/Room';
import { tap } from 'rxjs/operators';
import { User } from '../interface/User';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  public messageValue: Message[] = [];
  public roomValue: Room<User> = null;
  public messageLoadingValue: boolean = false;
  public roomLoadingValue: boolean = false;

  private _messages: BehaviorSubject<Message[]> =
    new BehaviorSubject([]);
  public messages = this._messages.asObservable();

  private _messageLoading: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  public messageLoading = this._messageLoading.asObservable();

  private _room: BehaviorSubject<Room<User>> =
    new BehaviorSubject(null);
  public room = this._room.asObservable();

  private _roomLoading: BehaviorSubject<boolean> =
    new BehaviorSubject(false);
  public roomLoading = this._roomLoading.asObservable();

  constructor(
    private socketService: SocketService,
  ) {
  }

  /**
   * Create room chat and join in.
   */
  startRoomChat(...userId: string[]) {
    this._roomLoading.next(true);
    this.roomLoadingValue = true;
    this.socketService.getRoomChat(userId).pipe(
      tap((room) => {
        this.roomValue = room;
        this.roomLoadingValue = false;
        this._roomLoading.next(false);
      }),
    ).subscribe(room => {
      this._room.next(room);
    });
  }

  /**
   * send the message
   */
  sendMessage(message: string, roomId?: string) {
    if (roomId == undefined && this.roomValue) {
      roomId = this.roomValue._id;
    }
    if (!roomId) {
      console.log('room_id missing');
      return;
    }

    this._messageLoading.next(true);
    this.messageLoadingValue = true;

    this.socketService.sendChatMessage(message, roomId)
      .pipe(
        tap(() => {
          this.messageLoadingValue = false;
          this._messageLoading.next(false);
        }),
      )
      .subscribe(message => {
        let currentMessages = this.messageValue;
        currentMessages.push(message);
        this.messageValue = currentMessages;
        this._messages.next(currentMessages);
      });
  }

  refreshMessage() {
    if (!this.roomValue || !this.roomValue._id) {
      return;
    }

    this._messageLoading.next(true);
    this.messageLoadingValue = true;

    this.socketService.getMessages(this.roomValue._id)
      .pipe(
        tap(() => {
          this.messageLoadingValue = false;
          this._messageLoading.next(false);
        }),
      )
      .subscribe(message => {
        this._messages.next(message.messages);
        this.messageValue = message.messages;
      });
  }
}
