import { Component } from '@angular/core';
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { NotesQuery, NotesService } from '../../../shared/services/note';
import { Observable } from 'rxjs';
import { Note, NOTE_STATUS } from '../../../shared/interface/Note';
import { Project } from '../../../shared/interface/Project';
import { ActionDialog, CreateNoteComponent, CreateNoteDialogData } from '../create-note/create-note.component';
import { MatDialog } from '@angular/material/dialog';
import { UserQuery } from '../../../shared/services/user';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.scss'],
})
export class AllNotesComponent {

  notes: Observable<Note<Project>[]> = this.notesQuery.selectAll();

  constructor(
    private uiStateService: UiStateService,
    private notesService: NotesService,
    private notesQuery: NotesQuery,
    private userQuery: UserQuery,
    private dialog: MatDialog,
  ) {
    this.notesService.get();
    this.uiStateService.setPageTitle({
      current: {
        title: 'Notes',
        path: '/note',
      },
    });
  }

  deleteNote(note: Note<Project>) {
    this.notesService.delete(note._id).subscribe(
      data => {
        console.log(data);
      },
    );
  }

  editNote(note: Note<Project>) {
    this.dialog.open<CreateNoteComponent,
      CreateNoteDialogData<Project>,
      CreateNoteDialogData<Project>>(
      CreateNoteComponent, {
        panelClass: ['create-note-dialog'],
        data: {
          action: ActionDialog.update,
          data: note,
        },
      },
    ).afterClosed().subscribe(decision => {
      if (decision) {
        if (decision.action === ActionDialog.update) {
          const noteCreate: Note = {
            title: decision.data.title,
            description: decision.data.description,
            priority: decision.data.priority,
            status: NOTE_STATUS.doing,
            user: this.userQuery.getValue()._id,
            project: decision.data.project,
          };
          return this.notesService.update(note._id, noteCreate)
            .subscribe(success => {
              console.log(success);
            });
        }
      }
    });
  }

  shortName(project: Project) {
    const splitName = project.title.split(/[\s\-]/g);
    let firstChar: string;
    let secondChar: string;
    if (splitName.length > 1) {
      firstChar = splitName[0][0];
      secondChar = splitName[1][0];
    } else {
      firstChar = project.title[0];
      secondChar = project.title[1];
    }
    return (firstChar + secondChar).toUpperCase();
  }
}
