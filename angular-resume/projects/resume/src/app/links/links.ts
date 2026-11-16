import { Component } from '@angular/core';

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
  links: Link[] = [
    { title: 'GitHub', url: 'https://github.com/Artemelion' },
    { title: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { title: 'Twitter', url: 'https://twitter.com/' },
    { title: 'Сертификаты', url: 'https://mystat.itstep.org/' },
  ];
}
