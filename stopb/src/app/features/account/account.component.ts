import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from "../../shared/services/authorize.service";
import { MatDialogRef } from "@angular/material/dialog";
import { SocketService } from "../../shared/services/socket.service";
import { UserService } from "../../shared/services/user.service";
import { TokenService } from "../../shared/services/token.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  userId: string;

  constructor(
    private authorizeService: AuthorizeService,
    private socketService: SocketService,
    private userService: UserService,
    private tokenService: TokenService,
  ) {
  }

  ngOnInit(): void {
  }
}
