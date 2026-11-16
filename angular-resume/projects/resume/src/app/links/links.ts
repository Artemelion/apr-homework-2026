import { Component, inject } from '@angular/core';
import { I18n } from '../i18n';

interface Link {
  title: string;
  url: string;
}

// ссылки на мои ресурсы
@Component({
  selector: 'app-links',
  templateUrl: './links.html',
  styleUrl: './links.css',
})
export class Links {
  i18n = inject(I18n);

  links: Link[] = [
    { title: 'GitHub', url: 'https://github.com/Artemelion' },
    { title: 'Telegram', url: 'https://t.me/artyom_morar' },
    { title: 'Weather Forecast', url: 'https://github.com/Artemelion/Weather-Forecast' },
    { title: 'IT STEP University', url: 'https://itstep.edu.ua/' },
  ];
}
