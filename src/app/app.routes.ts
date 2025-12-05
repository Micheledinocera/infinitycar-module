import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ModuloPageComponent } from './pages/modulo-page/modulo-page.component';

export const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'modulo', component: ModuloPageComponent },
  { path: '**', redirectTo: '' },
];
