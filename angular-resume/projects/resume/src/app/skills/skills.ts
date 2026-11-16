import { Component } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

interface Skill {
  name: string;
  level: number; // в процентах
}

// компонент с навыками, знаниями и сертификатами
@Component({
  selector: 'app-skills',
  imports: [NgClass, NgStyle],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  skills: Skill[] = [
    { name: 'HTML / CSS', level: 85 },
    { name: 'JavaScript', level: 70 },
    { name: 'TypeScript', level: 55 },
    { name: 'Angular', level: 35 },
    { name: 'C++', level: 65 },
    { name: 'SQL (MS SQL Server)', level: 60 },
  ];

  knowledge: string[] = ['ООП и SOLID', 'Паттерны проектирования', 'UML диаграммы', 'Git / GitHub', 'Сокеты, TCP/UDP'];

  certificates: string[] = ['IT Step: Web-разработка (HTML, CSS, JS)', 'IT Step: Программирование на C++'];

  // ngClass: цвет полоски зависит от уровня
  levelClass(level: number) {
    return {
      high: level >= 70,
      middle: level >= 50 && level < 70,
      low: level < 50,
    };
  }
}
