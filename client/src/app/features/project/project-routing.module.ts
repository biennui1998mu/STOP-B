import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectComponent } from './project.component';
import { AllProjectComponent } from './all-project/all-project.component';
import { TasksComponent } from './tasks/tasks.component';
import { ProjectDashboardComponent } from './project-dashboard/project-dashboard.component';
import { TaskDetailComponent } from './tasks/task-detail/task-detail.component';
import { TaskCreateComponent } from './tasks/task-create/task-create.component';
import { AllTaskResolver } from '../../shared/resolver/all-task.resolver';
import { ProjectOptionsComponent } from './project-options/project-options.component';


const routes: Routes = [
  {
    path: '', children: [
      { path: '', pathMatch: 'full', component: AllProjectComponent },
      { path: 'create', component: CreateProjectComponent },
      {
        path: 'view/:id',
        resolve: {
          tasks: AllTaskResolver,
        },
        component: ProjectComponent,
        children: [
          { path: '', pathMatch: 'full', component: ProjectDashboardComponent },
          {
            path: 'tasks',
            children: [
              { path: '', pathMatch: 'full', component: TasksComponent },
              { path: ':indicator', component: TaskDetailComponent },
            ],
          },
          { path: 'tasks-create', component: TaskCreateComponent },
          { path: 'options', component: ProjectOptionsComponent },
        ],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {
}
