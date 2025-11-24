import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import { AddressComponent } from './address/address.component';
import { CarDataComponent } from './car-data/car-data.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { emailMatchValidator } from './validators/email-match.validator';

@Component({
  selector: 'app-large-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    PersonalInfoComponent,
    AddressComponent,
    CarDataComponent,
    PrivacyComponent,
  ],
  templateUrl: './large-form.component.html',
})
export class LargeFormComponent {
  form: FormGroup;
  submitted = signal(false);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        codFiscale: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/)]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?39?\s?\d{3}\s?\d{3}\s?\d{4}$/)]],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
        street: ['', Validators.required],
        civico: ['', Validators.required],
        city: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        provincia: ['', Validators.required],
        targa: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\d{3}[A-Z]{2}$/)]],
        privacyConsent: [false, Validators.requiredTrue],
        marketingConsent: [false],
      },
      { validators: emailMatchValidator }
    );
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.valid) {
      console.log('Form Data:', this.form.value);
      // Invia i dati al backend
    }
  }

  reset(): void {
    this.form.reset();
    this.submitted.set(false);
  }

  isFormInvalid(): boolean {
    return this.form.invalid;
  }
}
