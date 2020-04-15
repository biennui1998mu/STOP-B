import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ViewProjectComponent } from './view-project/view-project.component';
import { CoreImportsModule } from '../../shared/modules/core-imports.module';
import { CreateProjectComponent } from './create-project/create-project.component';
import { TaskInputComponent } from './create-project/task-input/task-input.component';
import { ManagerInputComponent } from './create-project/manager-input/manager-input.component';
import { MemberInputComponent } from './create-project/member-input/member-input.component';
import { AllProjectComponent } from './all-project/all-project.component';

const comps = [
  ViewProjectComponent,
  CreateProjectComponent,
  TaskInputComponent,
  ManagerInputComponent,
  MemberInputComponent,
  AllProjectComponent,
];

@NgModule({
  declarations: [
    ...comps,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
    ProjectRoutingModule,
  ],
})
export class ProjectModule {
}
