import {Component, OnInit} from '@angular/core';
import {User} from "../../interface/User";
import {UserService} from "../../../services/user.service";
import {FriendService} from "../../../services/friend.service";
import {FriendRequest} from "../../interface/FriendRequest";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {TokenService} from "../../../services/token.service";
import {SocketService} from "../../../services/socket.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {

  users: User[];
  username: string;

  userId:string

  requestForm: FormGroup;
  requests: FriendRequest[] = [];

  friends: User[];

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private tokenService: TokenService,
    private userService: UserService,
    private friendService: FriendService,
    private socketService: SocketService
  ) {
    this.requestForm = this.formBuilder.group({
      _id: [],
      requester: [],
      recipient: [],
      status: [0]
    });
  }

  get requestId(){
    return this.requestForm.get('_id');
  }

  // friendId
  get recipient(){
    return this.requestForm.get('recipient');
  }

  // userId
  get requester(){
    return this.requestForm.get('requester');
  }

  get status(){
    return this.requestForm.get('status');
  }

  ngOnInit(): void {
    this.getUserId();
    this.getAllRequest();
    this.getFriends();
  }

  getUserId(){
    const tokenDecoded = this.tokenService.decodeJwt();
    this.requester.setValue(tokenDecoded.userId);
    this.userId = tokenDecoded.userId;
  }

  searchFriend() {
    return this.userService.searchUser(this.username).subscribe(users => {
        this.users = users;
        console.log(users);
      }
    )
  }

  getAllRequest(){
    return this.friendService.getAllRequest().subscribe( result => {
      console.log(result);
      this.requests = result;
    })
  }

  sendRequest(friendId: string){
    this.recipient.setValue(friendId);
    console.log(friendId);
    return this.friendService.sendRequest(this.requestForm.value).subscribe( success => {
      console.log(success);
      if(success){

      }
    })
  }

  setRequestStatus(
    status: number,
    friendId: string,
    userId: string,
    requestId: string
  ) {
    this.status.setValue(status);
    this.requester.setValue(friendId);
    this.recipient.setValue(userId);
    this.requestId.setValue(requestId);
    return this.friendService.setRequestStatus(this.requestId.value, this.requestForm.value).subscribe(updated => {
      console.log(updated);
      if (updated) {

      }
    });
  }

  getFriends(){
    return this.friendService.getFriends().subscribe( result => {
      console.log(result);
      this.friends = result;
    })
  }

  // getFriendOnline(){
  //   //   return this.friendService.getFriendOnline().subscribe( result => {
  //   //     console.log(result);
  //   //     this.friends = result;
  //   //   })
  //   // }
}
