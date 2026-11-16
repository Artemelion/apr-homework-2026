import { Component, inject } from '@angular/core';
import { I18n } from '../i18n';

interface Certificate {
  name: string;
  issuer: string;
}

// образование и сертификаты
@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  i18n = inject(I18n);

  certificates: Certificate[] = [{ name: 'IT Essentials', issuer: 'Cisco Networking Academy' }];
}
