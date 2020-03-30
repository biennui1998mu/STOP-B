import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomepageComponent } from './core/homepage/homepage.component';
import { QnoteComponent } from "./core/qnote/qnote.component";
import { MakeplanComponent } from "./core/makeplan/makeplan.component";
import { ReadnoteComponent } from "./readnote/readnote.component";
import { ReadplanComponent } from "./readplan/readplan.component";
import { LayoutsComponent } from './shared/layouts/layouts.component';
import { LoginComponent } from './core/login/login.component';
import {AuthenticateGuard} from "./shared/guard/authenticate.guard";
import {AccountComponent} from "./shared/components/account/account.component";


const routes: Routes = [
  {
    path: '', component: LayoutsComponent, canActivateChild: [AuthenticateGuard], children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: HomepageComponent },
      { path: 'plan', component: ReadplanComponent },
      { path: 'plan/create', component: MakeplanComponent },
      { path: 'note', component: ReadnoteComponent },
      { path: 'note/create', component: QnoteComponent },
      // { path: 'account', component: AccountComponent}
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
