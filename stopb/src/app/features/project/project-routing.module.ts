import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { AllProjectComponent } from './all-project/all-project.component';
import { AllTaskComponent } from './all-task/all-task.component';
import { ProjectDashboardComponent } from './view-project/project-dashboard/project-dashboard.component';
import { ViewTaskComponent } from './view-task/view-task.component';


const routes: Routes = [
  {
    path: '', children: [
      { path: '', pathMatch: 'full', component: AllProjectComponent },
      { path: 'create', component: CreateProjectComponent },
      {
        path: 'view/:id', component: ViewProjectComponent, children: [
          { path: '', pathMatch: 'full', component: ProjectDashboardComponent },
          { path: 'tasks', pathMatch: 'full', component: AllTaskComponent },
          { path: 'tasks/:id', component: ViewTaskComponent },
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
