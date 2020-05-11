import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewNoteComponent } from './view-note/view-note.component';
import { AllNotesComponent } from './all-notes/all-notes.component';


const routes: Routes = [
  {
    path: '', children: [
      { path: '', pathMatch: 'full', component: AllNotesComponent },
      { path: 'view/:id', component: ViewNoteComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoteRoutingModule {
}
