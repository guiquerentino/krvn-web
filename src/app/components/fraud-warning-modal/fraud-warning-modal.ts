import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import {
  bootstrapGeoAltFill,
  bootstrapShieldFillExclamation,
  bootstrapTelephoneFill,
  bootstrapWhatsapp,
  bootstrapX
} from '@ng-icons/bootstrap-icons';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Constants } from '../../utils/constants';

@Component({
  selector: 'app-fraud-warning-modal',
  imports: [NgIcon],
  viewProviders: [
    provideIcons({
      bootstrapGeoAltFill,
      bootstrapShieldFillExclamation,
      bootstrapTelephoneFill,
      bootstrapWhatsapp,
      bootstrapX
    })
  ],
  templateUrl: './fraud-warning-modal.html',
  styleUrl: './fraud-warning-modal.css'
})
export class FraudWarningModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;

  readonly isVisible = signal(false);
  readonly contacts = {
    phoneDisplay: Constants.PHONE_DISPLAY,
    phoneHref: Constants.PHONE_HREF,
    whatsappDisplay: Constants.WHATSAPP_DISPLAY,
    whatsappUrl: Constants.whatsappUrl(),
    address: Constants.STORE_ADDRESS_FULL
  };

  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly readCookieName = 'karvan_fraud_warning_read';
  private readonly readCookieMaxAge = 60 * 60 * 24 * 180;
  private previousBodyOverflow = '';

  ngOnInit(): void {
    if (this.isBrowser && !this.hasReadWarningCookie()) {
      this.isVisible.set(true);
    }
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser || !this.isVisible()) {
      return;
    }

    this.previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.setTimeout(() => {
      this.dialog?.nativeElement.focus();
    });
  }

  ngOnDestroy(): void {
    this.restoreBodyScroll();
  }

  confirmRead(): void {
    if (this.isBrowser) {
      const secureFlag = window.location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${this.readCookieName}=true; Max-Age=${this.readCookieMaxAge}; Path=/; SameSite=Lax${secureFlag}`;
    }

    this.dismiss();
  }

  dismiss(): void {
    this.isVisible.set(false);
    this.restoreBodyScroll();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.isVisible()) {
      this.dismiss();
    }
  }

  trapFocus(event: KeyboardEvent): void {
    if (!this.isBrowser || event.key !== 'Tab') {
      return;
    }

    const dialog = this.dialog?.nativeElement;

    if (!dialog) {
      return;
    }

    const focusableElements = Array.from(
      dialog.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );

    if (focusableElements.length === 0) {
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }

  private restoreBodyScroll(): void {
    if (this.isBrowser) {
      document.body.style.overflow = this.previousBodyOverflow;
    }
  }

  private hasReadWarningCookie(): boolean {
    return document.cookie
      .split(';')
      .some((cookie) => cookie.trim().startsWith(`${this.readCookieName}=`));
  }
}
