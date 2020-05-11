import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NoteRoutingModule } from './note-routing.module';
import { AllNotesComponent } from './all-notes/all-notes.component';
import { CreateNoteComponent } from './create-note/create-note.component';
import { ViewNoteComponent } from './view-note/view-note.component';
import { CoreImportsModule } from '../../shared/modules/core-imports.module';
import { MaterialCompsModule } from '../../shared/modules/material-comps.module';


@NgModule({
  declarations: [
    AllNotesComponent,
    CreateNoteComponent,
    ViewNoteComponent,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
    NoteRoutingModule,
    MaterialCompsModule,
  ],
})
export class NoteModule {
}
