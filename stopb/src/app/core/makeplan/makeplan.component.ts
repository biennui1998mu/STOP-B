import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Task } from "../../shared/models/Task";
import { UiStateService } from '../../shared/services/state/ui-state.service';

@Component({
  selector: 'app-makeplan',
  templateUrl: './makeplan.component.html',
  styleUrls: ['./makeplan.component.scss'],
})
export class MakeplanComponent implements OnInit {

  members = new FormControl();
  memberlist: string[] = ['Namhoang Do', 'QHuy', 'Tuananh Nguyen', 'Khue Pham'];
  tasks: Task[] = [];

  constructor(
    private uiStateService: UiStateService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Create Plan',
        path: '/plan/create',
      },
    });
  }

  ngOnInit(): void {
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
