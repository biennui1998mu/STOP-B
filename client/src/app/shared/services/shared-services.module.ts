import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiStateService } from './state/ui-state.service';

@NgModule({
  providers: [
    UiStateService,
  ],
  imports: [
    CommonModule,
  ],
  declarations: [],
})
export class SharedServicesModule {
}
