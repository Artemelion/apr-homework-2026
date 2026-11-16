import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { I18n, Tr } from '../i18n';

interface Job {
  company: Tr;
  position: Tr;
  period: string;
  description: Tr;
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
  i18n = inject(I18n);

  jobs: Job[] = [
    {
      company: ['IT STEP University', 'IT STEP University', 'IT STEP University'],
      position: ['Студент, навчальні проекти', 'Студент, учебные проекты', 'Student, study projects'],
      period: '2024 →',
      description: [
        'Сайти на HTML/CSS/JS, Angular і React, програми на C++, бази даних на SQL Server.',
        'Сайты на HTML/CSS/JS, Angular и React, приложения на C++, базы данных на SQL Server.',
        'Websites with HTML/CSS/JS, Angular and React, C++ apps, SQL Server databases.',
      ],
      current: true,
    },
    {
      company: ['Командний проект', 'Командный проект', 'Team project'],
      position: ['Weather Forecast', 'Weather Forecast', 'Weather Forecast'],
      period: '2026',
      description: [
        'Сайт прогнозу погоди, робили командою на курсі React.',
        'Сайт прогноза погоды, делали командой на курсе React.',
        'Weather forecast website, made as a team during the React course.',
      ],
      current: false,
    },
    {
      company: ['Навчальна практика', 'Учебная практика', 'Study practice'],
      position: ['Junior C++ Developer', 'Junior C++ Developer', 'Junior C++ Developer'],
      period: '2026',
      description: [
        'Клієнт-серверні програми на сокетах (Winsock), чат, робота з JSON, планувальник задач з патернами.',
        'Клиент-серверные приложения на сокетах (Winsock), чат, работа с JSON, планировщик задач с паттернами.',
        'Client-server apps with sockets (Winsock), chat, JSON, task planner with design patterns.',
      ],
      current: false,
    },
  ];

  selected = -1;

  // event binding: раскрываем описание по клику
  select(index: number) {
    this.selected = this.selected === index ? -1 : index;
  }
}
