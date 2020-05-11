import { Component, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProjectsQuery } from '../../../shared/services/projects';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Note, NOTE_Primary } from '../../../shared/interface/Note';
import { Project } from '../../../shared/interface/Project';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
  styleUrls: ['./create-note.component.scss'],
})
export class CreateNoteComponent implements OnDestroy {

  createNoteFrom: FormGroup;
  projects = this.projectsQuery.selectAll();
  date = new Date();
  dateInterval;
  ActionDialog = ActionDialog;
  NOTE_Primary = NOTE_Primary;

  constructor(
    @Inject(MAT_DIALOG_DATA) public noteData: CreateNoteDialogData<Project>,
    public dialogRef: MatDialogRef<CreateNoteComponent>,
    private formBuilder: FormBuilder,
    private projectsQuery: ProjectsQuery,
  ) {
    this.createNoteFrom = this.formBuilder.group({
      title: [
        noteData.data?.title, [
          Validators.required, Validators.minLength(2),
        ],
      ],
      description: [
        noteData.data?.description,
      ],
      priority: [
        noteData.data?.priority | 0,
        [
          Validators.required,
        ],
      ],
      project: [noteData.data?.project?._id],
    });

    if (this.noteData.action === ActionDialog.update) {
      this.date = this.noteData.data.createdAt;
    } else {
      this.dateInterval = setInterval(() => {
        this.date = new Date();
      }, 1000);
    }
  }

  get title() {
    return this.createNoteFrom.get('title');
  }

  get description() {
    return this.createNoteFrom.get('description');
  }

  get priority() {
    return this.createNoteFrom.get('priority');
  }

  get project() {
    return this.createNoteFrom.get('project');
  }

  ngOnDestroy() {
    if (this.dateInterval) {
      clearInterval(this.dateInterval);
    }
  }

  cancel() {
    this.dialogRef.close({
      action: ActionDialog.cancel,
      data: null,
    });
  }

  update() {
    this.dialogRef.close({
      action: ActionDialog.update,
      data: this.createNoteFrom.value,
    });
  }

  createNote() {
    this.dialogRef.close({
      action: ActionDialog.create,
      data: this.createNoteFrom.value,
    });
  }

  delete() {
    this.dialogRef.close({
      action: ActionDialog.delete,
      data: null,
    });
  }
}

export enum ActionDialog {
  create,
  update,
  delete,
  cancel,
}

export interface CreateNoteDialogData<project> {
  action: ActionDialog,
  data?: Partial<Note<project, any>>,
}
