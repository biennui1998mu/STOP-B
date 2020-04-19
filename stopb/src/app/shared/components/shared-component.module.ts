import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import { CoreImportsModule } from '../modules/core-imports.module';
import { UserPillComponent } from './friend/user-pill/user-pill.component';
import { ConfirmDialogsComponent } from './dialogs/confirm-dialogs/confirm-dialogs.component';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';

const components = [
  NewTaskComponent,
  ChatLayoutComponent,
  UserPillComponent,
  ConfirmDialogsComponent,
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
