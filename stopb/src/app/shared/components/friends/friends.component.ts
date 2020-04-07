import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../services/user.service";
import {User} from "../../interface/User";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss'],
})
export class FriendsComponent implements OnInit {

  User: User[];
  username: string;

  constructor(
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
  }

  searchFriend() {
    this.userService.searchFriend(this.username).subscribe(user => {
        this.User = user;
        console.log(user);
      }
    )
  }
}
