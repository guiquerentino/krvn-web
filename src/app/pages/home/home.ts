import { Component } from '@angular/core';
import { Constants } from '../../utils/constants';
import { Carousel } from '../../components/carousel/carousel';
import { NgIcon, provideIcons } from "@ng-icons/core";
import { bootstrapBullseye, bootstrapCurrencyDollar, bootstrapGearFill} from '@ng-icons/bootstrap-icons';
import { BrandScrollerComponent } from "../../components/brand-scroller/brand-scroller";

@Component({
  selector: 'app-home',
  imports: [Carousel, NgIcon, BrandScrollerComponent],
    viewProviders: [provideIcons({bootstrapGearFill, bootstrapCurrencyDollar, bootstrapBullseye})],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {

  redirectToWhatsApp() {
    window.open(`https://wa.me/${Constants.WHATSAPP_NUMBER}?text=${encodeURIComponent(Constants.WHATSAPP_MESSAGE)}`, '_blank');
  }

}
