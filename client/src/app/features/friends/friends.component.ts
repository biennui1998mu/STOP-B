import { Component, OnInit } from '@angular/core';
import { User } from "../../shared/interface/User";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { FriendRequest } from '../../shared/interface/FriendRequest';
import { UserService } from '../../shared/services/user';
import { FriendsQuery, FriendsService } from '../../shared/services/friends';
import { FriendRequestsQuery, FriendRequestsService } from '../../shared/services/friend-requests';
import { deepImmutableObject } from '../../shared/tools';

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
  friendsLoading = this.friendsQuery.selectLoading();
  strangers: User[] = [];
  friendRequest: User[] = [];
  friendRequestLoading = this.friendRequestsQuery.selectLoading();
  isSearching: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private friendService: FriendsService,
    private friendsQuery: FriendsQuery,
    private friendRequestsService: FriendRequestsService,
    private friendRequestsQuery: FriendRequestsQuery,
    private uiStateService: UiStateService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Friends',
        path: '/friends',
      },
    });
    this.listenFriendList();
    this.listenFriendRequest();
    this.friendRequestsService.get();
    this.friendService.get();
  }

  ngOnInit(): void {
    this.listenSearchForm();
  }

  private listenFriendList() {
    this.friendsQuery.selectAll()
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
          return this.userService.find(text);
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
    this.friendRequestsQuery.selectAll().pipe(
      distinctUntilChanged(),
    ).subscribe(request => {
      this.friendRequest = this.parsingToUserFromRequest(
        deepImmutableObject(request),
      );
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
