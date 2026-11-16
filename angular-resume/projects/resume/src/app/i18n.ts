import { Injectable, signal } from '@angular/core';

export type Lang = 'ua' | 'ru' | 'en';

// [укр, рус, англ] - чтобы не писать три отдельных объекта
export type Tr = [string, string, string];

// одинаково на всех языках
export const same = (s: string): Tr => [s, s, s];

const texts: Record<string, Tr> = {
  toLight: ['Світла тема', 'Светлая тема', 'Light theme'],
  toDark: ['Темна тема', 'Тёмная тема', 'Dark theme'],

  name: ['Морарь Артем', 'Морарь Артём', 'Artem Morar'],
  headline: ['Системний адміністратор, .NET розробник', 'Системный администратор, .NET разработчик', 'System administrator, .NET developer'],
  showContacts: ['Показати контакти', 'Показать контакты', 'Show contacts'],
  hideContacts: ['Сховати контакти', 'Скрыть контакты', 'Hide contacts'],
  phone: ['Телефон', 'Телефон', 'Phone'],

  about: ['Про мене', 'Обо мне', 'About'],
  aboutText: [
    "Займаюсь мережами, серверами і розробкою. Вдома сам підняв інфраструктуру на UniFi і Proxmox, веду технічну частину свого інтернет-магазину і пишу для нього софт на .NET. Вчусь в IT STEP University на комп'ютерних науках.",
    'Занимаюсь сетями, серверами и разработкой. Дома сам поднял инфраструктуру на UniFi и Proxmox, веду техническую часть своего интернет-магазина и пишу для него софт на .NET. Учусь в IT STEP University на компьютерных науках.',
    "I work with networks, servers and software. I built my own home infrastructure on UniFi and Proxmox, run the technical side of my online store and write software for it in .NET. Studying Computer Science at IT STEP University.",
  ],

  experience: ['Досвід', 'Опыт', 'Experience'],
  skills: ['Навички', 'Навыки', 'Skills'],
  zoomHint: [
    'Колесо миші - наблизити / віддалити, перетягніть пусте місце щоб рухати',
    'Колесо мыши - приблизить / отдалить, тяните пустое место чтобы двигать',
    'Mouse wheel to zoom in / out, drag empty space to move',
  ],
  reset: ['Скинути', 'Сбросить', 'Reset'],
  education: ['Освіта', 'Образование', 'Education'],
  university: ['IT STEP University', 'IT STEP University', 'IT STEP University'],
  specialty: [
    "Бакалавр, 122 Комп'ютерні науки",
    'Бакалавр, 122 Компьютерные науки',
    'Bachelor, 122 Computer Science',
  ],
  certificates: ['Сертифікати', 'Сертификаты', 'Certificates'],
  links: ['Посилання', 'Ссылки', 'Links'],
};

const langIndex: Record<Lang, number> = { ua: 0, ru: 1, en: 2 };

// сервис переводов, один на всё приложение
@Injectable({ providedIn: 'root' })
export class I18n {
  lang = signal<Lang>((localStorage.getItem('lang') as Lang) || 'ua');

  setLang(lang: Lang) {
    this.lang.set(lang);
    localStorage.setItem('lang', lang);
  }

  // перевод по ключу
  t(key: string): string {
    return this.pick(texts[key]) ?? key;
  }

  // выбрать нужный язык из тройки
  pick(tr: Tr): string {
    return tr[langIndex[this.lang()]];
  }
}
