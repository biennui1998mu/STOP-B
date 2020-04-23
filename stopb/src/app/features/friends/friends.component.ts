import { Component, OnInit } from '@angular/core';
import { User } from "../../shared/interface/User";
import { UserService } from "../../shared/services/user.service";
import { FriendService } from "../../shared/services/friend.service";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TokenService } from "../../shared/services/token.service";
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FriendRequest } from '../../shared/interface/FriendRequest';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
/**
 * smart component / dynamic component
 */
export class FriendsComponent implements OnInit {

  friendSearchForm = new FormControl(
    '',
    [Validators.required, Validators.minLength(2)],
  );
  friends: User[] = [];
  friendsLoading = this.friendService.friendLoading;
  strangers: User[] = [];
  friendRequest: User[] = [];
  friendRequestLoading = this.friendService.friendRequestLoading;
  isSearching: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private userService: UserService,
    private friendService: FriendService,
    private uiStateService: UiStateService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Friends',
        path: '/friends',
      },
    });
    this.friendService.refreshFriendRequest();
    this.friendService.refreshFriendList();
  }

  ngOnInit(): void {
    this.listenSearchForm();
    this.listenFriendList();
    this.listenFriendRequest();
  }

  private listenFriendList() {
    this.friendService.friends
      .pipe(
        distinctUntilChanged(),
      ).subscribe(
      friend => this.friends = friend,
    );
  }

  private listenSearchForm() {
    this.friendSearchForm.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(text => {
          if (this.friendSearchForm.invalid) {
            return of([]);
          }
          this.isSearching = true;
          return this.userService.searchUser(text);
        }),
        map((listUser: User[]) => {
          // filter out user that already friend with
          return listUser.filter(
            user => !this.friends.find(
              friend => friend._id === user._id,
            ),
          );
        }),
      )
      .subscribe((users) => {
        this.isSearching = false;
        this.strangers = users;
      });
  }

  private listenFriendRequest() {
    this.friendService.friendRequest.pipe(
      distinctUntilChanged(),
    ).subscribe(request => {
      this.friendRequest = this.parsingToUserFromRequest(request);
    });
  }

  private parsingToUserFromRequest(requests: FriendRequest<User>[]) {
    const users: User[] = [];
    requests.forEach(request => {
      let userGot: User = request.requester;
      userGot.friendRequest = {
        requester: request.requester._id,
        recipient: request.recipient._id,
        _id: request._id,
        status: request.status,
      };
      users.push(userGot);
    });

    return users;
  }
}
