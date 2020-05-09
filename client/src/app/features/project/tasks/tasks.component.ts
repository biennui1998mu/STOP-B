import { Component, OnInit } from '@angular/core';
import { Project } from '../../../shared/interface/Project';
import { User } from '../../../shared/interface/User';
import { Task } from '../../../shared/interface/Task';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { TasksQuery, TasksService } from '../../../shared/services/task';
import { ProjectsQuery } from '../../../shared/services/projects';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {

  project: Project<User> = null;
  ongoingTasks = 0;
  finishedTasks = 0;
  tasks: Task<User>[] = [];

  projectLoading = this.projectsQuery.selectLoading();
  taskLoading = this.taskQueue.selectLoading();

  constructor(
    private projectsQuery: ProjectsQuery,
    private taskService: TasksService,
    private taskQueue: TasksQuery,
  ) {
    this.taskQueue.selectAll().subscribe(
      tasks => this.tasks = tasks,
    );
  }

  ngOnInit(): void {
    this.projectsQuery.selectActive()
      .pipe(
        switchMap(project => {
          this.project = project;

          if (project) {
            return this.taskService.get(project);
          }
          return of(null);
        }),
      ).subscribe(refreshed => {
      if (refreshed) {
        this.ongoingTasks = refreshed.ongoingCount;
        this.finishedTasks = refreshed.finishedCount;
      }
    });
  }
}
