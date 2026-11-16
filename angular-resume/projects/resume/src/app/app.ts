import { Component, inject } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Profile } from './profile/profile';
import { Education } from './education/education';
import { Experience } from './experience/experience';
import { Skills } from './skills/skills';
import { Links } from './links/links';
import { I18n, Lang } from './i18n';

@Component({
  selector: 'app-root',
  imports: [NgClass, NgStyle, FormsModule, Profile, Education, Experience, Skills, Links],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  i18n = inject(I18n);

  langs: { code: Lang; title: string }[] = [
    { code: 'ua', title: 'UA' },
    { code: 'ru', title: 'RU' },
    { code: 'en', title: 'EN' },
  ];

  // тему запоминаем, чтобы после перезагрузки не сбрасывалась
  darkTheme = localStorage.getItem('theme') === 'dark';
  fontSize = 16;
  visitorName = '';
  likes = 0;

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem('theme', this.darkTheme ? 'dark' : 'light');
  }

  like() {
    this.likes++;
  }
}
