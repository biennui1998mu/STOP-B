import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './core/homepage/homepage.component';
import { QnoteComponent } from "./core/qnote/qnote.component";
import { MakePlanComponent } from "./core/makeplan/make-plan.component";
import { ReadnoteComponent } from "./readNote/readnote.component";
import { ReadProjectComponent } from "./readProject/readProject.component";
import { LayoutsComponent } from './shared/layouts/layouts.component';
import { LoginComponent } from './core/login/login.component';
import { AuthenticateGuard } from "./shared/guard/authenticate.guard";

const routes: Routes = [
  {
    path: '', component: LayoutsComponent, canActivateChild: [AuthenticateGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
      { path: 'dashboard', component: HomepageComponent },
      { path: 'plan/create', component: MakePlanComponent },
      { path: 'plans/view/:id', component: ReadProjectComponent },
      { path: 'notes/create', component: QnoteComponent },
      { path: 'notes/view/:id', component: ReadnoteComponent },
    ],
  },
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/dashboard' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
