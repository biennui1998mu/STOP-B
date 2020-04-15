import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from "../../services/authorize.service";
import { MatDialogRef } from "@angular/material/dialog";
import { SocketService } from "../../services/socket.service";
import { UserService } from "../../services/user.service";
import { TokenService } from "../../services/token.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  userId: string;

  constructor(
    private authorizeService: AuthorizeService,
    public dialog: MatDialogRef<AccountComponent>,
    private socketService: SocketService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    const decoded = this.tokenService.decodeJwt();
    this.userId = decoded.userId;
  }

  logout(event: MouseEvent) {
    return this.userService.updateUser(this.userId, 2).subscribe(result => {
      if (result) {
        event.preventDefault();
        this.authorizeService.logout();
        this.dialog.close();
      }
    });
  }

  closeDialog(event: MouseEvent): void {
    this.dialog.close();
  }
}
