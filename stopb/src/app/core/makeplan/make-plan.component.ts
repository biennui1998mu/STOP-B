import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from "../../shared/models/Task";
import { UiStateService } from '../../shared/services/state/ui-state.service';
import {ProjectService} from "../../services/project.service";
import {Router} from "@angular/router";
import {TaskService} from "../../services/task.service";

@Component({
  selector: 'app-makePlan',
  templateUrl: './make-plan.component.html',
  styleUrls: ['./make-plan.component.scss'],
})
export class MakePlanComponent implements OnInit {

  memberList: string[] = ['Namhoang Do', 'QHuy', 'Tuananh Nguyen', 'Khue Pham', 'Son Goku'];
  tasks: Task[] = [];

  createPlanForm: FormGroup;
  createTaskForm: FormGroup;

  constructor(
    private uiStateService: UiStateService,
    private formBuilder: FormBuilder,
    private planService: ProjectService,
    private taskService: TaskService,
    private router: Router
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Create Plan',
        path: '/plan/create',
      },
    });
  }

  ngOnInit(): void {
    this.createPlanForm = this.formBuilder.group({
      planTitle: ['', [Validators.required, Validators.minLength(2)]],
      planPriority: ['', [Validators.required]],
      planDate: ['', [Validators.required]],
      planMember: ['', [Validators.required]],
    });
    this.createTaskForm = this.formBuilder.group(({
      _id: [''],
      taskTitle: ['', [Validators.required, Validators.minLength(2)]],
      taskPara: ['']
    }))
  }

  get planTitle() {
    return this.createPlanForm.get('planTitle');
  }

  get planPriority() {
    return this.createPlanForm.get('planPriority');
  }

  get planDate() {
    return this.createPlanForm.get('planDate');
  }

  get planMember() {
    return this.createPlanForm.get('planMember');
  }

  get taskTitle() {
    return this.createTaskForm.get('taskTitle');
  }

  get taskPara() {
    return this.createTaskForm.get('taskPara');
  }

  addTask() {
    this.tasks.push({
      title: '',
    });
  }

  updateTask(newVal: Task, index: number) {
    console.log(newVal);
    if (newVal) {
      this.tasks.splice(index, 1, newVal);
    } else {
      this.tasks.splice(index, 1);
    }
  }

  createTask(){
    return this.taskService.taskCreate(this.createTaskForm.value).subscribe()
  }


  createPlan(){
      return this.planService.projectCreate(this.createPlanForm.value).subscribe( success => {
        if (!success) {
          this.router.navigateByUrl('/dashboard');
        }
      })
  }
}
