import { Component, inject } from '@angular/core';
import { I18n } from '../i18n';

// компонент с основной информацией: ФИО, телефон, город, фото
@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  i18n = inject(I18n);

  phone = '+38 (0XX) XXX-XX-XX';
  email = 'example@gmail.com';
  telegram = 'https://t.me/artyom_morar';
  photo = 'photo.jpg'; // фото из телеграма, лежит в папке public
  showContacts = true;

  // event binding: показать / скрыть контакты
  toggleContacts() {
    this.showContacts = !this.showContacts;
  }
}
