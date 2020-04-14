import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { NoteService } from "../../shared/services/note.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {TokenService} from "../../shared/services/token.service";

import * as jwtDecode from 'jwt-decode';
import {ProjectService} from "../../shared/services/project.service";
import {Project} from "../../shared/interface/Project";

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss'],
})
export class CreateNoteComponent implements OnInit {

  createNoteFrom: FormGroup;
  projects: Project[];

  userId: string;

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
      noteUserId: [this.userId],
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
    this.getUserId();
  }

  getUserId(){
    const tokenDecoded = this.tokenService.decodeJwt();
    this.userId = tokenDecoded.userId;
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
