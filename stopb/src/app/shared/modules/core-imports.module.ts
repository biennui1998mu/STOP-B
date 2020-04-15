import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
