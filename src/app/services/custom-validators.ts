import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that the input contains at least two words (e.g., first and last name),
 * each with a minimum of two characters. Supports German umlauts and "ß".
 * * @returns {ValidatorFn} A validator function that returns 'invalidContactName' if the pattern doesn't match.
 */
export function contactNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name: string = control.value;
    if (name) {
      const nameRegex = /^[a-zA-ZäöüÄÖÜß]{2,12}\s+[a-zA-ZäöüÄÖÜß]{2,12}$/;
      const isValid = nameRegex.test(name.trim());
      return isValid ? null : { invalidContactName: true };
    }
    return null;
  };
}

/**
 * Validates the email domain structure.
 * Checks if the domain contains a dot and if the Top-Level Domain (TLD) has at least 2 characters.
 * * @returns {ValidatorFn} A validator function that returns 'email: true' if the domain suffix is too short
 * or an empty 'email: {}' object if the format is fundamentally incorrect.
 */
export function contactEmailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const email: string = control.value;

    if (email) {
      const domain: string = email.substring(email.lastIndexOf('@') + 1);
      if (domain.includes('.')) {
        return domain.substring(domain.lastIndexOf('.') + 1).length >= 2
          ? null
          : {
              email: true,
            };
      }
    }
    return { email: {} };
  };
}

/**
 * Validates the phone number input.
 * Ensures the value is not zero and has a length of more than 5 characters.
 * * @returns {ValidatorFn} A validator function that returns 'invalidPhoneNumber' if the requirements are not met.
 */
export function contactPhoneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const phoneNumber: number = control.value;
    if (phoneNumber) {
      const phoneStr = phoneNumber.toString();
      const validNumber = phoneNumber != 0 && phoneStr.length > 5 && phoneStr.length <= 15;
      return validNumber ? null : { invalidPhoneNumber: true };
    }
    return null;
  };
}
