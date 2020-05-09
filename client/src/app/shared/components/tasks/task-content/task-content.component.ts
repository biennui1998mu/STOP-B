import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { User } from '../../../interface/User';
import * as moment from 'moment';
import { MarkdownService } from '../../../services/markdown.service';
import { Task } from '../../../interface/Task';
import { UserQuery } from '../../../services/user';

@Component({
  selector: 'app-task-content',
  templateUrl: './task-content.component.html',
  styleUrls: ['../styles/task-comment.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskContentComponent implements OnInit {

  @Input()
  task: Task<User>;

  userId = this.userQuery.getValue()._id;

  constructor(
    private userQuery: UserQuery,
    private markdownService: MarkdownService,
  ) {
  }

  ngOnInit(): void {
  }

  getTime() {
    if (!this.task?.createdAt && !this.task?.updatedAt) {
      return 'unknown time...';
    }

    if (this.task?.updatedAt) {
      const momentRelative = moment(this.task.updatedAt)
        .fromNow();
      return `last updated ${momentRelative}`;
    }
    const momentRelative = moment(this.task.createdAt)
      .fromNow();

    return `created ${momentRelative}`;
  }

  displayContent() {
    if (this.task?.description) {
      return this.markdownService.toMarkdown(this.task.description);
    }

    return '';
  }
}
