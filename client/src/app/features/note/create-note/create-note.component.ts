import { Component } from '@angular/core';
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjectsQuery, ProjectsService } from '../../../shared/services/projects';
import { NotesService } from '../../../shared/services/note';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss'],
})
export class CreateNoteComponent {

  createNoteFrom: FormGroup;
  projects = this.projectsQuery.selectAll();

  constructor(
    private uiStateService: UiStateService,
    private notesService: NotesService,
    private formBuilder: FormBuilder,
    private router: Router,
    private projectService: ProjectsService,
    private projectsQuery: ProjectsQuery,
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

  createNote() {
    return this.notesService.create(this.createNoteFrom.value)
      .subscribe(success => {
        if (success) {
          this.router.navigateByUrl('/dashboard');
        }
      });
  }
}
