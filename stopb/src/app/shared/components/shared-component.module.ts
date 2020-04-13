import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import { CoreImportsModule } from '../modules/core-imports.module';
import { FriendsComponent } from './friends/friends.component';
import { AccountComponent } from './account/account.component';

const components = [
  NewTaskComponent,
  FriendsComponent,
  AccountComponent,
];

@NgModule({
  declarations: [
    ...components,
  ],
  exports: [
    ...components,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
  ],
})
export class SharedComponentModule {
}
