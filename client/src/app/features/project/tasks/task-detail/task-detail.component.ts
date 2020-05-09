import { Component, OnInit } from '@angular/core';
import { Task } from '../../../../shared/interface/Task';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../../../../shared/interface/User';
import { Project } from '../../../../shared/interface/Project';
import { filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TasksService } from '../../../../shared/services/task';
import { UserQuery } from '../../../../shared/services/user';
import { ProjectsQuery } from '../../../../shared/services/projects';
import { CommentsQuery } from '../../../../shared/services/task-comments';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['../style/shared-task-layout.scss'],
})
export class TaskDetailComponent implements OnInit {

  task: Task<User, Project>;
  project: Project<User> = null;
  isLoading: boolean = false;
  userId = this.userQuery.getValue()._id;

  comments = this.commentsQuery.selectAll();

  constructor(
    private userQuery: UserQuery,
    private taskService: TasksService,
    private projectsQuery: ProjectsQuery,
    private commentsQuery: CommentsQuery,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.projectsQuery.selectActive()
      .pipe(
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
      )
      .subscribe(task => {
        if (!task) {
          this.router.navigate(['/project', 'view', this.project._id]);
          return;
        }
        this.isLoading = true;
        console.log(task);
        this.task = task;
      });
  }

  ngOnInit(): void {
  }

}
