/// <reference types="google.maps" />

import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
  Output,
  EventEmitter     
} from '@angular/core';
import { GoogleMapService } from '@app/googlemap.service';

@Component({
  selector: 'address-autocomplete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './address-autocomplete.component.html',
  styleUrl:'./address-autocomplete.component.scss'
})
export class AddressAutocomplete {
  private readonly googleMapService = inject(GoogleMapService);
  public readonly addressGroupContainer = viewChild<ElementRef<HTMLDivElement>>(
    'addressGroupContainer'
  );
  public readonly placeJson = signal(null);
  @Output() placeSelected = new EventEmitter<any>();
  
  async ngOnInit() {
    const maps = await this.googleMapService.getGoogleMapPlaces();
    const placeAutocomplete = new maps.places.PlaceAutocompleteElement({
      types: ['geocode'],
    });
    this.addressGroupContainer()?.nativeElement.appendChild(placeAutocomplete);

    placeAutocomplete.addEventListener(
      'gmp-select',
      async ({ placePrediction }: any) => {
        const place = placePrediction.toPlace();
        await place.fetchFields({
          fields: [
            'displayName',
            'formattedAddress',
            'location',
            'addressComponents',
          ],
        });

        const placeData = place.toJSON();
        
        if (placeData) {
          this.placeJson.set(placeData);
          // Emettiamo l'evento verso il padre con i dati completi
          this.placeSelected.emit(placeData); 
        }
      }
    );
  }
}
