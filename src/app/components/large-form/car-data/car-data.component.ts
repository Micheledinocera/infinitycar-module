import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
// Import dei moduli PrimeNG necessari
import { InputTextModule } from 'primeng/inputtext';
import { IftaLabelModule } from 'primeng/iftalabel';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-car-data',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    IftaLabelModule,
    SelectModule,
    TextareaModule,
    CheckboxModule
  ],
  templateUrl: './car-data.component.html',
})
export class CarDataComponent {
  @Input() formGroup!: FormGroup;
  @Input() submitted!: () => boolean;

  // Opzioni per i dropdown
  alimentazioneOptions = [
    { label: 'Benzina', value: 'benzina' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Elettrica', value: 'elettrica' },
    { label: 'Ibrida', value: 'ibrida' },
    { label: 'GPL', value: 'gpl' },
    { label: 'Metano', value: 'metano' }
  ];

  porteOptions = [
    { label: '3', value: 3 },
    { label: '5', value: 5 }
  ];

  // Helper getters per la validazione nel template
  get targa() { return this.formGroup.get('targa'); }
  get marca() { return this.formGroup.get('marca'); }
  get modello() { return this.formGroup.get('modello'); }
  get alimentazione() { return this.formGroup.get('alimentazione'); }
  get porte() { return this.formGroup.get('porte'); }
  get chilometri() { return this.formGroup.get('chilometri'); }
  get anno() { return this.formGroup.get('anno'); }
}