import { Component, OnInit } from '@angular/core';
import { SocketService } from "../../../services/socket.service";
import { distinctUntilChanged } from "rxjs/operators";
import { UserService } from "../../../services/user.service";
import { MatDialog } from '@angular/material/dialog';
import { ChatLayoutComponent } from '../chat-layout/chat-layout.component';
import {FriendRequest} from "../../interface/FriendRequest";
import {FriendService} from "../../../services/friend.service";
import { User } from '../../interface/User';

@Component({
  selector: 'app-list-friend',
  templateUrl: './list-friend.component.html',
  styleUrls: ['./list-friend.component.scss'],
})
export class ListFriendComponent implements OnInit {

  message: string;
  messages: string[] = [];
  listFriend: User[] = [];

  socket;

  username: string;
  avatar: string;
  userStatus: number;

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private matDialog: MatDialog,
    private friendService: FriendService
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
    // this.socketService.friendOnline
    //   .pipe(
    //     distinctUntilChanged(),
    //   ).subscribe(
    //   listFriend => {
    //     this.listFriend = listFriend;
    //   },
    // );

    // subscribe danh sach ma ben socket emit qua `getUserMessage`
    this.socketService.getUserMessage
      .pipe(
        distinctUntilChanged(),
      ).subscribe(
      message => {
        this.messages = message;
      },
    );

    // this.getUserData();
    // this.openChatDialogs();

    // lấy friends của user
    this.getFriends();
  }

  //
  // getUserData() {
  //   return this.userService.getUserData().subscribe( (result: User) => {
  //     if(result){
  //       this.username = result.username;
  //       this.avatar = result.avatar;
  //       this.userStatus = result.userStatus;
  //       console.log(result);
  //     }
  //   })
  // }

  sendMessage() {
    // this.socketService.userSendMessage(this.message, messageForm);
    this.message = '';
  }

  openChatDialogs(roomName, friendId) {
    const dialogCounted = 1;
    this.matDialog.open(ChatLayoutComponent, {
      width: '280px',
      height: `350px`,
      position: {
        bottom: `0.5rem`,
        left: `${230 + 16 * dialogCounted}px`,
      },
      hasBackdrop: false,
      panelClass: `setting-modal-box`,
    });
    this.socketService.userJoinRoom(roomName, friendId).subscribe( result => {
      console.log(result);
      if(result){
      }
    })
  }

  getFriends(){
    this.friendService.getFriends().subscribe( result => {
      console.log(result);
      if(result){
        this.listFriend = result
      }
    })
  }

  // joinRoom(roomName, friendId){
  //   this.socketService.userJoinRoom(roomName, friendId).subscribe( result => {
  //     console.log(result);
  //     if(result){
  //     }
  //   })
  // }
}
