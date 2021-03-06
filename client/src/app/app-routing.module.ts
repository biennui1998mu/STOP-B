import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutsComponent } from './shared/layouts/layouts.component';
import { LoginComponent } from './core/login/login.component';
import { AuthenticateGuard } from './shared/guard/authenticate.guard';
import { AllProjectResolver } from './shared/resolver/all-project.resolver';

const routes: Routes = [
  {
    path: '',
    component: LayoutsComponent,
    canActivateChild: [AuthenticateGuard],
    resolve: {
      projects: AllProjectResolver,
    },
    children: [
      { path: '', pathMatch: 'full', redirectTo: '/project' },
      {
        path: 'project', // lazy load
        loadChildren: () => import('./features/project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'note',
        loadChildren: () => import('./features/note/note.module').then(m => m.NoteModule),
      },
      {
        path: 'friends',
        loadChildren: () => import('./features/friends/friends.module').then(m => m.FriendsModule),
      },
      {
        path: 'account',
        loadChildren: () => import('./features/account/account.module').then(m => m.AccountModule),
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
