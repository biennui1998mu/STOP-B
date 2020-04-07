import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {TokenService} from "../../../services/token.service";
import {distinctUntilChanged} from "rxjs/operators";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  message: string;
  messages: string[] = [];
  listUser: string[] = [];

  username: string;
  socket;

  constructor(
    private socketService: SocketService,
    private tokenService: TokenService
  ) {
  }

  ngOnInit() {
    // Kết nối socket io và gán token
    this.socketService.setupSocketConnection();

    // Lấy messages
    this.socketService.getMessage();

    // NoTi typing
    this.socketService.noTiTyping();

    // NoTi not typing
    this.socketService.noTiNotTyping();

    // Lấy user có trong mảng User/ = online
    this.socketService.getUserOnline();

    // subscribe danh sach ma ben socket emit qua `friendOnline`
    this.socketService.friendOnline
      .pipe(
        distinctUntilChanged()
      ).subscribe(
      listFriend => {
        this.listUser = listFriend;
      }
    );

    // subscribe danh sach ma ben socket emit qua `getUserMessage`
    this.socketService.getUserMessage
      .pipe(
        distinctUntilChanged()
      ).subscribe(
      message => {
        this.messages = message;
      }
    );

    this.getUserData();
  }

  getUserData() {
    const tokenDecoded = this.tokenService.decodeJwt();
    this.username = tokenDecoded.username;
  }

  sendMessage() {
    this.socketService.userSendMessage(this.message);
    this.message = '';
  }

  onFocus() {
    this.socketService.onFocus();
  }

  outFocus() {
    this.socketService.outFocus();
  }
}
