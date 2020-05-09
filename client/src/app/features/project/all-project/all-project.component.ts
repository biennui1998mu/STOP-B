import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { ProjectsQuery } from '../../../shared/services/projects';

@Component({
  selector: 'app-all-project',
  templateUrl: './all-project.component.html',
  styleUrls: ['./all-project.component.scss'],
})
export class AllProjectComponent implements OnInit {
  projects = this.projectsQuery.selectAll();

  constructor(
    private uiStateService: UiStateService,
    private projectsQuery: ProjectsQuery,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Projects',
        path: '/project',
      },
    });
  }

  ngOnInit(): void {
  }

}
