import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from "../../../services/authorize.service";
import { MatDialogRef } from "@angular/material/dialog";
import {SocketService} from "../../../services/socket.service";
import {UserService} from "../../../services/user.service";
import {Token} from "@angular/compiler";
import {TokenService} from "../../../services/token.service";

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
    private tokenService: TokenService
  ) {
  }

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId(){
    const decoded = this.tokenService.decodeJwt();
    this.userId = decoded.userId;
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.authorizeService.logout();
    this.socketService.getUserLogOut();
    this.dialog.close();
  }

  closeDialog(event: MouseEvent): void {
    this.dialog.close();
  }
}
