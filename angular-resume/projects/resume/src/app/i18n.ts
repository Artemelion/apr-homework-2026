import { Injectable, signal } from '@angular/core';

export type Lang = 'ua' | 'ru' | 'en';

// [укр, рус, англ] - чтобы не писать три отдельных объекта
export type Tr = [string, string, string];

// одинаково на всех языках
export const same = (s: string): Tr => [s, s, s];

const texts: Record<string, Tr> = {
  fontSize: ['Розмір шрифту', 'Размер шрифта', 'Font size'],
  toLight: ['Світла тема', 'Светлая тема', 'Light theme'],
  toDark: ['Темна тема', 'Тёмная тема', 'Dark theme'],

  name: ['Морарь Артем', 'Морарь Артём', 'Artem Morar'],
  headline: [
    'IT-адміністратор і розробник · Мережі, сервери, Web',
    'IT-администратор и разработчик · Сети, серверы, Web',
    'IT Administrator & Developer · Networks, Servers, Web',
  ],
  showContacts: ['Показати контакти', 'Показать контакты', 'Show contacts'],
  hideContacts: ['Сховати контакти', 'Скрыть контакты', 'Hide contacts'],
  phone: ['Телефон', 'Телефон', 'Phone'],

  about: ['Про мене', 'Обо мне', 'About'],
  aboutText: [
    "Налаштовую мережі та сервери (Ubiquiti UniFi, Proxmox, Windows Server, Linux), розробляю сайти та e-commerce рішення. Вмію зібрати й продіагностувати ПК, автоматизую рутину скриптами.",
    'Настраиваю сети и серверы (Ubiquiti UniFi, Proxmox, Windows Server, Linux), разрабатываю сайты и e-commerce решения. Умею собрать и продиагностировать ПК, автоматизирую рутину скриптами.',
    'I set up networks and servers (Ubiquiti UniFi, Proxmox, Windows Server, Linux) and build websites and e-commerce solutions. I can assemble and troubleshoot PCs and automate routine tasks with scripts.',
  ],

  experience: ['Досвід', 'Опыт', 'Experience'],
  skills: ['Навички', 'Навыки', 'Skills'],
  education: ['Освіта', 'Образование', 'Education'],
  university: ['IT STEP University', 'IT STEP University', 'IT STEP University'],
  specialty: [
    "Бакалавр, 122 «Комп'ютерні науки», з 2024",
    'Бакалавр, 122 «Компьютерные науки», с 2024',
    'Bachelor of Computer Science (122), since 2024',
  ],
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
