import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './components/footer/footer';
import { FraudWarningModalComponent } from './components/fraud-warning-modal/fraud-warning-modal';
import { Header } from './components/header/header';
import { WhatsappFabComponent } from './components/whatsapp-fab/whatsapp-fab';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, WhatsappFabComponent, FraudWarningModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Karvan Auto Peças - A loja que você pode confiar');
}
