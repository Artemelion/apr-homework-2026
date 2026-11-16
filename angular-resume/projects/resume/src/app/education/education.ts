import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { I18n, Tr } from '../i18n';

interface Semester {
  num: number;
  electives: number; // кредиты на выборочные дисциплины
  subjects: Tr[];
}

interface Year {
  num: number;
  period: string;
  status: 'done' | 'now' | 'future';
  semesters: Semester[];
  programming: Tr[];
}

const project: Tr = ['Проектна робота', 'Проектная работа', 'Project work'];
const englishPractice: Tr = ['Англійська мова (практикум)', 'Английский язык (практикум)', 'English (practice)'];
const bachelorStudios: Tr = ['Бакалаврські студії', 'Бакалаврские студии', 'Bachelor studios'];

// образование: программа "Компьютерные науки" с 1 по 4 курс
// предметы из учебного плана на itstep.edu.ua, программирование - то что реально делал на парах
@Component({
  selector: 'app-education',
  imports: [NgClass],
  templateUrl: './education.html',
  styleUrl: './education.css',
})
export class Education {
  i18n = inject(I18n);

  sourceUrl = 'https://itstep.edu.ua/komp-uterni-nauki';

  years: Year[] = [
    {
      num: 1,
      period: '2024 - 2025',
      status: 'done',
      semesters: [
        {
          num: 1,
          electives: 0,
          subjects: [
            ['Лінійна алгебра та аналітична геометрія', 'Линейная алгебра и аналитическая геометрия', 'Linear algebra and analytic geometry'],
            ['Англійська мова (ч.1)', 'Английский язык (ч.1)', 'English (part 1)'],
            ['Ділова мова та комунікативні технології', 'Деловой язык и коммуникативные технологии', 'Business language and communication'],
            ['Вступ до спеціальності', 'Введение в специальность', 'Introduction to the specialty'],
            ['Програмування на Python', 'Программирование на Python', 'Python programming'],
            ['Web-технології (ч.1)', 'Web-технологии (ч.1)', 'Web technologies (part 1)'],
            bachelorStudios,
            ['Основи здорового способу життя', 'Основы здорового образа жизни', 'Healthy lifestyle basics'],
            ['Життєвий цикл розробки програмних продуктів', 'Жизненный цикл разработки ПО', 'Software development life cycle'],
          ],
        },
        {
          num: 2,
          electives: 0,
          subjects: [
            ['Математичний аналіз', 'Математический анализ', 'Calculus'],
            ['Дискретна математика', 'Дискретная математика', 'Discrete mathematics'],
            ['Англійська мова (ч.2)', 'Английский язык (ч.2)', 'English (part 2)'],
            ['Бази даних', 'Базы данных', 'Databases'],
            ['Операційні системи та системне програмування', 'Операционные системы и системное программирование', 'Operating systems and system programming'],
            ["Архітектура комп'ютерних систем", 'Архитектура компьютерных систем', 'Computer architecture'],
            bachelorStudios,
            ['Основи національного спротиву', 'Основы национального сопротивления', 'National resistance basics'],
            project,
          ],
        },
      ],
      programming: [
        ['C++: змінні, цикли, функції', 'C++: переменные, циклы, функции', 'C++: variables, loops, functions'],
        ['C++: масиви, вказівники, структури', 'C++: массивы, указатели, структуры', 'C++: arrays, pointers, structs'],
        ['C++: робота з файлами', 'C++: работа с файлами', 'C++: working with files'],
      ],
    },
    {
      num: 2,
      period: '2025 - 2026',
      status: 'done',
      semesters: [
        {
          num: 3,
          electives: 5,
          subjects: [
            ['Теорія ймовірності і математична статистика', 'Теория вероятностей и математическая статистика', 'Probability theory and statistics'],
            englishPractice,
            ['Web-технології (ч.2)', 'Web-технологии (ч.2)', 'Web technologies (part 2)'],
            ["Комп'ютерні мережі", 'Компьютерные сети', 'Computer networks'],
            ['Теорія алгоритмів', 'Теория алгоритмов', 'Theory of algorithms'],
            ['Основи економіки та бізнесу', 'Основы экономики и бизнеса', 'Economics and business basics'],
            ['Українська культура та історія в світовому контексті', 'Украинская культура и история в мировом контексте', 'Ukrainian culture and history in a global context'],
            project,
          ],
        },
        {
          num: 4,
          electives: 10,
          subjects: [
            englishPractice,
            ['Паралельні та розподілені обчислення', 'Параллельные и распределённые вычисления', 'Parallel and distributed computing'],
            ['Основи штучного інтелекту', 'Основы искусственного интеллекта', 'AI fundamentals'],
            ['Основи тестування', 'Основы тестирования', 'Software testing basics'],
            project,
          ],
        },
      ],
      programming: [
        ['C++: ООП, шаблони, RAII', 'C++: ООП, шаблоны, RAII', 'C++: OOP, templates, RAII'],
        ['C++: потоки і сокети (TCP/UDP, Winsock)', 'C++: потоки и сокеты (TCP/UDP, Winsock)', 'C++: threads and sockets (TCP/UDP, Winsock)'],
        ['HTML5, CSS, Bootstrap', 'HTML5, CSS, Bootstrap', 'HTML5, CSS, Bootstrap'],
        ['JavaScript, jQuery', 'JavaScript, jQuery', 'JavaScript, jQuery'],
        ['UML діаграми та патерни проектування', 'UML диаграммы и паттерны проектирования', 'UML diagrams and design patterns'],
        ['MS SQL Server: запити, процедури, функції, індекси', 'MS SQL Server: запросы, процедуры, функции, индексы', 'MS SQL Server: queries, procedures, functions, indexes'],
        ['TypeScript, Angular', 'TypeScript, Angular', 'TypeScript, Angular'],
        ['React, Next.js, Tailwind CSS', 'React, Next.js, Tailwind CSS', 'React, Next.js, Tailwind CSS'],
        ['Командний проект Weather Forecast', 'Командный проект Weather Forecast', 'Team project Weather Forecast'],
      ],
    },
    {
      num: 3,
      period: '2026 - 2027',
      status: 'now',
      semesters: [
        {
          num: 5,
          electives: 10,
          subjects: [
            ['Критичне мислення', 'Критическое мышление', 'Critical thinking'],
            ['Аналітика даних', 'Аналитика данных', 'Data analytics'],
            ['Інженерія хмарних технологій', 'Инженерия облачных технологий', 'Cloud engineering'],
            ['Сховища даних', 'Хранилища данных', 'Data warehouses'],
            project,
          ],
        },
        {
          num: 6,
          electives: 15,
          subjects: [
            ['Соціологія і психологія', 'Социология и психология', 'Sociology and psychology'],
            ['Бізнес аналіз', 'Бизнес-анализ', 'Business analysis'],
            project,
          ],
        },
      ],
      programming: [
        ['Node.js, Express, NestJS', 'Node.js, Express, NestJS', 'Node.js, Express, NestJS'],
        ['C# / .NET: колекції, LINQ, делегати', 'C# / .NET: коллекции, LINQ, делегаты', 'C# / .NET: collections, LINQ, delegates'],
        ['Linux (Kali)', 'Linux (Kali)', 'Linux (Kali)'],
        ['Основи AI, промпти', 'Основы AI, промпты', 'AI basics, prompting'],
      ],
    },
    {
      num: 4,
      period: '2027 - 2028',
      status: 'future',
      semesters: [
        {
          num: 7,
          electives: 15,
          subjects: [
            ['Філософія', 'Философия', 'Philosophy'],
            ['Critical Reading and Persuasive Communication', 'Critical Reading and Persuasive Communication', 'Critical Reading and Persuasive Communication'],
          ],
        },
        {
          num: 8,
          electives: 10,
          subjects: [
            ['Виконання та захист кваліфікаційної роботи', 'Выполнение и защита квалификационной работы', "Bachelor's thesis and defense"],
          ],
        },
      ],
      programming: [
        ['Дипломний проект (Web-програмування)', 'Дипломный проект (Web-программирование)', 'Diploma project (web development)'],
      ],
    },
  ];

  // по умолчанию раскрыт текущий курс
  opened = 3;

  toggle(num: number) {
    this.opened = this.opened === num ? 0 : num;
  }
}
