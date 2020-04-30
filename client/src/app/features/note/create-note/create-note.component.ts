import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { NoteService } from "../../../shared/services/note.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { TokenService } from "../../../shared/services/token.service";
import { ProjectService } from "../../../shared/services/project.service";
import { Project } from "../../../shared/interface/Project";

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss'],
})
export class CreateNoteComponent implements OnInit {

  createNoteFrom: FormGroup;
  projects: Project[];

  constructor(
    private uiStateService: UiStateService,
    private noteService: NoteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private projectService: ProjectService,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Quick Note',
        path: '/note/create',
      },
    });
    this.createNoteFrom = this.formBuilder.group({
      Title: ['', [Validators.required, Validators.minLength(2)]],
      Description: [''],
      Priority: [''],
      ProjectId: [''],
    });

  }

  get Title() {
    return this.createNoteFrom.get('Title');
  }

  get Description() {
    return this.createNoteFrom.get('Description');
  }

  get Priority() {
    return this.createNoteFrom.get('Priority');
  }

  get ProjectId() {
    return this.createNoteFrom.get('ProjectId');
  }

  ngOnInit(): void {
    this.getAllProject();
  }

  createNote() {
    return this.noteService.noteCreate(this.createNoteFrom.value).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  getAllProject() {
    this.projectService.refreshProjects();
    this.projectService.projects.subscribe(projects => {
      this.projects = projects;
    });
  }
}
