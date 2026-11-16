import { Component, inject } from '@angular/core';
import { I18n } from '../i18n';

// образование
@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  i18n = inject(I18n);
}
