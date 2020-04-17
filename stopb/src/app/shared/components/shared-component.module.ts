import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import { CoreImportsModule } from '../modules/core-imports.module';
import { AccountComponent } from './account/account.component';
import { UserPillComponent } from './friend/user-pill/user-pill.component';

const components = [
  NewTaskComponent,
  AccountComponent,
];

@NgModule({
  declarations: [
    ...components,
    UserPillComponent,
  ],
  exports: [
    ...components,
    UserPillComponent,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
  ],
})
export class SharedComponentModule {
}
