/// <reference types="google.maps" />
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  AfterViewInit,
  NgZone,
  forwardRef,
  inject,
  OnDestroy,
  signal,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

@Component({
  selector: 'app-address-autocomplete',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './address-autocomplete.component.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AddressAutocompleteComponent),
      multi: true,
    },
  ],
})
export class AddressAutocompleteComponent implements AfterViewInit, ControlValueAccessor, OnDestroy {
  // Input per configurazione
  @Input() placeholder = 'Cerca un indirizzo...';
  // Generiamo un ID univoco per l'elemento
  autocompleteId = 'gmp-ac-' + Math.random().toString(36).substring(2, 9);

  // Usiamo un Signal per tracciare lo stato di caricamento dell'API
  isLoaded = signal(false);

  // Output per restituire l'oggetto completo di Google (lat, lng, cap, ecc.)
  @Output() placeSelected = new EventEmitter<google.maps.places.PlaceResult>();

  @ViewChild('inputField') inputElement!: ElementRef<HTMLInputElement>;

  // Iniezione dipendenze
  private ngZone = inject(NgZone);

  // Variabili interne
  private autocomplete: google.maps.places.Autocomplete | undefined;
  disabled = false;

  // Callback per il ControlValueAccessor
  onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  ngAfterViewInit() {
    this.initGoogleMaps();
  }

  private async initGoogleMaps() {
    setOptions({
      key: 'API_KEY_PLACEHOLDER',
    });

    try {
      // 1. Carica la libreria 'places' e l'elemento 'place_autocomplete'
      await importLibrary('places');

      // 2. Imposta le restrizioni e i campi necessari
      const element = document.getElementById(
        this.autocompleteId
      ) as google.maps.places.PlaceAutocompleteElement | null;

      if (element) {
        const autocompleteElement = element as any;
        autocompleteElement.componentRestrictions = { country: 'it' };
        autocompleteElement.fields = ['formatted_address', 'geometry', 'address_components'];
        autocompleteElement.types = ['address'];
      }

      // 3. Il servizio è pronto, mostra l'elemento nel DOM
      this.isLoaded.set(true);
    } catch (error) {
      console.error('Errore nel caricamento di Google Maps o PlaceAutocomplete:', error);
    }
  }

  // --- Metodo di gestione dell'evento ---
  handlePlaceSelect(inputEvent: Event) {
    const event = inputEvent as CustomEvent<{ place: google.maps.places.PlaceResult }>;
    // Eseguiamo dentro ngZone perché l'evento proviene dall'elemento Web Component
    this.ngZone.run(() => {
      const place = event.detail.place;

      if (place && place.formatted_address) {
        // Aggiorna il valore del form Angular
        this.writeValue(place.formatted_address);
        this.onChange(place.formatted_address);

        // Emette l'oggetto completo al genitore
        this.placeSelected.emit(place);
      }
    });
  }
  // Chiamato da Angular quando il valore cambia programmaticamente (es. form.setValue)
  writeValue(value: string): void {
    const element = document.getElementById(this.autocompleteId) as google.maps.places.PlaceAutocompleteElement | null;

    // Quando il form imposta un valore, dobbiamo impostarlo nel campo interno del Web Component
    if (element) {
      const autocompleteElement = element as any;
      // L'elemento ha una proprietà 'value' o 'defaultValue' che puoi impostare
      // Questo potrebbe richiedere un piccolo ritardo se l'elemento non è completamente reso
      autocompleteElement.value = value || '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Gestione input manuale dell'utente
  onInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.onChange(value);
  }

  ngOnDestroy(): void {
    // Pulizia listener se necessario (google maps lo gestisce spesso da solo rimuovendo nodi DOM)
    if (this.autocomplete) {
      google.maps.event.clearInstanceListeners(this.autocomplete);
    }
  }
}
