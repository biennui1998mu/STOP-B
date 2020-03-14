import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { QnoteComponent } from "./qnote/qnote.component";
import { MakeplanComponent } from "./makeplan/makeplan.component";
import { ReadnoteComponent } from "./readnote/readnote.component";
import { ReadplanComponent } from "./readplan/readplan.component";
import { LayoutsComponent } from './shared/layouts/layouts.component';


const routes: Routes = [
  {
    path: '', component: LayoutsComponent, children: [
      { path: '', redirectTo: '/homepage', pathMatch: 'full' },
      { path: 'homepage', component: HomepageComponent },
      { path: 'quicknote', component: QnoteComponent },
      { path: 'makeplan', component: MakeplanComponent },
      { path: 'readnote', component: ReadnoteComponent },
      { path: 'readplan', component: ReadplanComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
