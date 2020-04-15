import {Component, OnInit} from '@angular/core';
import {SocketService} from "../../services/socket.service";
import {UserService} from "../../services/user.service";
import {MatDialog} from '@angular/material/dialog';
import {ChatLayoutComponent} from '../chat-layout/chat-layout.component';
import {FriendService} from "../../services/friend.service";
import {User} from '../../interface/User';

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

  chatDialogOn = false;

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private matDialog: MatDialog,
    private friendService: FriendService,
  ) {
  }

  ngOnInit() {
    // lấy friends của user
    this.getFriends();

    this.socketService.getRoomChat
      .subscribe(roomChat => {
        if (roomChat) {
          if (!this.chatDialogOn) {
            this.openChatDialogs();
          }
        }
      })
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

  requestRoomChat(friendId) {
    this.socketService.userJoinRoom(friendId)
      .subscribe(result => {
        console.log(result);
      })
  }

  openChatDialogs() {
    const dialogCounted = 1;
    this.chatDialogOn = true;
    this.matDialog.open(ChatLayoutComponent, {
      width: '280px',
      height: `350px`,
      position: {
        bottom: `0.5rem`,
        left: `${230 + 16 * dialogCounted}px`,
      },
      hasBackdrop: false,
      panelClass: `setting-modal-box`,
    }).afterClosed().subscribe(
      () => this.chatDialogOn = false
    );
  }

  getFriends() {
    this.friendService.getFriends().subscribe(result => {
      console.log(result);
      if (result) {
        this.listFriend = result;
      }
    });
  }
}
