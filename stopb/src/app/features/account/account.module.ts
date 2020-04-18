import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AccountRoutingModule } from './account-routing.module';
import { AccountComponent } from './account.component';
import { CoreImportsModule } from '../../shared/modules/core-imports.module';


@NgModule({
  declarations: [
    AccountComponent,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
    AccountRoutingModule,
  ],
})
export class AccountModule {
}
