import { Component } from '@angular/core';
import { LargeFormComponent } from '@components/large-form/large-form.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-modulo-page',
  imports: [LargeFormComponent,CardModule],
  templateUrl: './modulo-page.component.html',
  styleUrl: './modulo-page.component.scss'
})
export class ModuloPageComponent {}
