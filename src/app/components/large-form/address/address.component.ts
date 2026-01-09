import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { AddressAutocomplete } from './address-autocomplete/address-autocomplete.component';

@Component({
  selector: 'app-address',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTextModule, AddressAutocomplete],
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

  // Funzione chiamata quando l'utente seleziona un indirizzo
  onAddressSelected(place: any) {
    if (!place || !place.addressComponents) return;

    // Funzione helper per trovare il valore in base al "type" di Google
    const getComponent = (type: string) => {
      return place.addressComponents.find((component: any) => 
        component.types.includes(type)
      );
    };

    // Estrazione dei valori
    const route = getComponent('route')?.longText || ''; // Via
    const streetNumber = getComponent('street_number')?.longText || ''; // Civico
    const locality = getComponent('locality')?.longText || ''; // Città
    const postalCode = getComponent('postal_code')?.longText || ''; // CAP
    const adminAreaLevel2 = getComponent('administrative_area_level_2')?.shortText || ''; // Provincia (sigla)

    // Aggiornamento del form
    this.formGroup.patchValue({
      street: route,
      civico: streetNumber,
      city: locality,
      zipCode: postalCode,
      provincia: adminAreaLevel2
    });

    // Opzionale: Segna i campi come "touched" per la validazione visiva immediata
    this.formGroup.markAllAsTouched();
  }
  
}
