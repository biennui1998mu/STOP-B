import { Component, OnInit } from '@angular/core';
import { NoteService } from "../../../shared/services/note.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Note } from "../../../shared/interface/Note";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: 'app-view-note',
  templateUrl: './view-note.component.html',
  styleUrls: ['./view-note.component.scss'],
})
export class ViewNoteComponent implements OnInit {

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
      Title: ['', [Validators.required, Validators.minLength(2)]],
      Date: [''],
      Description: [''],
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

  get Title() {
    return this.readNoteForm.get('Title');
  }

  get Date() {
    return this.readNoteForm.get('Date');
  }

  get Description() {
    return this.readNoteForm.get('Description');
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
      this.Title.setValue(data.Title);
      this.Description.setValue(data.Description);
      this.Date.setValue(data.StartDate);
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
