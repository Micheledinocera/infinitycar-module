import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LargeFormComponent } from "./large-form/large-form.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LargeFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.sass'
})
export class AppComponent {
  title = 'infinitycar-module';
}
