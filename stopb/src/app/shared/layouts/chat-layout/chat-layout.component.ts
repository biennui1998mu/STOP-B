import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SocketService } from "../../services/socket.service";
import { Message } from '../../interface/Message';
import { TokenService } from "../../services/token.service";
import { User } from "../../interface/User";
import { UserService } from "../../services/user.service";
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
})
export class ChatLayoutComponent implements OnInit, AfterViewInit, OnDestroy {

  message: string;
  roomId: string;

  friend: User;
  listId: string[];

  messages: Message[] = [];

  socket;

  @ViewChild('chatContext')
  chatContext: ElementRef<HTMLDivElement>;

  private componentDestroyed: Subject<boolean> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<ChatLayoutComponent>,
    private socketService: SocketService,
    private tokenService: TokenService,
    private userService: UserService,
  ) {
  }

  get userId() {
    return this.tokenService.user.userId;
  }

  ngOnInit(): void {
    this.socketService.getRoomChat.subscribe(room => {
      this.listId = room.listUser;
      this.roomId = room._id;
    });

    this.userListenMessage();
    this.getAllMessage();
    this.getFriend();
  }

  getFriend() {
    this.listId.splice(this.listId.indexOf(this.tokenService.user.userId), 1);
    this.listId.forEach(data => {
      this.userService.getFriendData(data)
        .pipe(
          distinctUntilChanged(),
          takeUntil(this.componentDestroyed),
        )
        .subscribe((friendData: User) => {
          this.friend = friendData;
        });
    });
  }

  closeChat() {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  /**
   * trigger this to scroll the chat to bottom (after every chat)
   */
  scrollToBottom() {
    this.chatContext.nativeElement.scrollTop = this.chatContext.nativeElement.scrollHeight;
  }

  userSendMessage() {
    this.socketService.userSendMessage(this.message, this.roomId)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.componentDestroyed),
      )
      .subscribe(result => {
        // console.log(result);
        this.message = '';
      });
  }

  userListenMessage() {
    this.socketService.getUserMessage
      .pipe(
        distinctUntilChanged(), // neu message trung nhau thi skip
        takeUntil(this.componentDestroyed), // neu dialog bi tat thi ngung listen
      )
      .subscribe(result => {
        if (result) {
          this.messages.push(result);
          setTimeout(() => this.scrollToBottom(), 10);
        }
      });
  }

  getAllMessage() {
    this.socketService.getAllMessage(this.roomId)
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.componentDestroyed),
      )
      .subscribe(result => {
        this.messages = result.messages;
        setTimeout(() => this.scrollToBottom(), 10);
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
  }
}
