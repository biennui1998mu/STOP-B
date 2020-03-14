import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewTaskComponent } from './new-task/new-task.component';
import {SidenavComponent} from "./sidenav/sidenav.component";
import {MaterialCompsModule} from "../../material-comps.module";
import {FormsModule} from "@angular/forms";

const components = [
  NewTaskComponent,
  SidenavComponent,
];

@NgModule({
  declarations: [
    ...components
  ],
  exports: [
    NewTaskComponent
  ],
  imports: [
    CommonModule,
    MaterialCompsModule,
    FormsModule
  ]
})
export class SharedComponentModule { }
