import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../shared/services/state/ui-state.service';
import { NoteService } from "../../services/note.service";
import { Router } from "@angular/router";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-qnote',
  templateUrl: './qnote.component.html',
  styleUrls: ['./qnote.component.scss'],
})
export class QnoteComponent implements OnInit {

  createNoteFrom: FormGroup;
  private url = 'http://localhost:3000';

  constructor(
    private uiStateService: UiStateService,
    private generalService: NoteService,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.uiStateService.setPageTitle({
      current: {
        title: 'Quick Note',
        path: '/note/create',
      },
    });
    this.createNoteFrom = this.formBuilder.group({
      _id: [''],
      noteTitle: ['', [Validators.required, Validators.minLength(2)]],
      noteDate: ['', [Validators.required]],
      notePara: [''],
      notePriority: [''],
    });

  }

  get noteTitle() {
    return this.createNoteFrom.get('noteTitle');
  }

  get noteDate() {
    return this.createNoteFrom.get('noteDate');
  }

  get notePara() {
    return this.createNoteFrom.get('notePara');
  }

  get notePriority() {
    return this.createNoteFrom.get('notePriority');
  }

  get noteId() {
    return this.createNoteFrom.get('_id');
  }

  ngOnInit(): void {
  }

  CreateNote() {
    return this.generalService.noteCreate(this.createNoteFrom.value).subscribe(succes => {
      console.log(succes);
      if (succes) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

}
