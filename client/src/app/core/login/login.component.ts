import { Component } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { Router } from "@angular/router";
import { UserService } from '../../shared/services/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  hide = true;
  tab = 0;

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
    private uiStateService: UiStateService,
    private router: Router,
    private userService: UserService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'login',
        path: '/login',
      },
    });
  }

  onSignIn() {
    this.userService.login(this.formSignIn)
      .subscribe(status => {
        if (status) {
          this.router.navigateByUrl('/dashboard');
        }
      });
  }

  onSignUp() {
    this.userService.register(this.formSignUp).subscribe(
      success => {
        if (success) {
          this.tab = 0; // ve panel sign in
        }
      });
  }
}
