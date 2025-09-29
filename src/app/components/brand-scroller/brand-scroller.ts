import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Brand {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-brand-scroller',
  standalone: true,
  imports: [CommonModule], // Necessário para o @for
  templateUrl: './brand-scroller.html',
  styleUrls: ['./brand-scroller.css']
})
export class BrandScrollerComponent {

  @Input() brands: Brand[] = [
    { src: 'assets/scroller_1.png', alt: 'Cofap' },
    { src: 'assets/scroller_2.svg', alt: 'Hipper Freios' },
    { src: 'assets/scroller_3.png', alt: 'LUK' },
    { src: 'assets/scroller_4.png', alt: 'NGK' },
    { src: 'assets/scroller_5.png', alt: 'Havoline' },
    { src: 'assets/scroller_6.png', alt: 'Wega' },
    { src: 'assets/scroller_7.png', alt: 'Contitech' },
    { src: 'assets/scroller_8.png', alt: 'Shell' },
    { src: 'assets/scroller_9.png', alt: 'TRW' },
    { src: 'assets/scroller_10.png', alt: 'Syl' },
    { src: 'assets/scroller_11.png', alt: 'Cobreq' },
    { src: 'assets/scroller_12.png', alt: 'Militec' },

  ];

}