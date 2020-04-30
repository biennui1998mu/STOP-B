import { Pipe, PipeTransform } from '@angular/core';
import { MarkdownService } from '../services/markdown.service';

@Pipe({
  name: 'markdown',
})
export class MarkdownPipe implements PipeTransform {

  constructor(
    private markdownService: MarkdownService,
  ) {
  }

  public transform(value: any) {
    if (value) {
      return this.markdownService.toMarkdown(value);
    }
    return '';
  }

}
