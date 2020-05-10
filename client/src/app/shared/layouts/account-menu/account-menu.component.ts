import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { TokenService } from "../../services/token.service";
import { UserService } from '../../services/user';

@Component({
  selector: 'app-setting',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
})
export class AccountMenuComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AccountMenuComponent>,
    private userService: UserService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
  }

  logout() {
    return this.userService.changeStatusUser(2).subscribe(result => {
      if (result) {
        // event.preventDefault();
        this.userService.logout();
        this.dialogRef.close();
      }
    });
  }
}
