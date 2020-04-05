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


  // getMyInfo(username: string){
  //   return this.userService.getMyInfo(username).subscribe( (data: User) => {
  //     this.username.setValue(data.username);
  //     this.name.setValue(data.name);
  //     this.dob.setValue(data.dob);
  //   })
  // }
}
