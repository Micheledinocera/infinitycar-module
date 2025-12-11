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
  @ViewChild('autocompleteElement') autocompleteElement!: ElementRef<any>;

  // Iniezione dipendenze
  private ngZone = inject(NgZone);

  // Variabili interne
  private autocomplete: google.maps.places.Autocomplete | undefined;
  disabled = false;
  private pendingValue: string | null = null;

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

      // 4. Se c'è un valore in sospeso, impostalo ora
      if (this.pendingValue) {
        setTimeout(() => {
          this.writeValue(this.pendingValue!);
          this.pendingValue = null;
        }, 100);
      }

      // 5. Imposta il focus sull'input interno del Web Component
      setTimeout(() => {
        this.focusInput();
      }, 100);
    } catch (error) {
      console.error('Errore nel caricamento di Google Maps o PlaceAutocomplete:', error);
    }
  }

  // Metodo per impostare il focus sul Web Component
  private focusInput(): void {
    const element = document.getElementById(this.autocompleteId) as any;
    if (element && element.focus) {
      element.focus();
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
        console.log(place)
      }
    });
  }

  // Chiamato da Angular quando il valore cambia programmaticamente (es. form.setValue)
  writeValue(value: string): void {
    if (!this.isLoaded()) {
      // Se non è ancora caricato, salva il valore per dopo
      this.pendingValue = value;
      return;
    }

    const element = document.getElementById(this.autocompleteId) as any;

    if (element) {
      // Imposta il valore nell'input interno del Web Component
      element.value = value || '';
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
