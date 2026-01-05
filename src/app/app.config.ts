import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Aura from '@primeuix/themes/aura';

import { routes } from './app.routes';

const MyPreset = definePreset(Aura, {
    semantic: {
        primary: {
            500: '#0066cc', // Questo diventerà il colore base dei bottoni
            600: '#0052a3', // Colore hover
        }
    }
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
        preset: MyPreset,
        options:{
          darkModeSelector: 'none',
          // cssLayer: {
          //   name: 'primeng',
          //   order: 'primeng, app-styles',
          // },
        }
      },
    }),
  ],
};
