import { Component, ElementRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { User } from '../../../../shared/interface/User';
import { MatChipInputEvent } from '@angular/material/chips';
import { AbstractControl, FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { UserService } from '../../../../shared/services/user.service';
import { TokenService } from '../../../../shared/services/token.service';

@Component({
  selector: 'app-moderator-input',
  templateUrl: './manager-input.component.html',
  styleUrls: ['./manager-input.component.scss'],
})
export class ManagerInputComponent implements OnInit {
  @ViewChild('managerSearchInput')
  managerSearchInput: ElementRef<HTMLInputElement>;
  @ViewChild('managerAutoComplete')
  managerAutocompleteInput: MatAutocomplete;

  @Input()
  moderator: AbstractControl;

  @Input()
  member: AbstractControl;

  @Output()
  managerNotFound: string = '';

  filteredManager: User[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  managerFormSearch = new FormControl();

  constructor(
    private tokenService: TokenService,
    private userService: UserService,
  ) {
  }

  get listManager() {
    return this.moderator.value as User[];
  }

  get currentUser() {
    return this.tokenService.user;
  }

  ngOnInit(): void {
    this.searchManageFormSub();
  }

  removeManager(manager: User) {
    const currentList = this.listManager;
    const newList = currentList.filter(user => user._id !== manager._id);
    this.moderator.setValue(newList);
  }

  addManager($event: MatChipInputEvent) {
    if ($event.value.length < 2) {
      this.managerNotFound = 'Must have at least 2 characters!';
    } else if (this.filteredManager.length == 0) {
      this.managerNotFound = 'No result found to add.';
    } else if (
      $event.value.length > 2 &&
      this.filteredManager.length > 0
    ) {
      const newUser = this.filteredManager[0];
      this.addManagerToForm(newUser);
    }
  }

  selectedManager(event: MatAutocompleteSelectedEvent): void {
    const newUser = event.option.value as User;
    this.addManagerToForm(newUser);
  }

  private addManagerToForm(newUser: User) {
    this.managerNotFound = '';
    const currentManagers = this.listManager;
    currentManagers.push(newUser);
    this.managerSearchInput.nativeElement.value = '';
    this.managerFormSearch.setValue(null);
    this.filteredManager = this.filteredManager.filter(
      user => user._id !== newUser._id,
    );
    this.moderator.setValue(currentManagers);
  }

  private searchManageFormSub() {
    this.managerFormSearch.valueChanges
      .pipe(
        debounceTime(200),
        filter((input: string | null) =>
          input && input.length > 1 && this.listManager.length < 6,
        ),
        distinctUntilChanged(),
        switchMap(value => this.userService.searchUser(value)),
        map(users => {
          const returnAvailable: User[] = [];
          users.forEach(found => {
            const findExisted = this.listManager.find(
              manager => manager._id == found._id ||
                found._id === this.currentUser.userId,
            );
            if (!findExisted && found._id !== this.currentUser.userId) {
              returnAvailable.push(found);
            }
          });
          return returnAvailable;
        }),
      ).subscribe(
      listUser => this.filteredManager = listUser,
    );
  }
}
