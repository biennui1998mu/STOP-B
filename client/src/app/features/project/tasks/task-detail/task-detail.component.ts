import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../../shared/services/task.service';
import { Task } from '../../../../shared/interface/Task';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../shared/services/project.service';
import { User } from '../../../../shared/interface/User';
import { Project } from '../../../../shared/interface/Project';
import { filter, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TokenService } from '../../../../shared/services/token.service';
import { TaskCommentService } from '../../../../shared/services/task-comment.service';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['../style/shared-task-layout.scss'],
})
export class TaskDetailComponent implements OnInit {

  task: Task<User, Project>;
  project: Project<User> = null;
  isLoading: boolean = false;
  userId = this.tokenService.user._id;

  comments = this.commentService.comments;

  constructor(
    private taskService: TaskService,
    private activatedRoute: ActivatedRoute,
    private projectService: ProjectService,
    private tokenService: TokenService,
    private commentService: TaskCommentService,
    private router: Router,
  ) {
    this.projectService.activeProject
      .pipe(
        filter(project => !!project),
        switchMap((project) => {
          this.project = project;
          return this.activatedRoute.paramMap;
        }),
        switchMap(params => {
          if (params.has('indicator')) {
            const indicator = params.get('indicator');
            return this.taskService.viewTask(
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
