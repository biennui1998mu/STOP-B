import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import { CoreImportsModule } from '../modules/core-imports.module';
import { AccountComponent } from './account/account.component';

const components = [
  NewTaskComponent,
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
