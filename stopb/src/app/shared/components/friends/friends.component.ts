import {Component, OnInit} from '@angular/core';
import {User} from "../../interface/User";
import {UserService} from "../../../services/user.service";
import {FriendService} from "../../../services/friend.service";
import {FriendRequest} from "../../interface/FriendRequest";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TokenService} from "../../../services/token.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {

  userId: string;
  friendId: string;

  User: User[];
  username: string;

  requestForm: FormGroup;
  requests: FriendRequest[] = [];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private userService: UserService,
    private friendService: FriendService
  ) {
    this.requestForm = this.formBuilder.group({
      requester: [this.userId],
      recipient: [this.friendId],
      status: [0]
    });
  }

  ngOnInit(): void {
    this.getUserId();
    this.getAllRequest();
  }

  getUserId(){
    const tokenDecoded = this.tokenService.decodeJwt();
    this.userId = tokenDecoded.userId;
  }

  searchFriend() {
    return this.userService.searchUser(this.username).subscribe(user => {
        this.User = user;
        this.friendId= user._id;
        console.log(user);
      }
    )
  }

  getAllRequest(){
    return this.friendService.getAllRequest().subscribe( result => {
      console.log(result);
      this.requests = result;
    })
  }

  sendRequest(){
    return this.friendService.sendRequest(this.requestForm.value).subscribe( success => {
      console.log(success);
      if(success){
      }
    })
  }

  setRequestStatus() {
    return this.friendService.setRequestStatus(this.requestForm.value).subscribe(updated => {
      console.log(updated);
      if (updated) {
      }
    });
  }
}
