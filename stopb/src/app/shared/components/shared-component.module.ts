import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import { SidenavComponent } from "./sidenav/sidenav.component";
import { CoreImportsModule } from '../modules/core-imports.module';
import { LayoutsComponent } from '../layouts/layouts.component';
import { ChatComponent } from './chat/chat.component';
import { SettingComponent } from './setting/setting.component';
import { FriendsComponent } from './friends/friends.component';
import { AccountComponent } from './account/account.component';

const components = [
  NewTaskComponent,
  SidenavComponent,
  ChatComponent,
  LayoutsComponent,
];

@NgModule({
  declarations: [
    ...components,
    SettingComponent,
    FriendsComponent,
    AccountComponent,
  ],
  exports: [
    ...components,
    SettingComponent,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
  ],
})
export class SharedComponentModule {
}
