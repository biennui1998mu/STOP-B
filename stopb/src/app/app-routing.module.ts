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
        path: 'projects', // lazy load
        loadChildren: () => import('./features/project/project.module').then(m => m.ProjectModule),
      },
      {
        path: 'notes',
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
