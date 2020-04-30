import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './projects/new-task/new-task.component';
import { CoreImportsModule } from '../modules/core-imports.module';
import { UserPillComponent } from './friend/user-pill/user-pill.component';
import { ConfirmDialogsComponent } from './dialogs/confirm-dialogs/confirm-dialogs.component';
import { ChatLayoutComponent } from './chat-layout/chat-layout.component';
import { ProjectMenuComponent } from './projects/project-menu/project-menu.component';
import { TaskPillComponent } from './tasks/task-pill/task-pill.component';
import { TaskCommentComponent } from './tasks/comment/task-comment/task-comment.component';
import { TaskCommentInputComponent } from './tasks/comment/task-comment-input/task-comment-input.component';
import { TaskMetaComponent } from './tasks/task-meta/task-meta.component';
import { RelatedTasksComponent } from './resources/related-tasks/related-tasks.component';
import { ImagePreviewComponent } from './resources/image-preview/image-preview.component';
import { TaskContentComponent } from './tasks/task-content/task-content.component';

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
    TaskCommentComponent,
    TaskCommentInputComponent,
    TaskMetaComponent,
    RelatedTasksComponent,
    ImagePreviewComponent,
    TaskContentComponent,
  ],
  exports: [
    ...components,
    ProjectMenuComponent,
    TaskPillComponent,
    TaskCommentComponent,
    TaskCommentInputComponent,
    TaskMetaComponent,
    TaskContentComponent,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
  ],
})
export class SharedComponentModule {
}
