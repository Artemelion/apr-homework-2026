import { Component, inject } from '@angular/core';
import { I18n } from '../i18n';

// компонент с основной информацией: имя, контакты, фото
@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  i18n = inject(I18n);

  phone = '+380960707437';
  phoneText = '+380 96 070 74 37';
  email = 'artommorareboy@gmail.com';
  telegram = 'https://t.me/artyom_morar';
  photo = 'photo.jpg'; // фото из телеграма, лежит в папке public
  showContacts = true;

  // event binding: показать / скрыть контакты
  toggleContacts() {
    this.showContacts = !this.showContacts;
  }
}
