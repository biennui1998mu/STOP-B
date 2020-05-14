import { Component, Input } from '@angular/core';
import { User } from '../../../interface/User';
import { TokenService } from '../../../services/token.service';
import { FriendRequest } from '../../../interface/FriendRequest';
import { tap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogsComponent } from '../../dialogs/confirm-dialogs/confirm-dialogs.component';
import { ConfirmDialogModel } from '../../../interface/ConfirmDialogModel';
import { FriendsService } from '../../../services/friends';
import { UserQuery } from '../../../services/user';
import { FriendRequestsService } from '../../../services/friend-requests';

@Component({
  selector: 'app-user-pill',
  templateUrl: './user-pill.component.html',
  styleUrls: ['./user-pill.component.scss'],
})
/**
 * Dummy component
 */
export class UserPillComponent {

  @Input()
  friend: User;

  @Input()
  isStranger: boolean;

  constructor(
    private tokenService: TokenService,
    private userQuery: UserQuery,
    private friendRequestService: FriendRequestsService,
    private friendsService: FriendsService,
    private matDialog: MatDialog,
  ) {
  }

  get user() {
    return this.userQuery.getValue();
  }

  /**
   * 0 = new
   */
  sendRequestFriend() {
    if (this.friend.friendRequest) {
      // neu truoc do da decline user nao do thi se co friend request nhung status = 2
      // minh se chi update lai request do sang status = 0
      // va thay doi `recipient` / `requester`
      this.updateRequestFriend(0);
      return;
    }

    this.friendRequestService.sendFriendRequest(
      {
        recipient: this.friend._id,
        requester: this.user._id,
        status: 0, // new request
      },
    ).pipe(
      tap(result => {
        if (result) {
          this.friendRequestService.get();
        }
      }),
    ).subscribe(status => {
      if (status) {
        this.friend.friendRequest = status;
        // switch status 'offline' without total refresh dom.
      }
    });
  }

  /**
   * 0 = new/not response
   * 1 = accept
   * 2 = decline
   * @param mode
   */
  updateRequestFriend(mode: 0 | 1 | 2) {
    if (this.friend.friendRequest) {
      const updateInfo: Partial<FriendRequest> = {
        status: mode,
      };
      if (this.friend.friendRequest.status === 2) {
        // neu truoc do unfriend nhau thi status === 2
        // swap lai requester/recipient va statu = 0 (request lai ng kia lam friend)
        updateInfo.requester = this.user._id;
        updateInfo.recipient = this.friend._id;
        updateInfo.status = 0;
      }

      if (this.friend.friendRequest.status === 1 && mode === 2) {
        this.matDialog.open<ConfirmDialogsComponent, ConfirmDialogModel>(
          ConfirmDialogsComponent,
          {
            width: `400px`,
            data: this.getConfirmDialogData(),
          },
        ).afterClosed().subscribe(decision => {
          if (decision) {
            this.callAPIUpdateStatus(updateInfo);
          }
        });
        return;
      }

      this.callAPIUpdateStatus(updateInfo);
    }
  }

  isThisFriendRequest() {
    return this.friend.friendRequest?.requester === this.friend._id &&
      this.friend.friendRequest?.status === 0;
  }

  private callAPIUpdateStatus(updateInfo: Partial<FriendRequest>) {
    this.friendRequestService.responseFriendRequest(
      this.friend.friendRequest._id,
      updateInfo,
    ).pipe(
      tap(result => {
        if (result) {
          this.friendsService.get();
        }
      }),
    ).subscribe(
      result => {
        if (result) {
          // update the record offline to prevent another query to server.
          this.friend.friendRequest = result;
          if (result.status === 1) {
            // if friend then set isStranger option to false.
            this.isStranger = false;
            this.friendRequestService.removeFromStore(result);
          }
        }
      },
    );
  }

  private getConfirmDialogData(): ConfirmDialogModel {
    const title = 'Unfriend confirmation';
    const body = `You are about to unfriend ${this.friend.name}.`;
    const subBody = `Once you confirm this, you and ${this.friend.name} cannot see each other status or chat, also you cannot invite the person to join any future projects which created by you. Are you sure?`;
    const optionCancel = 'Cancel';
    const optionAccept = 'Unfriend';
    const acceptClass = 'bg-danger text-white';
    return {
      title, body, acceptClass, optionAccept, subBody, optionCancel,
    };
  }
}
