import { Component, inject } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { I18n, Tr } from '../i18n';

interface Skill {
  name: string;
  level: number; // в процентах
}

// компонент с навыками и сертификатами
@Component({
  selector: 'app-skills',
  imports: [NgClass, NgStyle],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  i18n = inject(I18n);

  skills: Skill[] = [
    { name: 'HTML / CSS', level: 85 },
    { name: 'JavaScript', level: 70 },
    { name: 'C++', level: 65 },
    { name: 'SQL (MS SQL Server)', level: 60 },
    { name: 'TypeScript', level: 55 },
    { name: 'React', level: 50 },
    { name: 'Angular', level: 40 },
    { name: 'C# / .NET', level: 35 },
    { name: 'Node.js', level: 30 },
  ];

  certificates: Tr[] = [
    ['IT STEP: Web-розробка (HTML, CSS, JS)', 'IT STEP: Web-разработка (HTML, CSS, JS)', 'IT STEP: Web development (HTML, CSS, JS)'],
    ['IT STEP: Програмування на C++', 'IT STEP: Программирование на C++', 'IT STEP: C++ programming'],
  ];

  // ngClass: цвет полоски зависит от уровня
  levelClass(level: number) {
    return {
      high: level >= 70,
      middle: level >= 50 && level < 70,
      low: level < 50,
    };
  }
}
