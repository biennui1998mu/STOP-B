import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../../services/socket.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  message: string;
  messages: string[] = [];

  username: string;

  constructor(
    private socketService: SocketService) {
  }

  ngOnInit() {
    // Kết nối socket io và gán token
    this.socketService
      .setupSocketConnection();

    // Lấy user có trong mảng User/ = online
    this.socketService.getUserOnline();

    // Lấy messages
      this.socketService.getMessage();

    // NoTi typing
      this.socketService.noTiTyping();

    // NoTi not typing
    this.socketService.noTiNotTyping();
  }

  sendMessage(){
    this.socketService.userSendMessage(this.message);
    this.message = '';
  }

  onFocus(){
    this.socketService.onFocus();
  }
  outFocus(){
    this.socketService.outFocus();
  }
}
