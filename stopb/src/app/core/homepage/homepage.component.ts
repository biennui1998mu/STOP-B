import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { HttpClient } from "@angular/common/http";
import { Note } from "../../shared/interface/Note";
import { NoteService } from "../../shared/services/note.service";
import { ProjectService } from "../../shared/services/project.service";
import { Project } from "../../shared/interface/Project";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
})

export class HomepageComponent implements OnInit {

  title: string;
  dob: string;

  notes: Note[] = [];
  projects: Project[] = [];

  constructor(
    private uiStateService: UiStateService,
    private http: HttpClient,
    private noteService: NoteService,
    private projectService: ProjectService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Dashboard',
        path: '/dashboard',
      },
    });
  }

  ngOnInit(): void {
    this.getNote();
    this.getProjectHighPriority();
  }

  getNote() {
    this.noteService.getAllNote().subscribe(result => {
      this.notes = result.notes;
    });
  }

  getProjectHighPriority() {
    this.projectService.getProjectHighPriority().subscribe( result => {
      this.projects = result;
    });
  }
}

