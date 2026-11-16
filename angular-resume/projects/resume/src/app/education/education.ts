import { Component, inject } from '@angular/core';
import { I18n, Tr } from '../i18n';

interface Group {
  title: Tr;
  items: Tr[];
}

// одинаково на всех языках
const same = (s: string): Tr => [s, s, s];

// образование: выжимка знаний и технологий за время учёбы
@Component({
  selector: 'app-education',
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  i18n = inject(I18n);

  groups: Group[] = [
    {
      title: ['Мови програмування', 'Языки программирования', 'Programming languages'],
      items: ['C++', 'C#', 'Python', 'JavaScript', 'TypeScript', 'SQL'].map(same),
    },
    {
      title: ['Web', 'Web', 'Web'],
      items: ['HTML5', 'CSS', 'Bootstrap', 'Tailwind CSS', 'jQuery', 'Angular', 'React', 'Next.js', 'Node.js', 'Express', 'NestJS'].map(same),
    },
    {
      title: ['Бази даних', 'Базы данных', 'Databases'],
      items: [
        same('MS SQL Server'),
        ['Нормальні форми', 'Нормальные формы', 'Normal forms'],
        ['Процедури, функції, індекси', 'Процедуры, функции, индексы', 'Procedures, functions, indexes'],
        ['Сховища даних', 'Хранилища данных', 'Data warehouses'],
      ],
    },
    {
      title: ['Розробка ПЗ', 'Разработка ПО', 'Software engineering'],
      items: [
        ['ООП, SOLID', 'ООП, SOLID', 'OOP, SOLID'],
        ['Патерни проектування', 'Паттерны проектирования', 'Design patterns'],
        same('UML'),
        same('Git / GitHub'),
        ['Тестування', 'Тестирование', 'Testing'],
        ['Командна робота над проектом', 'Командная работа над проектом', 'Team project work'],
      ],
    },
    {
      title: ['Системи та мережі', 'Системы и сети', 'Systems and networks'],
      items: [
        ['ОС і системне програмування', 'ОС и системное программирование', 'OS and system programming'],
        ['Багатопотоковість', 'Многопоточность', 'Multithreading'],
        ['Сокети TCP/UDP', 'Сокеты TCP/UDP', 'TCP/UDP sockets'],
        ["Комп'ютерні мережі", 'Компьютерные сети', 'Computer networks'],
        same('Linux'),
        ['Хмарні технології', 'Облачные технологии', 'Cloud technologies'],
      ],
    },
    {
      title: ['Математика та алгоритми', 'Математика и алгоритмы', 'Math and algorithms'],
      items: [
        ['Лінійна алгебра', 'Линейная алгебра', 'Linear algebra'],
        ['Математичний аналіз', 'Математический анализ', 'Calculus'],
        ['Дискретна математика', 'Дискретная математика', 'Discrete math'],
        ['Теорія ймовірностей', 'Теория вероятностей', 'Probability theory'],
        ['Теорія алгоритмів', 'Теория алгоритмов', 'Algorithms'],
        ['Основи AI, аналітика даних', 'Основы AI, аналитика данных', 'AI basics, data analytics'],
      ],
    },
  ];
}
