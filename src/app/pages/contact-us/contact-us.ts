import { Component } from '@angular/core';
import { bootstrapEnvelopeFill, bootstrapGeoAltFill, bootstrapTelephoneFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';

@Component({
  selector: 'app-contact-us',
  imports: [NgIcon],
  viewProviders: [provideIcons({bootstrapTelephoneFill, bootstrapGeoAltFill, bootstrapEnvelopeFill})],
  templateUrl: './contact-us.html',
  styleUrl: './contact-us.css'
})
export class ContactUs {

}
