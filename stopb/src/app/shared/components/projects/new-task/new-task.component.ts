import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Task } from '../../../models/Task';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss'],
})
export class NewTaskComponent implements OnInit {

  isEditable = true;

  @Input()
  task: Task;

  @Output()
  taskUpdated: EventEmitter<Task> = new EventEmitter();

  _task: Task;

  constructor() {
  }

  ngOnInit(): void {
    this._task = this.task;
  }

  removeTask() {
    this.taskUpdated.emit(null);
  }

  updatedValue(newTitle: string) {
    this._task = Object.assign(
      {},
      this.task,
      { title: newTitle },
    );
  }

  toggleEdit() {
    this.isEditable = !this.isEditable;
    if (!this.isEditable) {
      this.taskUpdated.emit(this._task);
    }
  }
}
