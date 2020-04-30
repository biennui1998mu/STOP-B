import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safe-html.pipe';
import { MarkdownPipe } from './markdown.pipe';
import { MomentRelativePipe } from './momentRelative.pipe';

const reExport = [
  SafeHtmlPipe,
  MarkdownPipe,
  MomentRelativePipe,
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
