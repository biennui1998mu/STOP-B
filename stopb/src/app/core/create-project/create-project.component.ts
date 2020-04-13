import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { ProjectService } from "../../services/project.service";
import { Router } from "@angular/router";
import { TaskService } from "../../services/task.service";
import { TokenService } from '../../services/token.service';
import { UserService } from '../../services/user.service';
import { MatVerticalStepper } from '@angular/material/stepper';
import validate = WebAssembly.validate;

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

  get projectTitle() {
    return this.projectForm.get('projectTitle');
  }

  get projectPriority() {
    return this.projectForm.get('projectPriority');
  }

  get projectDescription() {
    return this.projectForm.get('projectDescription');
  }

  get projectEndDate() {
    return this.projectForm.get('projectEndDate');
  }

  get projectModerator() {
    return this.projectForm.get('projectModerator');
  }

  get projectMember() {
    return this.projectForm.get('projectMember');
  }

  get projectManager() {
    return this.projectForm.get('projectManager');
  }

  ngOnInit(): void {
    this.projectFormBuilder();
    this.getUserdata()

    this.taskForm = this.formBuilder.group({
      createdTasks: this.formBuilder.array([]),
    });
  }

  getUserdata(){
    const decoded = this.tokenService.decodeJwt();
    this.projectManager.setValue(decoded.userId);
  }

  private projectFormBuilder() {
    this.projectForm = this.formBuilder.group({
      projectManager: ['', Validators.required],
      projectTitle: ['', [Validators.required, Validators.minLength(2)]],
      projectDescription: ['', [Validators.required]],
      projectPriority: ['', [Validators.required]],
      projectEndDate: ['', [Validators.required]],
      projectModerator: [[], [
        // Validators.required,
        Validators.maxLength(5),
      ]],
      projectMember: [[], [
        // Validators.required,
        Validators.maxLength(50),
      ]],
    });
  }

  createProject() {
    return this.planService.projectCreate(this.projectForm.value).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }
}
