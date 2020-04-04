import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../../services/socket.service";
import { User } from "../../interface/User";
import * as jwtDecode from 'jwt-decode';

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
    this.decodeJwt();
  }

  decodeJwt(){
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    console.log(decoded);
    this.username = decoded.username;
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
