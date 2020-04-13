import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../../services/socket.service";
import {distinctUntilChanged} from "rxjs/operators";
import {UserService} from "../../../services/user.service";
import {User} from "../../interface/User";

@Component({
  selector: 'app-list-friend',
  templateUrl: './list-friend.component.html',
  styleUrls: ['./list-friend.component.scss'],
})
export class ListFriendComponent implements OnInit {

  message: string;
  messages: string[] = [];
  listUser: string[] = [];

  socket;

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
    return this.userService.getUserData().subscribe( (result: User) => {
      if(result){
        this.username = result.username;
        this.avatar = result.avatar;
        this.userStatus = result.userStatus;
        console.log(result);
      }
    })
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

  openChat(){
    this.chatWindow = true;
  }
  closeChat(){
    this.chatWindow = false;
  }
}
