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

}