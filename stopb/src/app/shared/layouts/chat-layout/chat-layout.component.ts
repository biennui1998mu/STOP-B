import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {SocketService} from "../../services/socket.service";
import {Message} from '../../interface/Message';
import {TokenService} from "../../services/token.service";
import {User} from "../../interface/User";

@Component({
  selector: 'app-chat-layout',
  templateUrl: './chat-layout.component.html',
  styleUrls: ['./chat-layout.component.scss'],
})
export class ChatLayoutComponent implements OnInit, AfterViewInit {

  message: string;
  roomId: string;

  friend: User;
  messages: Message[] = [];
  @ViewChild('chatContext')
  chatContext: ElementRef<HTMLDivElement>;

  constructor(
    public dialogRef: MatDialogRef<ChatLayoutComponent>,
    private socketService: SocketService,
    private tokenService: TokenService
  ) {
  }

  get userId() {
    return this.tokenService.user.userId;
  }

  ngOnInit(): void {
    this.socketService.getRoomChat.subscribe(room => {
      console.log(room);
      this.roomId = room._id;
    });

    this.userListenMessage();
    this.getAllMessage();
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
    this.socketService.userSendMessage(this.message, this.roomId).subscribe(result => {
      console.log(result);
      this.message = '';
    })
  }

  userListenMessage() {
    this.socketService.getUserMessage
      .subscribe(result => {
        if (result) {
          this.messages.push(result);
          setTimeout(() => this.scrollToBottom(), 10);
        }
      });
  }

  getAllMessage() {
    this.socketService.getAllMessage(this.roomId).subscribe(result => {
      this.messages = result.messages;
      setTimeout(() => this.scrollToBottom(), 10);
    })
  }
}
