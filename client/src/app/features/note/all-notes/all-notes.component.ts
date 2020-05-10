import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { NotesQuery, NotesService } from '../../../shared/services/note';
import { Observable } from 'rxjs';
import { Note } from '../../../shared/interface/Note';
import { Project } from '../../../shared/interface/Project';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.scss'],
})
export class AllNotesComponent implements OnInit {

  notes: Observable<Note<Project>[]> = this.notesQuery.selectAll();

  constructor(
    private uiStateService: UiStateService,
    private notesService: NotesService,
    private notesQuery: NotesQuery,
  ) {
    this.notesService.get();
    this.uiStateService.setPageTitle({
      current: {
        title: 'Notes',
        path: '/note',
      },
    });
  }

  ngOnInit(): void {
  }

}
