import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-personal-info',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, IftaLabelModule],
  templateUrl: './personal-info.component.html',
})
export class PersonalInfoComponent {
  @Input() formGroup!: FormGroup;
  @Input() submitted!: () => boolean;

  get firstName() {
    return this.formGroup.get('firstName');
  }

  get lastName() {
    return this.formGroup.get('lastName');
  }

  get codFiscale() {
    return this.formGroup.get('codFiscale');
  }

  get phone() {
    return this.formGroup.get('phone');
  }

  get email() {
    return this.formGroup.get('email');
  }

  get confirmEmail() {
    return this.formGroup.get('confirmEmail');
  }
}
