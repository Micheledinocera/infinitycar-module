import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, IftaLabelModule],
  templateUrl: './address.component.html',
})
export class AddressComponent {
  @Input() formGroup!: FormGroup;
  @Input() submitted!: () => boolean;

  get street() {
    return this.formGroup.get('street');
  }

  get civico() {
    return this.formGroup.get('civico');
  }

  get city() {
    return this.formGroup.get('city');
  }

  get zipCode() {
    return this.formGroup.get('zipCode');
  }

  get provincia() {
    return this.formGroup.get('provincia');
  }
}
