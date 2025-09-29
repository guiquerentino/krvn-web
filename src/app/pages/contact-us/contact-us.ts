import { Component } from '@angular/core';
import { bootstrapEnvelopeFill, bootstrapGeoAltFill, bootstrapTelephoneFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-us',
  imports: [NgIcon, FormsModule, HttpClientModule],
  viewProviders: [provideIcons({ bootstrapTelephoneFill, bootstrapGeoAltFill, bootstrapEnvelopeFill })],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.css']
})
export class ContactUs {
  apiUrl = 'https://www.karvan.com.br/api/sendmail'; 

  constructor(private http: HttpClient) {}

  submitForm() {
    const formElement = document.querySelector('form.contact-form') as HTMLFormElement;
    const formData = new FormData(formElement);

    this.http.post(this.apiUrl, formData, { responseType: 'text' }).subscribe({
      next: (res) => alert(res),
      error: (err) => alert('Erro ao enviar: ' + err.error)
    });
  }
}
