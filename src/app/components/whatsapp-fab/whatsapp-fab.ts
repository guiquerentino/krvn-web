import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { bootstrapWhatsapp } from '@ng-icons/bootstrap-icons'; 
import { Constants } from '../../utils/constants';

@Component({
  selector: 'app-whatsapp-fab',
  standalone: true,
  imports: [CommonModule, NgIconComponent], 
  templateUrl: './whatsapp-fab.html',
  styleUrls: ['./whatsapp-fab.css'],
  providers: [provideIcons({ bootstrapWhatsapp })] 
})
export class WhatsappFabComponent implements OnInit {
  whatsappUrl: string = '';
  

  ngOnInit(): void {
      this.whatsappUrl = `https://wa.me/${Constants.WHATSAPP_NUMBER}?text=${Constants.WHATSAPP_MESSAGE}`;
  }
}