import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavigationUtils } from '../../utils/navigations-utils';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {
  items = NavigationUtils.MENU_ITEMS;
  currentYear = new Date().getFullYear();
  onSelect(page: string): void {
    NavigationUtils.selected.set(page);
  }
}
