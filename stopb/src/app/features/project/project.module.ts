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
import { AllTaskComponent } from './all-task/all-task.component';
import { ProjectDashboardComponent } from './view-project/project-dashboard/project-dashboard.component';
import { SharedComponentModule } from '../../shared/components/shared-component.module';
import { ViewTaskComponent } from './view-task/view-task.component';

const comps = [
  ViewProjectComponent,
  CreateProjectComponent,
  TaskInputComponent,
  ManagerInputComponent,
  MemberInputComponent,
  AllProjectComponent,
  AllTaskComponent,
  ProjectDashboardComponent,
];

@NgModule({
  declarations: [
    ...comps,
    ViewTaskComponent,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
    SharedComponentModule,
    ProjectRoutingModule,
  ],
})
export class ProjectModule {
}
