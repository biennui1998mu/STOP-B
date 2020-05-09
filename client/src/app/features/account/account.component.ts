import { Component, OnInit } from '@angular/core';
import { TokenService } from "../../shared/services/token.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { User } from "../../shared/interface/User";
import { UserQuery, UserService } from '../../shared/services/user';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
export class AccountComponent implements OnInit {

  updateUserForm: FormGroup;
  user?: User;

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
    private userQuery: UserQuery,
    private formBuilder: FormBuilder,
  ) {
    this.updateUserForm = this.formBuilder.group({
      username: [{ value: '', disabled: true }, [Validators.required]],
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
    this.getUser();
  }

  getUser() {
    const user = this.userQuery.getValue();
    this.username.setValue(user.username);
    this.name.setValue(user.name);
    this.dob.setValue(user.dob);
    this.user.avatar = user.avatar;
  }

  updateUser() {
    return this.userService.update(
      this.tokenService.decodedToken?._id,
      this.updateUserForm.value,
    ).subscribe(updated => {
      console.log(updated);
      // if (updated) {
      //   this.router.navigateByUrl('/account');
      // }
    });
  }
}
