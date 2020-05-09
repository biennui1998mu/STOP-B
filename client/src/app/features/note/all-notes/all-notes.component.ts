import { Component, OnInit } from '@angular/core';
import { UiStateService } from '../../../shared/services/state/ui-state.service';
import { NotesQuery, NotesService } from '../../../shared/services/note';

@Component({
  selector: 'app-all-notes',
  templateUrl: './all-notes.component.html',
  styleUrls: ['./all-notes.component.scss'],
})
export class AllNotesComponent implements OnInit {

  notes = this.notesQuery.selectAll();

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
