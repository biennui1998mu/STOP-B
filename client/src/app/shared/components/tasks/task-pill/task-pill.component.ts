import { Component, Input, OnInit } from '@angular/core';
import { Task } from '../../../interface/Task';
import { User } from '../../../interface/User';
import { Project } from '../../../interface/Project';
import { MarkdownService } from '../../../services/markdown.service';

@Component({
  selector: 'app-task-pill',
  templateUrl: './task-pill.component.html',
  styleUrls: ['./task-pill.component.scss'],
})
export class TaskPillComponent implements OnInit {

  @Input()
  task: Task<User>;

  @Input()
  project: Project<User>;

  constructor(
    /**
     * Todo: create function that remove markdown prefix
     */
    private markdownService: MarkdownService,
  ) {
  }

  ngOnInit(): void {
  }

  getBrief() {
    if (this.task?.description?.length > 0) {
      return this.task.description.slice(0, 15);
    }
    return false;
  }
}
