import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';
import { ChatLayoutComponent } from '../../components/chat-layout/chat-layout.component';
import { User } from '../../interface/User';
import { distinctUntilChanged, filter } from 'rxjs/operators';
import { FriendsQuery, FriendsService } from '../../services/friends';
import { RoomchatQuery, RoomChatService } from '../../services/roomchat';
import { UserQuery } from '../../services/user';
import { MessageChatQuery, MessageChatService } from '../../services/roomchat-message';

@Component({
  selector: 'app-list-friend',
  templateUrl: './list-friend.component.html',
  styleUrls: ['./list-friend.component.scss'],
})
export class ListFriendComponent implements OnInit, OnDestroy {
  listFriend: User[] = [];
  // display placeholder indicate loading
  listFriendLoading = this.friendsQuery.selectLoading();
  roomChatLoading = false;

  chatDialog: MatDialogRef<ChatLayoutComponent>;
  private dialogFriendId: string = null;

  constructor(
    private roomChatService: RoomChatService,
    private roomChatQuery: RoomchatQuery,
    private messageChatService: MessageChatService,
    private messageChatQuery: MessageChatQuery,
    private matDialog: MatDialog,
    private friendsService: FriendsService,
    private friendsQuery: FriendsQuery,
    private userQuery: UserQuery,
  ) {
    this.friendsQuery.selectAll()
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe(friends => this.listFriend = friends);

    this.roomChatQuery.selectLoading().subscribe(
      status => this.roomChatLoading = status,
    );
  }

  ngOnInit() {
    // lấy friends của user
    this.friendsService.get();

    this.roomChatQuery.select()
      .pipe(
        filter(roomChat => !!roomChat._id),
        distinctUntilChanged(),
      )
      .subscribe(roomChat => {
        console.log(roomChat);
        this.messageChatService.get(roomChat._id);
        this.openChatDialogs();
      });
  }

  requestRoomChat(friendId: string) {
    if (
      !this.roomChatLoading &&          // must not in loading state
      this.dialogFriendId !== friendId  // must be the current chatting person
    ) {
      this.roomChatLoading = true;
      if (this.chatDialog && this.chatDialog.getState() === MatDialogState.OPEN) {
        this.chatDialog.close();
        this.chatDialog.afterClosed().subscribe(
          () => {
            this.dialogFriendId = friendId;
            this.roomChatService.get([friendId], this.userQuery.getValue()._id);
          },
        );
        return;
      }

      this.dialogFriendId = friendId;
      this.roomChatService.get([friendId], this.userQuery.getValue()._id);
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
    this.chatDialog.beforeClosed().subscribe(() => {
      this.roomChatService.leaveRoomChat(this.roomChatQuery.getValue()._id);
      this.dialogFriendId = null;
      this.roomChatService.clearRoom();
    });
  }

  ngOnDestroy(): void {
    if (this.chatDialog) {
      this.chatDialog.close();
      this.chatDialog = undefined;
      this.dialogFriendId = null;
    }
  }
}
