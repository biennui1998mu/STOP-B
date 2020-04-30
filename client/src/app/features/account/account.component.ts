import { Component, OnInit } from '@angular/core';
import { AuthorizeService } from "../../shared/services/authorize.service";
import { SocketService } from "../../shared/services/socket.service";
import { UserService } from "../../shared/services/user.service";
import { TokenService } from "../../shared/services/token.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {User} from "../../shared/interface/User";
import {Router} from "@angular/router";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  updateUserForm: FormGroup;
  user? : User;

  constructor(
    private authorizeService: AuthorizeService,
    private socketService: SocketService,
    private userService: UserService,
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.updateUserForm = this.formBuilder.group({
      username: [{value: '', disabled: true}, [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      dob: ['', [Validators.required]],
      avatar: [''],
    });
  }

  get username() {
    return this.updateUserForm.get('username');
  }

  get name() {
    return this.updateUserForm.get('name');
  }

  get dob() {
    return this.updateUserForm.get('dob');
  }

  get avatar() {
    return this.updateUserForm.get('avatar');
  }

  ngOnInit(): void {
    this.updateUserForm.valueChanges.subscribe(data => {
      // console.log(data);
      // console.log(this.updateUserForm.invalid);
    });

    this.getUser();
  }

  getUser() {
    return this.userService.viewProfile().subscribe((data: User) => {
      this.username.setValue(data.username);
      this.name.setValue(data.name);
      this.dob.setValue(data.dob);
      this.user.avatar = data.avatar;
    });
  }

  updateUser() {
    return this.userService.updateUser(
      this.tokenService.user._id,
      this.updateUserForm.value,
    ).subscribe(updated => {
      console.log(updated);
      // if (updated) {
      //   this.router.navigateByUrl('/account');
      // }
    });
  }
}
