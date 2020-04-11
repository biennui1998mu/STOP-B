import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { ProjectService } from "../../services/project.service";
import { Router } from "@angular/router";
import { TaskService } from "../../services/task.service";
import { User } from '../../shared/interface/User';
import { TokenService } from '../../services/token.service';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { UserService } from '../../services/user.service';
import { MatVerticalStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-makePlan',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  @ViewChild('projectFormCreate')
  projectFormCreate: MatVerticalStepper;

  // @ViewChild('managerAutoComplete')
  // managerAutocompleteInput: MatAutocomplete;
  //
  // @ViewChild('managerSearchInput')
  // managerSearchInput: ElementRef<HTMLInputElement>;

  projectForm: FormGroup;
  taskForm: FormGroup;
  taskArray: FormArray;

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

  get projectDate() {
    return this.projectForm.get('projectDate');
  }

  get projectManager() {
    return this.projectForm.get('projectManager');
  }

  get projectMember() {
    return this.projectForm.get('projectMember');
  }

  get createdTasks() {
    return this.taskForm.get('createdTasks') as FormArray;
  }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      projectTitle: ['', [Validators.required, Validators.minLength(2)]],
      projectPriority: ['', [Validators.required]],
      projectDate: ['', [Validators.required]],
      projectManager: [[], [
        Validators.required,
        Validators.maxLength(5),
      ]],
      projectMember: [[], [
        Validators.required,
        Validators.maxLength(50),
      ]],
    });

    this.taskForm = this.formBuilder.group({
      createdTasks: this.formBuilder.array([]),
    });

    this.projectForm.valueChanges.subscribe(
      s => console.log(s),
    );

  }

  createTask() {
    this.taskArray = this.createdTasks as FormArray;
    this.taskArray.push(this.createTaskForm());
  }

  // createTask() {
  //   return this.taskService.taskCreate(this.createTaskForm.value).subscribe();
  // }
  //
  //
  // createPlan() {
  //   return this.planService.projectCreate(this.createPlanForm.value).subscribe(success => {
  //     if (!success) {
  //       this.router.navigateByUrl('/dashboard');
  //     }
  //   });

  private createTaskForm(): FormGroup {
    return this.formBuilder.group({
      taskTitle: ['', [
        Validators.required, Validators.minLength(2),
      ]],
      taskDescription: [''],
      taskPriority: ['', Validators.required],
      taskStartDate: [''],
      taskEndDate: [''],
    });
  }
}
