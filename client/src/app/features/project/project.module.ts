import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectRoutingModule } from './project-routing.module';
import { ProjectComponent } from './project.component';
import { CoreImportsModule } from '../../shared/modules/core-imports.module';
import { CreateProjectComponent } from './create-project/create-project.component';
import { TaskInputComponent } from './create-project/task-input/task-input.component';
import { ManagerInputComponent } from './create-project/manager-input/manager-input.component';
import { MemberInputComponent } from './create-project/member-input/member-input.component';
import { AllProjectComponent } from './all-project/all-project.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { SharedComponentModule } from '../../shared/components/shared-component.module';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { ProjectOptionsComponent } from './project-options/project-options.component';

const comps = [
  ProjectComponent,
  CreateProjectComponent,
  TaskInputComponent,
  ManagerInputComponent,
  MemberInputComponent,
  AllProjectComponent,
  TasksComponent,
  ProjectDashboardComponent,
];

@NgModule({
  declarations: [
    ...comps,
    TaskDetailComponent,
    TaskCreateComponent,
    ProjectOptionsComponent,
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
