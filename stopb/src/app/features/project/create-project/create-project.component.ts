import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { ProjectService } from "../../../shared/services/project.service";
import { Router } from "@angular/router";
import { TaskService } from "../../../shared/services/task.service";
import { TokenService } from '../../../shared/services/token.service';
import { UserService } from '../../../shared/services/user.service';
import { MatVerticalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-makePlan',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  @ViewChild('projectFormCreate')
  projectFormCreate: MatVerticalStepper;

  projectForm: FormGroup;
  taskForm: FormGroup;

  constructor(
    private tokenService: TokenService,
    private uiStateService: UiStateService,
    private formBuilder: FormBuilder,
    private planService: ProjectService,
    private taskService: TaskService,
    private userService: UserService,
    private router: Router,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Create Plan',
        path: '/project/create',
      },
    });
  }

  get Title() {
    return this.projectForm.get('Title');
  }

  get Priority() {
    return this.projectForm.get('Priority');
  }

  get Description() {
    return this.projectForm.get('Description');
  }

  get EndDate() {
    return this.projectForm.get('EndDate');
  }

  get Moderator() {
    return this.projectForm.get('Moderator');
  }

  get Member() {
    return this.projectForm.get('Member');
  }

  get Manager() {
    return this.projectForm.get('Manager');
  }

  ngOnInit(): void {
    this.projectFormBuilder();
    this.getUserData();

    this.taskForm = this.formBuilder.group({
      createdTasks: this.formBuilder.array([]),
    });
  }

  getUserData() {
    this.Manager.setValue(this.tokenService.user.userId);
  }

  createProject() {
    return this.planService.createProject(this.projectForm.value).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  private projectFormBuilder() {
    this.projectForm = this.formBuilder.group({
      Manager: ['', Validators.required],
      Title: ['', [Validators.required, Validators.minLength(2)]],
      Description: ['', [Validators.required]],
      Priority: ['', [Validators.required]],
      EndDate: ['', [Validators.required]],
      Moderator: [[], [
        // Validators.required,
        Validators.maxLength(5),
      ]],
      Member: [[], [
        // Validators.required,
        Validators.maxLength(50),
      ]],
    });
  }
}
