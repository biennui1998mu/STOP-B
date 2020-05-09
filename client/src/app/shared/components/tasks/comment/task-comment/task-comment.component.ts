import { Component, Input, OnInit } from '@angular/core';
import { CommentIssue } from '../../../../interface/CommentIssue';
import { Task } from '../../../../interface/Task';
import { User } from '../../../../interface/User';
import { Project } from '../../../../interface/Project';
import { UserQuery } from '../../../../services/user';

@Component({
  selector: 'app-task-comment',
  templateUrl: './task-comment.component.html',
  styleUrls: ['../../styles/task-comment.scss'],
})
export class TaskCommentComponent implements OnInit {

  @Input()
  comment: CommentIssue<Task, User>;

  @Input()
  task: Task<User, Project>;

  userId = this.userQuery.getValue()._id;

  constructor(
    private userQuery: UserQuery,
  ) {
  }

  ngOnInit(): void {
  }

}
