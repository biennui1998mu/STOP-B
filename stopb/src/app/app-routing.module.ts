import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './core/homepage/homepage.component';
import { LayoutsComponent } from './shared/layouts/layouts.component';
import { LoginComponent } from './core/login/login.component';
import { AuthenticateGuard } from "./shared/guard/authenticate.guard";

const routes: Routes = [
  {
    path: '', component: LayoutsComponent, canActivateChild: [AuthenticateGuard], children: [
      { path: '', pathMatch: 'full', redirectTo: '/dashboard' },
      { path: 'dashboard', component: HomepageComponent },
      {
        path: 'project', // lazy load
        loadChildren: () => import('./project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'note',
        loadChildren: () => import('./note/note.module').then(m => m.NoteModule),
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
