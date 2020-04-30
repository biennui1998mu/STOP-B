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

  get title() {
    return this.projectForm.get('title');
  }

  get priority() {
    return this.projectForm.get('priority');
  }

  get description() {
    return this.projectForm.get('description');
  }

  get endDate() {
    return this.projectForm.get('endDate');
  }

  get moderator() {
    return this.projectForm.get('moderator');
  }

  get member() {
    return this.projectForm.get('member');
  }

  get manager() {
    return this.projectForm.get('manager');
  }

  ngOnInit(): void {
    this.projectFormBuilder();
    this.getUserData();

    this.taskForm = this.formBuilder.group({
      createdTasks: this.formBuilder.array([]),
    });
  }

  getUserData() {
    this.manager.setValue(this.tokenService.user._id);
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
      manager: ['', Validators.required],
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: ['', [Validators.required]],
      priority: ['', [Validators.required]],
      colorCover: ['#14579c'],
      colorText: ['#ffffff'],
      endDate: ['', [Validators.required]],
      moderator: [[], [
        // Validators.required,
        Validators.maxLength(5),
      ]],
      member: [[], [
        // Validators.required,
        Validators.maxLength(50),
      ]],
    });
  }
}