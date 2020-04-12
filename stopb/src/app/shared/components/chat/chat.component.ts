import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {distinctUntilChanged} from "rxjs/operators";
import {UserService} from "../../../services/user.service";
import {User} from "../../interface/User";

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
  avatar: string;
  userStatus: number;

  chatWindow: boolean = false;

  constructor(
    private socketService: SocketService,
    private userService: UserService
  ) {
  }

  ngOnInit() {
    // Kết nối socket io và gán token
    // this.socketService.setupSocketConnection();

    this.getUserData();
  }

  getUserData() {
    return this.userService.getUserData().subscribe( (result: User) => {
      if(result){
        this.username = result.username;
        this.avatar = result.avatar;
        this.userStatus = result.userStatus;
        console.log(result);
      }
    })
  }

  openChat(){
    this.chatWindow = true;
  }
  closeChat(){
    this.chatWindow = false;
  }
}
