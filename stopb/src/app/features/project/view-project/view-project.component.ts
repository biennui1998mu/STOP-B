import { Component, OnInit } from '@angular/core';
import { Project } from "../../../shared/interface/Project";
import { ProjectService } from "../../../shared/services/project.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { filter, switchMap } from 'rxjs/operators';
import { User } from '../../../shared/interface/User';

@Component({
  selector: 'app-readProject',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss'],
})
export class ViewProjectComponent implements OnInit {
  project: Project<User>;
  projectLoading = this.projectService.activeProjectLoading;

  constructor(
    private activatedRoute: ActivatedRoute,
    private uiStateService: UiStateService,
    private projectService: ProjectService,
    private router: Router,
  ) {
    this.activatedRoute.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          return this.readProject(id);
        }),
        filter(s => !!s),
      )
      .subscribe((project: Project<User>) => {
        this.project = project;
        this.uiStateService.setPageTitle({
          current: {
            title: 'Projects - ' + this.project.title,
            path: '/project/view/' + this.project._id,
          },
        });
      });
  }

  ngOnInit(): void {
  }

  readProject(id: string) {
    return this.projectService.viewProject(id);
  }
}
