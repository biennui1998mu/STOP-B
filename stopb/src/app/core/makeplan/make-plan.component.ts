import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task } from "../../shared/models/Task";
import { UiStateService } from '../../shared/services/state/ui-state.service';

@Component({
  selector: 'app-makePlan',
  templateUrl: './make-plan.component.html',
  styleUrls: ['./make-plan.component.scss'],
})
export class MakePlanComponent implements OnInit {

  memberList: string[] = ['Namhoang Do', 'QHuy', 'Tuananh Nguyen', 'Khue Pham', 'Son Goku'];
  tasks: Task[] = [];

  createPlanForm: FormGroup;

  constructor(
    private uiStateService: UiStateService,
    private formBuilder: FormBuilder,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Create Plan',
        path: '/plan/create',
      },
    });
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

  ngOnInit(): void {
    this.createPlanForm = this.formBuilder.group({
      planTitle: ['', [Validators.required, Validators.minLength(2)]],
      planPriority: ['', [Validators.required]],
      planDate: ['', [Validators.required]],
      planMember: ['', [Validators.required]],
    });
  }

  addTask() {
    this.tasks.push({
      title: '',
    });
  }

  updateTask(newVal: Task, index: number) {
    if (newVal) {
      this.tasks.splice(index, 1, newVal);
    } else {
      this.tasks.splice(index, 1);
    }
  }
}
