import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { User } from '../../../interface/User';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-task-meta',
  templateUrl: './task-meta.component.html',
  styleUrls: ['./task-meta.component.scss'],
})
export class TaskMetaComponent implements OnInit {
  @Input()
  readonly: boolean = false;

  /**
   * Input element on autocomplete assignee form.
   */
  @ViewChild('assigneeFormInput')
  assigneeFormInput: ElementRef<HTMLInputElement>;

  /**
   * person who create the task
   */
  @Input()
  issuer: User;

  /**
   * priority form control.
   */
  @Input()
  priority: FormControl;

  /**
   * startDate form control.
   */
  @Input()
  startDate: FormControl;

  /**
   * endDate form control.
   */
  @Input()
  endDate: FormControl;

  /**
   * assignee form control.
   * assignee form will be updated via this component instead.
   */
  @Input()
  assignee: FormControl;

  /**
   * List of assignable user for this task
   */
  @Input()
  availableMembers: User[];

  /**
   * quick adding user key event trigger
   */
  separatorKeysCodes: number[] = [ENTER, COMMA];

  constructor() {
  }

  /**
   * get the current selected user from the form to display or to validate
   * before pushing new user into.
   */
  get assigneeList() {
    return this.assignee.value as User[];
  };

  ngOnInit(): void {
  }

  addAssignee(event: MatChipInputEvent) {
    if (this.availableMembers.length == 0) {
      alert('There is no member to be added...');
    } else if (event.value.length < 2) {
      alert('At least 1 character is required to quick add');
    } else if (event.value.length >= 2 && this.availableMembers.length > 0) {
      const newUser = this.availableMembers[0];
      this.addAssigneeToForm(newUser);
    }
  }

  removeAssignee(assignee: User) {
    const currentList = this.assigneeList;
    const newList = currentList.filter(user => user._id !== assignee._id);
    this.assignee.setValue(newList);
  }

  selectedAssignee(event: MatAutocompleteSelectedEvent) {
    const newUser = event.option.value as User;
    this.addAssigneeToForm(newUser);
  }

  private addAssigneeToForm(newUser: User) {
    const currentManagers = this.assigneeList;
    currentManagers.push(newUser);
    this.assignee.setValue(currentManagers);
    this.assigneeFormInput.nativeElement.value = '';
    this.availableMembers = this.availableMembers.filter(
      user => user._id !== newUser._id,
    );
  }
}
