import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email = control.get('email')?.value;
    const confirmEmail = control.get('confirmEmail')?.value;

    return email && confirmEmail && email === confirmEmail ? null : { emailMismatch: true };
  };
}
