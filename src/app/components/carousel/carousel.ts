import { Component, Input, OnDestroy, OnInit, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; // Importe este

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [], // Certifique-se de que CommonModule está importado se for standalone e usar isPlatformBrowser diretamente no template
  templateUrl: './carousel.html',
  styleUrl: './carousel.css'
})
export class Carousel implements OnInit, OnDestroy {
  @Input() images: string[] = [];
  @Input() interval = 10000;
  currentIndex = signal(0);

  private intervalId?: number;
  private isBrowser: boolean;
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser && this.images && this.images.length > 1) {
      this.intervalId = window.setInterval(() => {
        this.next();
      }, this.interval);
    }
  }

  ngOnDestroy() {
    if (this.isBrowser && this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  prev() {
    this.currentIndex.set((this.currentIndex() - 1 + this.images.length) % this.images.length);
  }

  next() {
    this.currentIndex.set((this.currentIndex() + 1) % this.images.length);
  }

  goTo(index: number) {
    this.currentIndex.set(index);
  }
}