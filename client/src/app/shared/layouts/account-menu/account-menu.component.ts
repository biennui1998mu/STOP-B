import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../../services/authorize.service';
import { MatDialogRef } from '@angular/material/dialog';
import {UserService} from "../../services/user.service";
import {TokenService} from "../../services/token.service";

@Component({
  selector: 'app-setting',
  templateUrl: './account-menu.component.html',
  styleUrls: ['./account-menu.component.scss'],
})
export class AccountMenuComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<AccountMenuComponent>,
    private authorizeService: AuthorizeService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
  }

  logout() {
    return this.userService.changeStatusUser(this.tokenService.user._id, 2).subscribe(result => {
      if (result) {
        // event.preventDefault();
        this.authorizeService.logout();
        this.dialogRef.close();
      }
    });
  }
}
