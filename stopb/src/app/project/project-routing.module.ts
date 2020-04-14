import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ViewProjectComponent } from './view-project/view-project.component';
import { AllProjectComponent } from './all-project/all-project.component';


const routes: Routes = [
  {
    path: '', children: [
      { path: '', pathMatch: 'full', component: AllProjectComponent },
      { path: 'create', component: CreateProjectComponent },
      { path: 'view/:id', component: ViewProjectComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProjectRoutingModule {
}
