import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './core/homepage/homepage.component';
import { QnoteComponent } from "./core/qnote/qnote.component";
import { MakeplanComponent } from "./core/makeplan/makeplan.component";
import { ReadnoteComponent } from "./readnote/readnote.component";
import { ReadplanComponent } from "./readplan/readplan.component";
import { LayoutsComponent } from './shared/layouts/layouts.component';


const routes: Routes = [
  {
    path: '', component: LayoutsComponent, children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: HomepageComponent },
      { path: 'plan', component: ReadplanComponent },
      { path: 'plan/create', component: MakeplanComponent },
      { path: 'note', component: ReadnoteComponent },
      { path: 'note/create', component: QnoteComponent },
    ],
  },
  { path: '**', redirectTo: '/dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
