import { NewContactsInterface, SupabaseContactsInterface } from './../../../../interfaces/supabase.interfaces';
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { Supabase } from '../../../../services/supabase';
import { InitialsPipe } from '../../../../services/contacts.services';
import { contactEmailValidator, contactNameValidator, contactPhoneValidator } from '../../../../services/custom-validators';

@Component({
  selector: 'app-new-contact-slider',
  imports: [ReactiveFormsModule, InitialsPipe],
  templateUrl: './new-contact-slider.html',
  styleUrl: './new-contact-slider.scss',
})
export class NewContactSlider {
  @Input() editingContact: SupabaseContactsInterface = { id: 0, created_at: "", name: "", email: "", phone_number: 0, color: "" };
  @Output('closeDialog') close = new EventEmitter<void>();
  @Output() contactCreated = new EventEmitter<void>();

  id: number = 0;
  isEditing: boolean = false;
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
      name: new FormControl('', { validators: [Validators.required, contactNameValidator()] }),
      email: new FormControl('', { validators: [Validators.required, Validators.email, contactEmailValidator()] }),
      phone: new FormControl('', { validators: [Validators.required, contactPhoneValidator()] }),
    });
    this.subscripeAllInputFields();
  }

  /**
   * Checks if the component is in editing mode and initializes the form
   * with the current `editingContact` data if valid.
   * Sets the editing state and updates the local contact signal.
   */
  checkIsEditing() {
    if (this.returnValidEditing()) {
      this.contactForm.get('name')?.setValue(this.editingContact.name);
      this.contactForm.get('email')?.setValue(this.editingContact.email);
      this.contactForm.get('phone')?.setValue(this.editingContact.phone_number);
      this.id = this.editingContact.id;
      this.isEditing = true;
      this.contactData.set(this.editingContact);
    }
  }

  /**
   * Determines whether the current `editingContact` has valid data
   * to enable editing.
   *
   * @returns {boolean} True if at least one of name, email, or phone number is not empty.
   */
  returnValidEditing() {
    return this.editingContact.name != "" || this.editingContact.email != "" || this.editingContact.phone_number != 0;
  }

  /**
   * Handles form submission.
   * Logs the form data to the console if valid, otherwise marks all fields as touched to trigger error messages.
   * @returns {void}
   */
  onSubmit() {
    if (this.contactForm.valid) {
      if (!this.isEditing) this.supabaseClient.uploadJSONToTable('users', this.contactData());
      else this.supabaseClient.updateRow('users', this.contactData(), this.id);
      this.contactCreated.emit();
    } else {
      this.contactForm.markAllAsTouched();
    }
    this.contactForm.reset();
    this.contactData.set({ name: '', phone_number: 0, email: '', color: '' });
    this.contactCreated.emit();
  }

  /**Subscripe the change on input fields. Set the values of the corresponding data in contactData.*
   * @returns {void}
   */
  subscripeAllInputFields() {
    this.subscripeName();
    this.subscripeEmail();
    this.subscripePhone();
  }

  /**
   * Subscripe the change on input field "name". Set the values of the name data in contactData.
   * @return {void}
   */
   subscripeName() {
    this.contactForm.get('name')?.valueChanges.subscribe((value) => {
      this.contactData.update((current) => {
        if (!current) return current;
        if (!current.color && !this.returnValidEditing()) return { ...current, name: value!, color: this.getRandomeColor() };
        return { ...current, name: value! };
      });
    });
  }

  /**
   * Subscripe the change on input field "email". Set the values of the email data in contactData.
   * @return {void}
   */
   subscripeEmail() {
    this.contactForm.get('email')?.valueChanges.subscribe((value) => {
      this.contactData.update((current) => {
        if (!current) return current;
        return { ...current, email: value! };
      });
    });
  }

  /**
   * Subscripe the change on input field "phone-number". Set the values of the phone data in contactData.
   * @return {void}
   */
   subscripePhone() {
    this.contactForm.get('phone')?.valueChanges.subscribe((value) => {
      this.contactData.update((current) => {
        if (!current) return current;
        return { ...current, phone_number: value! };
      });
    });
  }

  /**
   * Checks if the modal is in editing mode, if delete the contact.
   * Resets the contact form to its initial empty state and clears all validation errors.
   * @returns {void}
   */
   onCancel() {
    if (this.isEditing) this.supabaseClient.deleteRow("users", this.id);
    this.contactForm.reset();
    this.contactData.set({ name: '', phone_number: 0, email: '', color: '' });
    this.isEditing = false;
  }

  /**
   * Resets the contact form to its initial empty state and clears all validation errors.
   * @returns {void}
   */
   onClose() {
    this.contactForm.reset();
    this.contactData.set({ name: '', phone_number: 0, email: '', color: '' });
    this.isEditing = false;
  }

  /**
   * Generates a random hex color string from the predefined colors array.
   * @returns {string} A hex color code (e.g., '#ff7a00').
   */
   getRandomeColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }

  /**
   * Emits an event to signal that the dialog should be closed.
   */
   emitCloseDialog() {
    this.close.emit();
  }
}
