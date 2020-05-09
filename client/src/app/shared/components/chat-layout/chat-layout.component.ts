import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Message } from '../../interface/Message';
import { User } from "../../interface/User";
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { FormControl, Validators } from '@angular/forms';
import { Room } from '../../interface/Room';
import { MessageChatQuery, MessageChatService } from '../../services/roomchat-message';
import { RoomchatQuery } from '../../services/roomchat';
import { UserQuery } from '../../services/user';

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
})
export class ChatLayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('chatContext')
  chatContext: ElementRef<HTMLDivElement>;

  messageInput = new FormControl('', [
    Validators.required, Validators.minLength(1),
  ]);
  room: Room<User> = null;
  friend: User;
  messages: Message[] = [];

  messageLoading = this.messageChatQuery.selectLoading();

  private componentDestroyed: Subject<boolean> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<ChatLayoutComponent>,
    private messageChatService: MessageChatService,
    private messageChatQuery: MessageChatQuery,
    private roomChatQuery: RoomchatQuery,
    private userQuery: UserQuery,
  ) {
    this.roomChatQuery.select().subscribe(room => {
      this.room = room;
      this.friend = room.listUser.filter(
        user => user._id !== this.userId,
      )[0];
    });
    this.userListenMessage();
  }

  get userId() {
    return this.userQuery.getValue()._id;
  }

  closeChat() {
    this.dialogRef.close();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  sendChatMessage() {
    if (this.messageInput.valid && this.messageInput.value.trim().length > 0) {
      this.messageChatService.send(this.messageInput.value, this.room._id);
      this.messageInput.setValue('');
    }
    return;
  }

  userListenMessage() {
    this.messageChatQuery.selectAll()
      .pipe(
        distinctUntilChanged(), // neu message trung nhau thi skip
        takeUntil(this.componentDestroyed),
      )
      .subscribe(result => {
        if (result) {
          this.messages = result;
          setTimeout(() => this.scrollToBottom(), 10);
        }
      });
  }

  ngOnDestroy(): void {
    this.componentDestroyed.next(true);
    this.componentDestroyed.complete();
    this.dialogRef.close();
  }

  /**
   * trigger this to scroll the chat to bottom (after every chat)
   */
  private scrollToBottom() {
    this.chatContext.nativeElement.scrollTop = this.chatContext.nativeElement.scrollHeight;
  }
}
