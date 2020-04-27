import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';

const reExport = [
  SafeHtmlPipe,
];

@NgModule({
  declarations: [
    ...reExport,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ...reExport,
  ],
})
export class SharedPipeModule {
}
