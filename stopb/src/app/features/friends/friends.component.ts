import { Component, OnInit } from '@angular/core';
import { User } from "../../shared/interface/User";
import { UserService } from "../../shared/services/user.service";
import { FriendService } from "../../shared/services/friend.service";
import { FriendRequest } from "../../shared/interface/FriendRequest";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { TokenService } from "../../shared/services/token.service";
import { SocketService } from "../../shared/services/socket.service";
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { debounceTime, distinctUntilChanged, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {

  friendSearchForm = new FormControl(
    '',
    [Validators.required, Validators.minLength(2)],
  );
  friends: User[] = [];
  strangers: User[] = [];

  users: User[];
  username: string;

  userId: string;

  requestForm: FormGroup;
  requests: FriendRequest[] = [];


  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private userService: UserService,
    private friendService: FriendService,
    private socketService: SocketService,
    private uiStateService: UiStateService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Friends',
        path: '/friends',
      },
    });

    this.requestForm = this.formBuilder.group({
      _id: [],
      requester: [],
      recipient: [],
      status: [0],
    });
  }

  ngOnInit(): void {
    // Form search
    this.listenSearchForm();
    this.getFriendsInformation();
    this.getAllRequest();
  }

  getAllRequest() {
    return this.friendService.getFriendRequests()
      .subscribe(result => {
        console.log(result);
      });
  }

  getFriendsInformation() {
    this.friendService.getFriends();

    this.friendService.friends
      .pipe(
        distinctUntilChanged(),
      )
      .subscribe(
        friend => this.friends = friend,
      );
  }

  listenSearchForm() {
    this.friendSearchForm.valueChanges
      .pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap(text => {
          if (this.friendSearchForm.invalid) {
            this.strangers = [];
            return of([]);
          }

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
        this.strangers = users;
        console.log(users);
      });
  }
}
