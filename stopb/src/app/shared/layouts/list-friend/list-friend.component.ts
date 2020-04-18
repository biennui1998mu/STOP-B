import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from "../../services/socket.service";
import { UserService } from "../../services/user.service";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatLayoutComponent } from '../chat-layout/chat-layout.component';
import { FriendService } from "../../services/friend.service";
import { User } from '../../interface/User';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-list-friend',
  templateUrl: './list-friend.component.html',
  styleUrls: ['./list-friend.component.scss'],
})
export class ListFriendComponent implements OnInit, OnDestroy {
  listFriend: User[] = [];
  // display placeholder indicate loading
  listFriendLoading = this.friendService.friendLoading;

  chatDialog: MatDialogRef<ChatLayoutComponent>;
  private dialogFriendId: string = null;

  constructor(
    private socketService: SocketService,
    private userService: UserService,
    private matDialog: MatDialog,
    private friendService: FriendService,
  ) {
    this.friendService.friends
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe(friends => this.listFriend = friends);
  }

  ngOnInit() {
    // lấy friends của user
    this.friendService.refreshFriendList();

    this.socketService.getRoomChat
      .subscribe(roomChat => {
        if (roomChat) {
          if (this.chatDialog) {
            this.chatDialog.close();
            this.chatDialog = null;
          }
          this.openChatDialogs();
        }
      });
  }

  requestRoomChat(friendId: string) {
    if (this.dialogFriendId !== friendId) {
      this.dialogFriendId = friendId;
      this.socketService.userJoinRoom(friendId)
        .subscribe(result => {
          console.log(result);
        });
    }
  }

  openChatDialogs() {
    const dialogCounted = 1;
    this.chatDialog = this.matDialog.open(ChatLayoutComponent, {
      width: '280px',
      height: `350px`,
      position: {
        bottom: `0.5rem`,
        left: `${230 + 16 * dialogCounted}px`,
      },
      hasBackdrop: false,
      panelClass: `setting-modal-box`,
    });
    this.chatDialog.afterClosed().subscribe(
      () => this.dialogFriendId = null,
    );
  }

  ngOnDestroy(): void {
    if (this.chatDialog) {
      this.chatDialog.close();
      this.chatDialog = undefined;
      this.dialogFriendId = null;
    }
  }
}
