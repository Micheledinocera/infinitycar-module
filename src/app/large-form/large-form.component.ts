import { Component, OnInit, signal, computed } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-large-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './large-form.component.html',
  styleUrls: ['./large-form.component.sass']
})
export class LargeFormComponent implements OnInit {
  form!: FormGroup;
  submitted = signal(false);

  // Computed signal per la validità del form
  isFormValid = computed(() => this.form?.valid && this.submitted());
  isFormInvalid = computed(() => !this.form?.valid && this.submitted());

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.form = this.fb.group({
      // Sezione personale
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      codFiscale: ['', [Validators.required, Validators.pattern(/^[A-Z]{6}[0-9]{2}[A-Z][0-9]{2}[A-Z][0-9]{3}[A-Z]$/)]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9\s\-\+\(\)]{9,}$/)]],
      email: ['', [Validators.required, Validators.email]],
      confirmEmail: ['', [Validators.required, Validators.email]],

      // Sezione indirizzo
      street: ['', Validators.required],
      civico: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      provincia: ['', Validators.required],

      // Auto
      targa: ['', Validators.required],
      marca: ['', Validators.required],
      modello: ['', Validators.required],
      alimentazione: ['', Validators.required],
      numeroPorte: ['', Validators.required],
      chilometri:['', Validators.required],
      annoImmatricolazione:['', [Validators.required,Validators.pattern(/^\d{4}$/)]],
      difetti:[''],
      turnOn:[false],
      blocked:[false],

      // Privacy
      privacyConsent: [false, Validators.requiredTrue],
      marketingConsent: [false]
    }, { validators: this.emailMatchValidator });
  }

  emailMatchValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.get('email');
    const confirmEmail = control.get('confirmEmail');
    
    if (email && confirmEmail && email.value !== confirmEmail.value) {
      confirmEmail.setErrors({ emailMismatch: true });
      return { emailMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.form.valid) {
      console.log('Form data:', this.form.value);
      // Qui inviare i dati al backend
    }
  }

  reset(): void {
    this.form.reset();
    this.submitted.set(false);
  }

  get firstName() { return this.form.get('firstName'); }
  get lastName() { return this.form.get('lastName'); }
  get codFiscale() { return this.form.get('codFiscale'); }
  get phone() { return this.form.get('phone'); }
  get email() { return this.form.get('email'); }
  get confirmEmail() { return this.form.get('confirmEmail'); }
  get street() { return this.form.get('street'); }
  get civico() { return this.form.get('civico'); }
  get city() { return this.form.get('city'); }
  get zipCode() { return this.form.get('zipCode'); }
  get provincia() { return this.form.get('provincia'); }
  get targa() { return this.form.get('targa'); }
  get privacyConsent() { return this.form.get('privacyConsent'); }
  get marketingConsent() { return this.form.get('marketingConsent'); }
}
