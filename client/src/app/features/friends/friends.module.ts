import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FriendsRoutingModule } from './friends-routing.module';
import { CoreImportsModule } from '../../shared/modules/core-imports.module';
import { FriendsComponent } from './friends.component';
import { SharedComponentModule } from '../../shared/components/shared-component.module';

@NgModule({
  declarations: [
    FriendsComponent,
  ],
  imports: [
    CommonModule,
    CoreImportsModule,
    FriendsRoutingModule,
    SharedComponentModule,
  ],
})
export class FriendsModule {
}
