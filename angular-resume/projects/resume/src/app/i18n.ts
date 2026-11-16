import { Injectable, signal } from '@angular/core';

export type Lang = 'ua' | 'ru' | 'en';

// [укр, рус, англ] - чтобы не писать три отдельных объекта
export type Tr = [string, string, string];

const texts: Record<string, Tr> = {
  fontSize: ['Розмір шрифту', 'Размер шрифта', 'Font size'],
  toLight: ['Світла тема', 'Светлая тема', 'Light theme'],
  toDark: ['Темна тема', 'Тёмная тема', 'Dark theme'],

  name: ['Морарь Артем Євгенович', 'Морарь Артём Евгеньевич', 'Artem Morar'],
  position: ['Junior Web / C++ розробник', 'Junior Web / C++ разработчик', 'Junior Web / C++ Developer'],
  showContacts: ['Показати контакти', 'Показать контакты', 'Show contacts'],
  hideContacts: ['Сховати контакти', 'Скрыть контакты', 'Hide contacts'],
  phone: ['Телефон', 'Телефон', 'Phone'],
  city: ['Місто', 'Город', 'City'],
  cityValue: ['Ваше місто', 'Ваш город', 'Your city'],

  education: ['Освіта', 'Образование', 'Education'],
  university: ['IT STEP University (Університет ШАГ)', 'IT STEP University (Университет ШАГ)', 'IT STEP University'],
  specialty: [
    "Бакалавр, 122 «Комп'ютерні науки», група КН-П-241, з 2024",
    'Бакалавр, 122 «Компьютерные науки», группа КН-П-241, с 2024',
    "Bachelor, 122 Computer Science, group КН-П-241, since 2024",
  ],

  experience: ['Досвід', 'Опыт работы', 'Experience'],
  skills: ['Навички', 'Навыки', 'Skills'],
  certificates: ['Сертифікати', 'Сертификаты', 'Certificates'],
  links: ['Посилання', 'Ссылки', 'Links'],

  feedback: ['Залиште відгук', 'Оставьте отзыв', 'Leave feedback'],
  yourName: ["Ваше ім'я", 'Ваше имя', 'Your name'],
  thanks: ['Дякую, {name}, що подивились моє резюме!', 'Спасибо, {name}, что посмотрели моё резюме!', 'Thanks for checking out my resume, {name}!'],
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
