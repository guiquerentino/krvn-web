import { Component, ElementRef ,HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {bootstrapGeoAltFill, bootstrapList, bootstrapTelephoneFill, bootstrapX} from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { NavigationUtils } from '../../utils/navigations-utils';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgIcon, RouterLink],
  viewProviders: [provideIcons({ bootstrapGeoAltFill, bootstrapTelephoneFill, bootstrapList, bootstrapX})],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header {
  items = NavigationUtils.MENU_ITEMS;
  selected = NavigationUtils.selected;
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.menuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen = false;
    }
  }

  menuOpen = false;

  onSelect(page: string): void {
    NavigationUtils.selected.set(page);
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }
}
