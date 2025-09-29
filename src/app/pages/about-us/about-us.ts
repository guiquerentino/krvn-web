import { Component } from '@angular/core';
import { Constants } from '../../utils/constants';

@Component({
  selector: 'app-about-us',
  imports: [],
  templateUrl: './about-us.html',
  styleUrl: './about-us.css'
})
export class AboutUs {

 redirectToWhatsApp() {
    window.open(`https://wa.me/${Constants.WHATSAPP_NUMBER}?text=${encodeURIComponent(Constants.WHATSAPP_MESSAGE)}`, '_blank');
  }


}
