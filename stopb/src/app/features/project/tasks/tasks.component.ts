import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../shared/services/project.service';
import { Project } from '../../../shared/interface/Project';
import { User } from '../../../shared/interface/User';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.scss'],
})
export class TasksComponent implements OnInit {

  project: Project<User> = null;

  constructor(
    private projectService: ProjectService,
  ) {
  }

  ngOnInit(): void {
    this.projectService.activeProject.subscribe(project => {
      this.project = project;
      console.log(project);
    });
  }
}
