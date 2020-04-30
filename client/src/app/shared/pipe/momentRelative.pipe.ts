import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'momentRelativePipe',
})
export class MomentRelativePipe implements PipeTransform {

  constructor() {
  }

  public transform(value: {
    createdAt: string,
    updatedAt: string,
  }) {
    if (!value.createdAt && !value.updatedAt) {
      return 'unknown time...';
    }

    if (value.updatedAt) {
      const momentRelative = moment(value.updatedAt).fromNow();
      return `last updated ${momentRelative}`;
    }

    const momentRelative = moment(value.createdAt).fromNow();
    return `created ${momentRelative}`;
  }

}
