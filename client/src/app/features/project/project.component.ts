import { Component, OnInit } from '@angular/core';
import { Project } from "../../shared/interface/Project";
import { ActivatedRoute } from "@angular/router";
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { filter, switchMap } from 'rxjs/operators';
import { User } from '../../shared/interface/User';
import { ProjectsQuery, ProjectsService } from '../../shared/services/projects';

@Component({
  selector: 'app-readProject',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
})
export class ProjectComponent implements OnInit {
  project: Project<User>;
  projectLoading = this.projectsQuery.selectLoading();

  constructor(
    private uiStateService: UiStateService,
    private projectsService: ProjectsService,
    private projectsQuery: ProjectsQuery,
    private activatedRoute: ActivatedRoute,
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
            title: 'Projects',
            path: '/project/view/' + this.project._id,
          },
        });
      });

    this.projectsQuery.selectActive().subscribe(project => {
      this.project = project;
    });
  }

  get memberCount() {
    const members = this.project?.member.length | 0;
    const moderator = this.project?.moderator.length | 0;
    // 1 as the owner
    return members + moderator + 1;
  }

  ngOnInit(): void {
  }

  readProject(id: string) {
    return this.projectsService.getOne(id, true);
  }
}
