import { Component } from '@angular/core';
import { bootstrapEnvelopeFill, bootstrapGeoAltFill, bootstrapTelephoneFill } from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contact-us',
  imports: [NgIcon, FormsModule, HttpClientModule, CommonModule],
  viewProviders: [provideIcons({ bootstrapTelephoneFill, bootstrapGeoAltFill, bootstrapEnvelopeFill })],
  templateUrl: './contact-us.html',
  styleUrls: ['./contact-us.css']
})
export class ContactUs {
  apiUrl = 'https://www.karvan.com.br/api/sendmail'; 
  sending = false;
  messageText = '';
  messageType: 'success' | 'error' | '' = '';

  constructor(private http: HttpClient) {}

  submitForm() {
    if (this.sending) return;

    this.sending = true;
    this.messageText = '';
    this.messageType = '';

    const formElement = document.querySelector('form.contact-form') as HTMLFormElement;
    const formData = new FormData(formElement);

    this.http.post(this.apiUrl, formData, { responseType: 'text' }).subscribe({
      next: (res) => {
        this.messageText = 'Mensagem enviada com sucesso!';
        this.messageType = 'success';
        formElement.reset();
        setTimeout(() => {
          this.messageText = '';
          this.messageType = '';
        }, 5000);
        this.sending = false;
      },
      error: (err) => {
        this.messageText = 'Erro ao enviar a mensagem. Tente novamente.';
        this.messageType = 'error';
        setTimeout(() => {
          this.messageText = '';
          this.messageType = '';
        }, 5000);
        this.sending = false;
      }
    });
  }
}
