import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { Profile } from './profile/profile';
import { Education } from './education/education';
import { Experience } from './experience/experience';
import { Skills } from './skills/skills';
import { Projects } from './projects/projects';
import { Certificates } from './certificates/certificates';
import { Reveal } from './reveal';
import { Robot } from './robot/robot';
import { I18n, Lang } from './i18n';

@Component({
  selector: 'app-root',
  imports: [NgClass, Reveal, Robot, Profile, Education, Experience, Skills, Certificates, Projects],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  i18n = inject(I18n);

  langs: { code: Lang; title: string }[] = [
    { code: 'ru', title: 'RU' },
    { code: 'ua', title: 'UA' },
    { code: 'en', title: 'EN' },
  ];

  // тему запоминаем, чтобы после перезагрузки не сбрасывалась
  darkTheme = localStorage.getItem('theme') === 'dark';

  toggleTheme() {
    this.darkTheme = !this.darkTheme;
    localStorage.setItem('theme', this.darkTheme ? 'dark' : 'light');
  }
}
