import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountComponent } from "../account/account.component";
import {FriendsComponent} from "../friends/friends.component";
import {SettingComponent} from "../setting/setting.component";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
  }

  openDialogFriends(): void {
    const dialogOpen = this.dialog.open(FriendsComponent, {
      width: '500px',
      height: '500px',
    });
  }
  openDialogSetting(): void {
    const dialogOpen = this.dialog.open(SettingComponent, {
      width: '500px',
      height: '500px',
    });
  }
  openDialogAccount(): void {
    const dialogOpen = this.dialog.open(AccountComponent, {
      width: '500px',
      height: '500px',
    });
  }

}
