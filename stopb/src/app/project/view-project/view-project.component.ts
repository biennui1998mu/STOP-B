import { Component, OnInit } from '@angular/core';
import { Project } from "../../shared/interface/Project";
import { ProjectService } from "../../shared/services/project.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Task } from '../../shared/interface/Task';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-readProject',
  templateUrl: './view-project.component.html',
  styleUrls: ['./view-project.component.scss'],
})
export class ViewProjectComponent implements OnInit {

  project: Project = null;
  formTask: Task = null;

  inputTaskField: boolean;

  arr = new Array(14);

  constructor(
    private planService: ProjectService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private uiStateService: UiStateService,
  ) {
    this.activatedRoute.paramMap
      .pipe(
        switchMap(params => {
          const id = params.get('id');
          return this.readProject(id);
        }),
        filter(s => !!s),
      )
      .subscribe((project: Project) => {
        this.project = project;
        this.uiStateService.setPageTitle({
          current: {
            title: 'Projects - ' + this.project.projectTitle,
            path: '/project/view/' + this.project._id,
          },
        });
      });
    this.inputTaskField = true;
  }

  ngOnInit(): void {
  }

  getInputTaskFieldActivate() {
    this.inputTaskField = false;
  }

  getInputTaskFieldDisable() {
    this.inputTaskField = true;
  }

  readProject(id: string) {
    return this.planService.readProject(id);
  }
}
