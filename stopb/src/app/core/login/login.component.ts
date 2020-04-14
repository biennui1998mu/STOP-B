import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { Router } from "@angular/router";
import { AuthorizeService } from "../../shared/services/authorize.service";
import { UserService } from "../../shared/services/user.service";
import { TokenService } from "../../shared/services/token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  tab = 0;

  userId: string;

  public formSignIn = {
    username: null,
    password: null,
  };

  public formSignUp = {
    username: null,
    password: null,
    password_confirm: null,
    name: null,
    dob: null,
  };

  constructor(
    private authorizeService: AuthorizeService,
    private uiStateService: UiStateService,
    private router: Router,
    private userService: UserService,
    private tokenService: TokenService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'login',
        path: '/login',
      },
    });
  }

  ngOnInit(): void {
  }

  getUserId() {
    const decoded = this.tokenService.decodeJwt();
    this.userId = decoded.userId;
  }

  onSignIn() {
    return this.authorizeService.login(this.formSignIn)
      .subscribe(status => {
        if (status) {
          this.router.navigateByUrl('/dashboard');
          this.getUserId();
        }
      });
  }

  onSignUp() {
    return this.authorizeService.signUp(this.formSignUp).subscribe(
      success => {
        if (success) {
          this.tab = 0; // ve panel sign in
        }
      });
  }

  changeTab(event) {
    console.log(event);
  }
}
