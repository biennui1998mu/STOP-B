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
    private socketService: SocketService,
  ) {
  }

  ngOnInit() {
    this.socketService.setupSocketConnection();
  }

}
