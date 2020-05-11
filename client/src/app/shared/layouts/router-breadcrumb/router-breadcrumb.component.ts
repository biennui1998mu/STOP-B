import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Breadcrumb } from '../../models/Breadcrumb';
import { UiStateService } from '../../services/state/ui-state.service';
import { AccountMenuComponent } from '../account-menu/account-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { UserQuery } from '../../services/user';
import {
  ActionDialog,
  CreateNoteComponent,
  CreateNoteDialogData,
} from '../../../features/note/create-note/create-note.component';
import { Project } from '../../interface/Project';
import { NotesService } from '../../services/note';
import { Note, NOTE_STATUS } from '../../interface/Note';

@Component({
  selector: 'app-router-breadcrumb',
  templateUrl: './router-breadcrumb.component.html',
  styleUrls: ['./router-breadcrumb.component.scss'],
})
export class RouterBreadcrumbComponent {

  breadcrumbState: Observable<Breadcrumb>;
  user = this.userQuery.select();

  constructor(
    private dialog: MatDialog,
    private uiStateService: UiStateService,
    private notesService: NotesService,
    private userQuery: UserQuery,
  ) {
    this.breadcrumbState = this.uiStateService.pageTitle;
  }

  openDialogSetting(): void {
    this.dialog.open(AccountMenuComponent, {
      position: {
        top: `calc(4rem + 2px)`,
        right: `1rem`,
      },
      width: '200px',
      backdropClass: `bg-transparent`,
      panelClass: `setting-modal-box`,
    });
  }

  openNote() {
    this.dialog.open<CreateNoteComponent,
      CreateNoteDialogData<Project>,
      CreateNoteDialogData<Project>>(
      CreateNoteComponent, {
        panelClass: ['create-note-dialog'],
        data: {
          action: ActionDialog.create,
        },
      },
    ).afterClosed().subscribe(decision => {
      if (decision) {
        if (decision.action === ActionDialog.create) {
          const noteCreate: Note = {
            title: decision.data.title,
            description: decision.data.description,
            priority: decision.data.priority,
            status: NOTE_STATUS.doing,
            user: this.userQuery.getValue()._id,
            project: decision.data.project,
          };
          return this.notesService.create(noteCreate)
            .subscribe(success => {
              console.log(success);
            });
        }
      }
    });
  }
}
