import { Component } from '@angular/core';
import { ProjectsQuery } from '../../../shared/services/projects';
import { Project } from '../../../shared/interface/Project';
import { User } from '../../../shared/interface/User';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss'],
})
export class ProjectDashboardComponent {
  project: Project<User>;

  constructor(
    private projectsQuery: ProjectsQuery,
  ) {
    this.projectsQuery.selectActive().subscribe(active => {
      this.project = active;
    });
  }

}
