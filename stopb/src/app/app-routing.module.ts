import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './core/homepage/homepage.component';
import { QnoteComponent } from "./core/qnote/qnote.component";
import { CreateProjectComponent } from "./core/create-project/create-project.component";
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
      {
        path: 'project', children: [
          { path: 'create', component: CreateProjectComponent },
          { path: 'view/:id', component: ReadProjectComponent },
        ],
      },
      {
        path: 'note', children: [
          { path: 'create', component: QnoteComponent },
          { path: 'view/:id', component: ReadnoteComponent },
        ],
      },
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
