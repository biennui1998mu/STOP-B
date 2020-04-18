import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserService } from "../../services/user.service";
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ChatLayoutComponent } from '../chat-layout/chat-layout.component';
import { FriendService } from "../../services/friend.service";
import { User } from '../../interface/User';
import { distinctUntilChanged } from 'rxjs/operators';
import { ChatService } from '../../services/chat.service';

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
    private chatService: ChatService,
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

    this.chatService.room
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe(roomChat => {
        if (roomChat) {
          // retrieve message
          this.chatService.refreshMessage();

          if (this.chatDialog) {
            this.chatDialog.close();
            this.chatDialog = null;
          }
          this.openChatDialogs();
        }
      });
  }

  requestRoomChat(friendId: string) {
    if (this.dialogFriendId !== friendId && !this.chatService.roomLoadingValue) {
      this.dialogFriendId = friendId;
      this.chatService.startRoomChat(friendId);
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
