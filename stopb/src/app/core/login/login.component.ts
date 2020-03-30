import {Component, OnInit} from '@angular/core';
import {UiStateService} from '../../shared/services/state/ui-state.service';
import {Router} from "@angular/router";
import {AuthorizeService} from "../../services/authorize.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  hide = true;
  tab= 0;

  public formSignIn = {
    username: null,
    password: null
  };

  public formSignup = {
    username: null,
    password: null,
    password_confirm: null,
    name: null,
    dob: null
  };

  constructor(
    private authorizeService: AuthorizeService,
    private uiStateService: UiStateService,
    private router: Router
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

  onSignin() {
    return this.authorizeService.login(this.formSignIn)
      .subscribe(status => {
        if (status) {
          this.router.navigateByUrl('/dashboard')
        }
      })
  }

  onSignup() {
    return this.authorizeService.signup(this.formSignup).subscribe(
      success => {
        if (success) {
          this.tab = 0; // ve panel sign in
        }
      })
  }

  changeTab(event) {
    console.log(event);
  }
}
