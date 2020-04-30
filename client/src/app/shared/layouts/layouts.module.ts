import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { ListFriendComponent } from './list-friend/list-friend.component';
import { LayoutsComponent } from './layouts.component';
import { RouterBreadcrumbComponent } from './router-breadcrumb/router-breadcrumb.component';
import { AccountMenuComponent } from './account-menu/account-menu.component';
import { CoreImportsModule } from '../modules/core-imports.module';
import { SharedComponentModule } from '../components/shared-component.module';

const comps = [
  SideNavigationComponent,
  ListFriendComponent,
  LayoutsComponent,
  RouterBreadcrumbComponent,
  AccountMenuComponent,
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
    SharedComponentModule,
  ],
})
export class LayoutsModule {
}
