import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { AbstractControl, FormControl } from '@angular/forms';
import { User } from '../../../../shared/interface/User';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { TokenService } from '../../../../shared/services/token.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { UserQuery, UserService } from '../../../../shared/services/user';

@Component({
  selector: 'app-task-input',
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.scss'],
})
export class TaskInputComponent implements OnInit {
  @ViewChild('memberSearchInput')
  memberSearchInput: ElementRef<HTMLInputElement>;

  @Input()
  member: AbstractControl;

  @Input()
  moderator: AbstractControl;

  filteredMember: User[] = [];
  separatorKeysCodes: number[] = [ENTER, COMMA];
  memberFormSearch = new FormControl();

  constructor(
    private userService: UserService,
    private userQuery: UserQuery,
  ) {
  }

  get listMember() {
    return this.member.value as User[] || [];
  }

  get listManager() {
    return this.moderator.value as User[] || [];
  }

  get currentUser() {
    return this.userQuery.getValue();
  }

  ngOnInit(): void {
    this.searchMemberFormSub();
    this.observeManager();
  }

  removeMember(manager: User) {
    const currentList = this.listMember;
    const newList = currentList.filter(user => user._id !== manager._id);
    this.member.setValue(newList);
  }

  addMember($event: MatChipInputEvent) {
    if (
      $event.value.length > 2 &&
      this.filteredMember.length > 0
    ) {
      const newUser = this.filteredMember[0];
      this.addMemberToForm(newUser);
    }
  }

  selectedManager(event: MatAutocompleteSelectedEvent): void {
    const newUser = event.option.value as User;
    this.addMemberToForm(newUser);
  }

  private addMemberToForm(newUser: User) {
    const currentMember = this.listMember;
    currentMember.push(newUser);
    this.memberSearchInput.nativeElement.value = '';
    this.memberFormSearch.setValue(null);
    this.filteredMember = this.filteredMember.filter(
      user => user._id !== newUser._id,
    );
    this.member.setValue(currentMember);
  }

  private searchMemberFormSub() {
    this.memberFormSearch.valueChanges
      .pipe(
        debounceTime(200),
        filter((input: string | null) => input && input.length > 1),
        distinctUntilChanged(),
        switchMap(value => this.userService.find(value)),
        map(user => {
          const returnAvailable: User[] = [];
          user.forEach(found => {
            const findExisted = this.listMember.find(
              member => member._id == found._id,
            );
            const findManager = this.listManager.find(
              manager => manager._id == found._id,
            );
            if (
              !findExisted && !findManager &&
              found._id !== this.currentUser._id
            ) {
              returnAvailable.push(found);
            }
          });
          return returnAvailable;
        }),
      ).subscribe(
      listUser => this.filteredMember = listUser,
    );
  }

  private observeManager() {
    this.moderator.valueChanges.subscribe((value: User[]) => {
        const currentMembers = this.listMember.filter(member => {
          return !value.find(
            manager => manager._id == member._id,
          );
        });
        this.member.setValue(currentMembers);
      },
    );
  }
}
