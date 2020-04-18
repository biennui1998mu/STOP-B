import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from '../../services/authorize.service';
import { MatDialogRef } from '@angular/material/dialog';
import {UserService} from "../../services/user.service";
import {TokenService} from "../../services/token.service";

@Component({
  selector: 'app-setting',
  templateUrl: './quick-access.component.html',
  styleUrls: ['./quick-access.component.scss'],
})
export class QuickAccessComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<QuickAccessComponent>,
    private authorizeService: AuthorizeService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
  }

  logout() {
    return this.userService.changeStatusUser(this.tokenService.user.userId, 2).subscribe(result => {
      if (result) {
        // event.preventDefault();
        this.authorizeService.logout();
        this.dialogRef.close();
      }
    });
  }
}
