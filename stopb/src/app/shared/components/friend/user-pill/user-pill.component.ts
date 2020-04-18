import { Component, Input, OnInit, Output } from '@angular/core';
import { User } from '../../../interface/User';
import { TokenService } from '../../../services/token.service';
import { UserService } from '../../../services/user.service';
import { FriendService } from '../../../services/friend.service';

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
  }

  /**
   * 0 = new
   */
  sendRequestFriend() {
    this.friendService.sendRequest({
      recipient: this.friend._id,
      requester: this.user.userId,
      status: 0, // new request
    }).subscribe(status => {
      console.log(status);
    });
  }

  /**
   * 1 = accept
   * 2 = decline
   * @param mode
   */
  updateRequestFriend(mode: 1 | 2) {
    if (this.friend.friendRequest) {
      this.friendService.setRequestStatus(
        this.friend.friendRequest._id,
        {
          _id: this.friend.friendRequest._id,
          status: mode,
          requester: this.friend.friendRequest.requester,
          recipient: this.friend.friendRequest.recipient,
        },
      ).subscribe(
        result => {
          console.log(result);
        },
      );
    }
  }
}
