import { Component } from '@angular/core';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { 
  bootstrapGearFill, 
  bootstrapDiscFill, 
  bootstrapCarFrontFill, 
  bootstrapLightningChargeFill, 
  bootstrapSpeedometer2, 
  bootstrapFilterCircleFill, 
  bootstrapWhatsapp 
} from '@ng-icons/bootstrap-icons';
import { Constants } from '../../utils/constants';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    NgIcon
  ],
  providers: [provideIcons({ 
    bootstrapGearFill, 
    bootstrapDiscFill, 
    bootstrapCarFrontFill, 
    bootstrapLightningChargeFill, 
    bootstrapSpeedometer2, 
    bootstrapFilterCircleFill, 
    bootstrapWhatsapp 
  })],
  templateUrl: './products.html',
  styleUrls: ['./products.css']
})
export class Products {

  constructor() { }

 redirectToWhatsApp() {
    window.open(`https://wa.me/${Constants.WHATSAPP_NUMBER}?text=${encodeURIComponent(Constants.WHATSAPP_MESSAGE)}`, '_blank');
  }


}