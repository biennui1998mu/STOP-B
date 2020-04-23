import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './projects/new-task/new-task.component';
import { CoreImportsModule } from '../modules/core-imports.module';
import { UserPillComponent } from './friend/user-pill/user-pill.component';
import { ConfirmDialogsComponent } from './dialogs/confirm-dialogs/confirm-dialogs.component';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';
import { ProjectMenuComponent } from './projects/project-menu/project-menu.component';
import { TaskPillComponent } from './tasks/task-pill/task-pill.component';

const components = [
  NewTaskComponent,
  ChatLayoutComponent,
  UserPillComponent,
  ConfirmDialogsComponent,
];

@NgModule({
  declarations: [
    ...components,
    ProjectMenuComponent,
    TaskPillComponent,
  ],
  exports: [
    ...components,
    ProjectMenuComponent,
    TaskPillComponent,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
  ],
})
export class SharedComponentModule {
}
