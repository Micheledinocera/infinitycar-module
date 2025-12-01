import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-privacy',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './privacy.component.html',
})
export class PrivacyComponent {
  @Input() formGroup!: FormGroup;
  @Input() submitted!: () => boolean;

  get privacyConsent() {
    return this.formGroup.get('privacyConsent');
  }

  get marketingConsent() {
    return this.formGroup.get('marketingConsent');
  }
}
