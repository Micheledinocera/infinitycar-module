import { Component, computed, CUSTOM_ELEMENTS_SCHEMA, ElementRef, signal, ViewChild } from '@angular/core';
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './large-form.component.html',
})
export class LargeFormComponent {
  personalInfoForm: FormGroup;
  addressForm: FormGroup;
  carDataForm: FormGroup;
  privacyForm: FormGroup;
  submitted = signal(false);
  private swiperInstanceSignal = signal<any | undefined>(undefined);

  @ViewChild('swiperContainer') swiperRef!: ElementRef;

  ngOnInit() {
    import('swiper/element/bundle').then((swiper) => {
      swiper.register();
      this.swiperInstanceSignal.set(this.swiperRef?.nativeElement?.swiper);
    });
  }
  swiperInstance = computed(() => this.swiperInstanceSignal());

  constructor(private fb: FormBuilder) {
    this.personalInfoForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        codFiscale: ['', [Validators.required /* , Validators.pattern(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/) */]],
        phone: ['', [Validators.required /* , Validators.pattern(/^\+?39?\s?\d{3}\s?\d{3}\s?\d{4}$/) */]],
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', [Validators.required, Validators.email]],
      },
      { validators: emailMatchValidator }
    );

    this.addressForm = this.fb.group({
      street: ['', Validators.required],
      civico: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', [Validators.required /* , Validators.pattern(/^\d{5}$/) */]],
      provincia: ['', Validators.required],
    });

    this.carDataForm = this.fb.group({
      targa: ['', [Validators.required /* , Validators.pattern(/^[A-Z]{2}\d{3}[A-Z]{2}$/) */]],
    });

    this.privacyForm = this.fb.group({
      privacyConsent: [false, Validators.requiredTrue],
      marketingConsent: [false],
    });
  }

  onSubmit(): void {
    this.submitted.set(true);
    if (this.isAllFormsValid()) {
      const formData = {
        ...this.personalInfoForm.value,
        ...this.addressForm.value,
        ...this.carDataForm.value,
        ...this.privacyForm.value,
      };
      console.log('Form Data:', formData);
      // Invia i dati al backend
    }
  }

  reset(): void {
    this.personalInfoForm.reset();
    this.addressForm.reset();
    this.carDataForm.reset();
    this.privacyForm.reset();
    this.submitted.set(false);
  }

  isAllFormsValid(): boolean {
    return this.personalInfoForm.valid && this.addressForm.valid && this.carDataForm.valid && this.privacyForm.valid;
  }

  isSlideFormInvalid(): boolean {
    if (!this.swiperInstance) return false;
    if (this.swiperInstance()?.activeIndex == 0) return this.personalInfoForm.valid;
    if (this.swiperInstance()?.activeIndex == 1) return this.addressForm.valid;
    if (this.swiperInstance()?.activeIndex == 2) return this.carDataForm.valid;
    if (this.swiperInstance()?.activeIndex == 3) return this.privacyForm.valid;
    return false;
  }

  nextSlide(): void {
    this.swiperInstance().slideNext();
  }

  prevSlide(): void {
    this.swiperInstance().slidePrev();
  }

  isLastSlide(): boolean {
    return this.swiperInstance()?.activeIndex == this.swiperInstance()?.slides.length;
  }

  isFirstSlide(): boolean {
    return this.swiperInstance()?.activeIndex == 0;
  }
}
