import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './sidenav/sidenav.component';
import { ListFriendComponent } from './list-friend/list-friend.component';
import { LayoutsComponent } from './layouts.component';
import { RouterBreadcrumbComponent } from './router-breadcrumb/router-breadcrumb.component';
import { QuickAccessComponent } from './quick-access/quick-access.component';
import { CoreImportsModule } from '../modules/core-imports.module';

const comps = [
  SidenavComponent,
  ListFriendComponent,
  LayoutsComponent,
  RouterBreadcrumbComponent,
  QuickAccessComponent,
];

@NgModule({
  declarations: [
    ...comps,
  ],
  exports: [
    ...comps,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
  ],
})
export class LayoutsModule {
}
