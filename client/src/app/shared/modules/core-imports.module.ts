import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialCompsModule } from './material-comps.module';
import { RouterModule } from '@angular/router';
import { SocketService } from '../services/socket.service';
import { SharedPipeModule } from '../pipe/shared-pipe.module';

const modules = [
  MaterialCompsModule,
  ReactiveFormsModule,
  FormsModule,
  RouterModule,
  SharedPipeModule,
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
  ],
})
export class CoreImportsModule {
}
