import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { ListFriendComponent } from './list-friend/list-friend.component';
import { LayoutsComponent } from './layouts.component';
import { RouterBreadcrumbComponent } from './router-breadcrumb/router-breadcrumb.component';
import { QuickAccessComponent } from './quick-access/quick-access.component';
import { CoreImportsModule } from '../modules/core-imports.module';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';

const comps = [
  SideNavigationComponent,
  ListFriendComponent,
  LayoutsComponent,
  RouterBreadcrumbComponent,
  QuickAccessComponent,
  ChatLayoutComponent,
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
