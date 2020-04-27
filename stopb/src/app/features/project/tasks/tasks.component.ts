import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../shared/services/project.service';
import { Project } from '../../../shared/interface/Project';
import { User } from '../../../shared/interface/User';
import { TaskService } from '../../../shared/services/task.service';
import { Task } from '../../../shared/interface/Task';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

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

  projectLoading = this.projectService.activeProjectLoading;
  taskLoading = this.taskService.tasksLoading;

  constructor(
    private projectService: ProjectService,
    private taskService: TaskService,
  ) {
    this.taskService.tasks.subscribe(
      tasks => this.tasks = tasks,
    );
  }

  ngOnInit(): void {
    this.projectService.activeProject
      .pipe(
        switchMap(project => {
          this.project = project;

          if (project) {
            return this.taskService.refreshTasks(project);
          }
          return of(null);
        }),
      ).subscribe(refreshed => {
      console.log(refreshed);
      if (refreshed) {
        this.ongoingTasks = refreshed.ongoingCount;
        this.finishedTasks = refreshed.finishedCount;
      }
    });
  }
}
