import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../../services/socket.service";
import { User } from "../../interface/User";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {

  message: string;
  messages: string[] = [];

  user: User = null;

  constructor(
    private socketService: SocketService,
  ) {
  }

  sendMessage() {
    this.socketService.sendMessage(this.message);
    this.message = '';
  }

  ngOnInit() {
    this.socketService.getMessages().subscribe(
      (message: string) => {
        this.messages.push(message);
      });
  }
}
