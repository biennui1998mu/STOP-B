import { Injectable } from '@angular/core';
import * as domPurify from 'dompurify';
import * as marked from 'marked';

@Injectable({
  providedIn: 'root',
})
export class MarkdownService {

  constructor() {
  }

  sanitizeString(text: string) {
    return domPurify.sanitize(text);
  }

  toMarkdown(rawText: string) {
    const stringSafe: string = this.sanitizeString(rawText);
    const markedString = marked(stringSafe);
    console.log(markedString);
    return markedString;
  }
}
