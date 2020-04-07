import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { NoteService } from "../../services/note.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {TokenService} from "../../services/token.service";

import * as jwtDecode from 'jwt-decode';
import {ProjectService} from "../../services/project.service";
import {Project} from "../../shared/interface/Project";

@Component({
  selector: 'app-qnote',
  templateUrl: './qnote.component.html',
  styleUrls: ['./qnote.component.scss'],
})
export class QnoteComponent implements OnInit {

  createNoteFrom: FormGroup;
  projects: Project[];

  private url = 'http://localhost:3000';

  private token = this.tokenService.getToken();
  private tokenDecoded = jwtDecode(this.token);
  private noteUserId = this.tokenDecoded.userId;

  constructor(
    private uiStateService: UiStateService,
    private noteService: NoteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private projectService: ProjectService
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Quick Note',
        path: '/note/create',
      },
    });
    this.createNoteFrom = this.formBuilder.group({
      noteUserId: [this.noteUserId],
      noteTitle: ['', [Validators.required, Validators.minLength(2)]],
      noteDescription: [''],
      notePriority: [''],
      noteProjectId: ['']
    });

  }

  get noteTitle() {
    return this.createNoteFrom.get('noteTitle');
  }

  get noteDescription() {
    return this.createNoteFrom.get('noteDescription');
  }

  get notePriority() {
    return this.createNoteFrom.get('notePriority');
  }

  get noteProjectId() {
    return this.createNoteFrom.get('noteProjectId');
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

  getAllProject(){
    return this.projectService.getAllProject().subscribe(projects => {
      this.projects = projects.projects;
    })
  }
}
