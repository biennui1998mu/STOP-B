import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Project } from 'src/app/shared/interface/Project';
import { ProjectsQuery } from '../../../shared/services/projects';
import { User } from '../../../shared/interface/User';

@Component({
  selector: 'app-project-options',
  templateUrl: './project-options.component.html',
  styleUrls: ['./project-options.component.scss'],
})
export class ProjectOptionsComponent implements OnInit {
  project: Project<User>;

  constructor(
    private dialog: MatDialog,
    private projectsQuery: ProjectsQuery,
  ) {
    this.projectsQuery.selectActive().subscribe(
      project => {
        this.project = project;
      },
    );
  }

  ngOnInit(): void {
  }
}
