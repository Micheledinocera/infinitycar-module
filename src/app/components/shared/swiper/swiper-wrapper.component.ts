import { Component, ContentChildren, QueryList, ViewChild, CUSTOM_ELEMENTS_SCHEMA, TemplateRef, ElementRef } from '@angular/core'; // Aggiungi ElementRef
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-swiper-wrapper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './swiper-wrapper.component.html',
  styles: [`
    :host { display: block; }
    swiper-container {
      width: 100%;
      height: 100%;
    }
  `],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SwiperWrapperComponent {
  @ContentChildren(TemplateRef) templates!: QueryList<TemplateRef<any>>;
  
  // Tipizziamo correttamente come ElementRef
  @ViewChild('swiperContainer') swiperRef!: ElementRef;

  // Helper per ottenere l'istanza Swiper in modo sicuro
  private get swiperInstance(): any {
    return this.swiperRef?.nativeElement?.swiper;
  }

  nextSlide(): void {
    if (this.swiperInstance) {
      this.swiperInstance.slideNext();
    } else {
      console.warn('Swiper instance not found');
    }
  }

  prevSlide(): void {
    if (this.swiperInstance) {
      this.swiperInstance.slidePrev();
    } else {
      console.warn('Swiper instance not found');
    }
  }

  getCurrentSlideIndex(): number {
    return this.swiperInstance?.activeIndex ?? 0;
  }

  getTotalSlides(): number {
    return this.templates?.length ?? 0;
  }

  isLastSlide(): boolean {
    return this.getCurrentSlideIndex() === this.getTotalSlides() - 1;
  }

  isFirstSlide(): boolean {
    return this.getCurrentSlideIndex() === 0;
  }
}