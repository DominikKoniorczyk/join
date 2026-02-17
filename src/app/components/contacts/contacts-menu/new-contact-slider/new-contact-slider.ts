import { NewContactsInterface } from './../../../../interfaces/supabase.interfaces';
import { Component, EventEmitter, inject, Output, output, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Supabase } from '../../../../services/supabase';
import { InitialsPipe } from '../../../../services/contacts.services';

/**
 * Validates that the input contains at least two words (e.g., first and last name),
 * each with a minimum of two characters. Supports German umlauts and "ß".
 * * @returns {ValidatorFn} A validator function that returns 'invalidContactName' if the pattern doesn't match.
 */
export function contactNameValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const name: string = control.value;
    const nameRegex = /^[a-zA-ZäöüÄÖÜß]{2,}\s+[a-zA-ZäöüÄÖÜß]{2,}$/;
    const isValid = nameRegex.test(name.trim());
    return isValid ? null : { invalidContactName: true };
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
    const validNumber = phoneNumber != 0 && control.value.length > 5;
    return validNumber ? null : { invalidPhoneNumber: true };
  };
}

@Component({
  selector: 'app-new-contact-slider',
  imports: [ReactiveFormsModule, InitialsPipe],
  templateUrl: './new-contact-slider.html',
  styleUrl: './new-contact-slider.scss',
})
export class NewContactSlider {
  closeDialog = output<void>();

  @Output('closeDialog') close = new EventEmitter<void>();
  /** * The reactive form group for adding a new contact.
   * @type {FormGroup}
   */
  contactForm!: FormGroup;

  supabaseClient = inject(Supabase);

  contactData = signal<NewContactsInterface>({
    name: '',
    phone_number: 0,
    email: '',
    color: '',
  });

  /**
   * Initializes the contact form group with validators.
   * * Validations include:
   * - **name**: Required, must contain at least a first and last name.
   * - **email**: Required, must follow standard email format and custom domain rules.
   * - **phone**: Required, must be a valid number string with more than 5 characters.
   * * @returns {void}
   */
  ngOnInit() {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required, contactNameValidator()]),
      email: new FormControl('', [Validators.required, Validators.email, contactEmailValidator()]),
      phone: new FormControl('', [Validators.required, contactPhoneValidator()]),
    });
    this.subscripeAllInputFields();
  }

  /**
   * Handles form submission.
   * Logs the form data to the console if valid, otherwise marks all fields as touched to trigger error messages.
   * @returns {void}
   */
  onSubmit() {
    if (this.contactForm.valid) {
      this.supabaseClient.uploadJSONToTable('users', this.contactData());
    } else {
      console.log('Form is invalid');
      this.contactForm.markAllAsTouched();
    }
  }

  /**Subscripe the change on input fields. Set the values of the corresponding data in contactData.*
@returns {void}*/
  subscripeAllInputFields() {
    this.contactForm.get('name')?.valueChanges.subscribe((value) => {
      this.contactData.update((current) => {
        if (!current) return current;
        return { ...current, name: value! };
      });
    });
    this.contactForm.get('email')?.valueChanges.subscribe((value) => {
      this.contactData.update((current) => {
        if (!current) return current;
        return { ...current, email: value! };
      });
    });
    this.contactForm.get('phone')?.valueChanges.subscribe((value) => {
      this.contactData.update((current) => {
        if (!current) return current;
        return { ...current, phone_number: value! };
      });
    });
  }

  /**
   * Resets the contact form to its initial empty state and clears all validation errors.
   * @returns {void}
   */
  onCancel() {
    this.contactForm.reset();
  }

  colors: string[] = [
    '#ff7a00',
    '#ff5eb3',
    '#6e52ff',
    '#9327ff',
    '#00bee8',
    '#1fd7c1',
    '#ffa35e',
    '#fc71ff',
    '#ffc701',
    '#0038ff',
    '#c3ff2b',
    '#ffe62b',
    '#ff4646',
    '#ffbb2b',
  ];

  /**
   * Generates a random hex color string from the predefined colors array.
   * @returns {string} A hex color code (e.g., '#ff7a00').
   */
  getRandomeColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  emitCloseDialog() {
    this.closeDialog.emit();
    console.log('test');
  }
}
