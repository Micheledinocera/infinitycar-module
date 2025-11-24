import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';

@Component({
  selector: 'app-car-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, IftaLabelModule],
  templateUrl: './car-data.component.html',
})
export class CarDataComponent {
  @Input() formGroup!: FormGroup;
  @Input() submitted!: () => boolean;

  get targa() {
    return this.formGroup.get('targa');
  }
}
