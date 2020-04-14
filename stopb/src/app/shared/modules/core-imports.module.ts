import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MaterialCompsModule } from './material-comps.module';
import { RouterModule } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { UserService } from '../services/user.service';

const modules = [
  MaterialCompsModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
];

@NgModule({
  imports: [
    ...modules,
  ],
  exports: [
    ...modules,
  ],
  providers: [
    SocketService,
    UserService,
  ],
})
export class CoreImportsModule {
}
