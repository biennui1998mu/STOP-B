import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { Project, ProjectPriority } from "../../shared/interface/Project";
import { ProjectsService } from '../../shared/services/projects';
import { NotesQuery, NotesService } from '../../shared/services/note';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})

export class HomepageComponent implements OnInit {

  title: string;
  dob: string;

  notes = this.noteQuery.selectAll();
  projects: Project[] = [];

  ProjectPriority = ProjectPriority;

  constructor(
    private uiStateService: UiStateService,
    private noteQuery: NotesQuery,
    private notesService: NotesService,
    private projectService: ProjectsService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Dashboard',
        path: '/dashboard',
      },
    });
  }

  ngOnInit(): void {
    this.notesService.get();
    this.getProjectHighPriority();
  }

  getProjectHighPriority() {
    this.projectService.getImportant().subscribe(result => {
      this.projects = result;
    });
  }
}

