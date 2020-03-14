import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import { SidenavComponent } from "./sidenav/sidenav.component";
import { CoreImportsModule } from '../modules/core-imports.module';
import { LayoutsComponent } from '../layouts/layouts.component';
import { ChatComponent } from './chat/chat.component';

const components = [
  NewTaskComponent,
  SidenavComponent,
  ChatComponent,
  LayoutsComponent,
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
