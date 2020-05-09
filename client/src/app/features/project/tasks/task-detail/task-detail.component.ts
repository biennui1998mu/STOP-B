import { Component } from '@angular/core';
import { Task, TASK_STATUS } from '../../../../shared/interface/Task';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../shared/interface/User';
import { Project } from '../../../../shared/interface/Project';
import { filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TasksQuery, TasksService } from '../../../../shared/services/task';
import { UserQuery } from '../../../../shared/services/user';
import { ProjectsQuery } from '../../../../shared/services/projects';
import { CommentsQuery, CommentsService } from '../../../../shared/services/task-comments';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['../style/shared-task-layout.scss'],
})
export class TaskDetailComponent {

  task: Task<User, Project>;
  project: Project<User> = null;
  isLoading: boolean = false;
  userId = this.userQuery.getValue()._id;

  comments = this.commentsQuery.selectAll();

  TASK_STATUS = TASK_STATUS;

  constructor(
    private userQuery: UserQuery,
    private taskService: TasksService,
    private tasksQuery: TasksQuery,
    private projectsQuery: ProjectsQuery,
    private commentsQuery: CommentsQuery,
    private commentsService: CommentsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.projectsQuery.selectActive().pipe(
      filter(project => !!project),
      switchMap((project) => {
        this.project = project;
        return this.activatedRoute.paramMap;
      }),
      switchMap(params => {
        if (params.has('indicator')) {
          const indicator = params.get('indicator');
          return this.taskService.getOne(
            indicator,
            this.project,
          );
        }
        return of(null as Task<User, Project>);
      }),
    ).subscribe(task => {
      console.log('hi');
      if (!task) {
        this.router.navigate(['/project', 'view', this.project._id]);
        return;
      }
      this.isLoading = true;
    });

    this.tasksQuery.selectActive().pipe(
      filter(t => !!t),
    ).subscribe(task => {
      this.task = task;
      this.commentsService.get(
        this.task._id,
        this.project._id,
      );
    });
  }

  reOpen() {
    this.taskService.changeStatus(
      this.task._id,
      this.project._id,
      TASK_STATUS.open,
    ).subscribe(response => {
      this.task = response;
    });
  }
}
