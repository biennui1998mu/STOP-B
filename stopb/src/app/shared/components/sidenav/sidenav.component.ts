import { AfterContentInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountComponent } from "../account/account.component";
import { FriendsComponent } from "../friends/friends.component";
import { SettingComponent } from "../setting/setting.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements AfterContentInit {

  noteSectionOpen = false;
  projectSectionOpen = false;

  constructor(
    private dialog: MatDialog,
    private router: Router,
  ) {
  }

  ngAfterContentInit(): void {
    this.extractCurrentURL(this.router.url);
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

  defaultSectionClick(project: string, ...routing: string[]) {
    switch (project) {
      case 'note':
        this.noteSectionOpen = true;
        this.projectSectionOpen = false;
        break;
      case 'project':
        this.projectSectionOpen = true;
        this.noteSectionOpen = false;
        break;
    }
    this.router.navigate(routing);
  }

  private extractCurrentURL(url: string) {
    const splitting = url.split(/\//g);
    if (splitting[1] != undefined) {
      const url = splitting[1];
      this.defaultSectionClick(url, `/${url}`);
    }
  }
}
