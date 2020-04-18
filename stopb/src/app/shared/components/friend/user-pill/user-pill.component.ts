import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../interface/User';
import { TokenService } from '../../../services/token.service';
import { UserService } from '../../../services/user.service';
import { FriendService } from '../../../services/friend.service';
import { FriendRequest } from '../../../interface/FriendRequest';

@Component({
  selector: 'app-user-pill',
  templateUrl: './user-pill.component.html',
  styleUrls: ['./user-pill.component.scss'],
})
/**
 * Dummy component
 */
export class UserPillComponent implements OnInit {

  @Input()
  friend: User;

  @Input()
  isStranger: boolean;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private friendService: FriendService,
  ) {
  }

  get user() {
    return this.tokenService.user;
  }

  ngOnInit(): void {
    console.log(this.friend.friendRequest);
  }

  /**
   * 0 = new
   */
  sendRequestFriend() {
    if (this.friend.friendRequest) {
      // neu truoc do da decline user nao do thi se co friend request nhung status = 2
      // minh se chi update lai request do sang status = 0 va thay doi `recipient` / `requester`
      this.updateRequestFriend(0);
      return;
    }

    this.friendService.sendRequest({
      recipient: this.friend._id,
      requester: this.user.userId,
      status: 0, // new request
    }).subscribe(status => {
      console.log(status);
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
      if (this.friend.friendRequest?.status === 2) {
        // neu truoc do unfriend nhau thi status === 2
        // swap lai requester/recipient va statu = 0 (request lai ng kia lam friend)
        updateInfo.requester = this.user.userId;
        updateInfo.recipient = this.friend._id;
        updateInfo.status = 0;
      }

      this.friendService.setRequestStatus(
        this.friend.friendRequest._id,
        updateInfo,
      ).subscribe(
        result => {
          console.log(result);
        },
      );
    }
  }

  isThisFriendRequest() {
    return this.friend.friendRequest?.requester === this.friend._id &&
      this.friend.friendRequest?.status === 0;
  }
}
