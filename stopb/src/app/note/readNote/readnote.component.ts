import { Component, OnInit } from '@angular/core';
import { NoteService } from "../../shared/services/note.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Note } from "../../shared/interface/Note";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-readnote',
  templateUrl: './readnote.component.html',
  styleUrls: ['./readnote.component.scss'],
})
export class ReadnoteComponent implements OnInit {

  readNoteForm: FormGroup;

  alertDelete: boolean = false;

  constructor(
    private noteService: NoteService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.readNoteForm = this.formBuilder.group({
      _id: [''],
      noteTitle: ['', [Validators.required, Validators.minLength(2)]],
      noteDate: [''],
      noteDescription: [''],
    });

    console.log(this.activatedRoute);
    this.activatedRoute.paramMap.subscribe(param => {
      const id = param.get('id');
      if (!id) {
        // trong truong hop k co id tren url thi tu ve dashboard
        this.router.navigateByUrl('/dashboard');
      } else {
        this.noteId.setValue(id);
        this.readNote(id);
      }
    });
  }

  get noteTitle() {
    return this.readNoteForm.get('noteTitle');
  }

  get noteDate() {
    return this.readNoteForm.get('noteDate');
  }

  get noteDescription() {
    return this.readNoteForm.get('noteDescription');
  }

  get noteId() {
    return this.readNoteForm.get('_id');
  }

  ngOnInit(): void {
    this.readNoteForm.valueChanges.subscribe(data => {
      // console.log(data);
      console.log(this.readNoteForm.invalid);
    });
  }

  readNote(id: string) {
    return this.noteService.readNote(id).subscribe((data: Note) => {
      this.noteTitle.setValue(data.noteTitle);
      this.noteDescription.setValue(data.noteDescription);
      this.noteDate.setValue(data.noteStartDate);
    });
  }

  deleteNote(id: string) {
    return this.noteService.deleteNote(id).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  updateNote() {
    return this.noteService.updateNote(
      this.noteId.value,
      this.readNoteForm.value,
    ).subscribe(updated => {
      console.log(updated);
      if (updated) {

        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  showAlertDelete() {
    this.alertDelete = true;
  }

  hideAlertDelete() {
    this.alertDelete = false;
  }
}
