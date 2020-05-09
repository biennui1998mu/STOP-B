import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { Note } from "../../../shared/interface/Note";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NotesService } from '../../../shared/services/note';

@Component({
  selector: 'app-view-note',
  templateUrl: './view-note.component.html',
  styleUrls: ['./view-note.component.scss'],
})
export class ViewNoteComponent implements OnInit {

  readNoteForm: FormGroup;

  alertDelete: boolean = false;

  constructor(
    private notesService: NotesService,
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
    return this.notesService.getOne(id).subscribe((data: Note) => {
      this.Title.setValue(data.title);
      this.Description.setValue(data.description);
      this.Date.setValue(data.createdAt);
    });
  }

  deleteNote(id: string) {
    return this.notesService.delete(id).subscribe(success => {
      if (success) {
        this.router.navigateByUrl('/dashboard');
      }
    });
  }

  updateNote() {
    return this.notesService.update(
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
