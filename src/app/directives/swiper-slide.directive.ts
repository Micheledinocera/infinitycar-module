import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[swiperSlide]',
  standalone: true
})
export class SwiperSlideDirective {
  constructor(public template: TemplateRef<any>) {}
}