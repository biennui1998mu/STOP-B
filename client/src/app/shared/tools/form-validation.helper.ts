import { AbstractControl, AsyncValidator, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable({ providedIn: 'root' })
export class ImageValidate implements AsyncValidator {

  validate(
    control: AbstractControl,
  ): Promise<ValidationErrors | null> {
    const url = control.value;
    //TODO
    return new Promise<ValidationErrors | null>(resolve => {
      resolve({ imageInvalid: { value: 'Image is invalid' } });
    });
  }
}

export const timeEndBefore: ValidatorFn =
  (control: FormGroup): ValidationErrors | null => {
    const startDateControl = control.get('startDate');
    const endDateControl = control.get('endDate');
    if (!startDateControl || !endDateControl) {
      return {
        'missingDate': true,
      };
    }

    if (!endDateControl.value) {
      return null;
    }

    const startDate = moment(startDateControl.value);
    const endDate = moment(endDateControl.value);
    if (!startDate.isValid() || !endDate.isValid()) {
      return {
        'dateInvalid': true,
      };
    }

    if (endDate.isBefore(startDate)) {
      return {
        'dateBefore': true,
      };
    }

    return null;
  };
