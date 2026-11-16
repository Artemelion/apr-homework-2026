import { Component } from '@angular/core';

// компонент с основной информацией: ФИО, телефон, город, фото
@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile {
  fullName = 'Морарь Артем Євгенович';
  position = 'Junior Web / C++ Developer';
  phone = '+38 (0XX) XXX-XX-XX';
  email = 'example@gmail.com';
  city = 'Ваш город';
  photo = 'photo.svg'; // фото лежит в папке public
  showContacts = true;

  // event binding: показать / скрыть контакты
  toggleContacts() {
    this.showContacts = !this.showContacts;
  }
}
