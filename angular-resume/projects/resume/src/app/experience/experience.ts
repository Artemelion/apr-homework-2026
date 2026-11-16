import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

interface Job {
  company: string;
  position: string;
  period: string;
  description: string;
  current: boolean;
}

// компонент с опытом работы
@Component({
  selector: 'app-experience',
  imports: [NgClass],
  templateUrl: './experience.html',
  styleUrl: './experience.css',
})
export class Experience {
  jobs: Job[] = [
    {
      company: 'IT Step University',
      position: 'Студент, учебные проекты',
      period: '2024 - сейчас',
      description: 'Сайты на HTML/CSS/JS, приложения на C++ и TypeScript, базы данных на SQL Server.',
      current: true,
    },
    {
      company: 'Фриланс',
      position: 'Верстальщик',
      period: '2025',
      description: 'Вёрстка лендингов по макетам, адаптив, Bootstrap.',
      current: false,
    },
    {
      company: 'Учебная практика',
      position: 'Junior C++ Developer',
      period: '2026',
      description: 'Клиент-серверные приложения на сокетах (Winsock), чат, работа с JSON.',
      current: false,
    },
  ];

  selected = -1;

  // event binding: раскрываем описание по клику
  select(index: number) {
    this.selected = this.selected === index ? -1 : index;
  }
}
