import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { I18n, Tr } from '../i18n';

interface Job {
  title: Tr;
  company: Tr;
  points: Tr[];
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
      title: ['Технічне адміністрування онлайн-торгівлі', 'Техническое администрирование онлайн-торговли', 'E-commerce technical administration'],
      company: ['Власна справа, e-commerce', 'Своё дело, e-commerce', 'Own business, e-commerce'],
      points: [
        ['Веду SalesDrive CRM, магазини на Prom.ua і Rozetka: товари, залишки, замовлення', 'Веду SalesDrive CRM, магазины на Prom.ua и Rozetka: товары, остатки, заказы', 'Run SalesDrive CRM and stores on Prom.ua and Rozetka: products, stock, orders'],
        ['Обробляю прайси постачальників у CSV, XLSX, XML/YML', 'Обрабатываю прайсы поставщиков в CSV, XLSX, XML/YML', 'Process supplier price lists in CSV, XLSX, XML/YML'],
        ['Синхронізація замовлень і залишків між SalesDrive, Prom.ua і Rozetka через їх API та вебхуки', 'Синхронизация заказов и остатков между SalesDrive, Prom.ua и Rozetka через их API и вебхуки', 'Order and stock sync between SalesDrive, Prom.ua and Rozetka via their APIs and webhooks'],
        ['Python-скрипти по розкладу: оновлюють ціни та наявність з прайсів і генерують YML-фіди для маркетплейсів', 'Python-скрипты по расписанию: обновляют цены и наличие из прайсов и генерируют YML-фиды для маркетплейсов', 'Scheduled Python scripts that update prices and stock from price lists and build YML feeds for marketplaces'],
        ['Інтеграція з API Нової пошти: створення ТТН і автооновлення статусів доставки в CRM', 'Интеграция с API Новой почты: создание ТТН и автообновление статусов доставки в CRM', 'Nova Poshta API integration: creating waybills and auto-updating delivery statuses in CRM'],
        ['Telegram-бот, що пише про нові замовлення та помилки синхронізації', 'Telegram-бот, который пишет о новых заказах и ошибках синхронизации', 'Telegram bot that reports new orders and sync errors'],
      ],
    },
    {
      title: ['Розробка сайту обліку замовлень', 'Разработка сайта учёта заказов', 'Order management web app'],
      company: ['Drotar, e-commerce', 'Drotar, e-commerce', 'Drotar, e-commerce'],
      points: [
        ['Backend на ASP.NET Core (.NET 8): REST API, Entity Framework Core, MS SQL Server', 'Backend на ASP.NET Core (.NET 8): REST API, Entity Framework Core, MS SQL Server', 'ASP.NET Core (.NET 8) backend: REST API, Entity Framework Core, MS SQL Server'],
        ['Адмінка на Blazor: замовлення, клієнти, статуси, пошук і фільтри', 'Админка на Blazor: заказы, клиенты, статусы, поиск и фильтры', 'Blazor admin panel: orders, customers, statuses, search and filters'],
        ["SignalR: нові замовлення і зміни статусів з'являються без перезавантаження сторінки", 'SignalR: новые заказы и смены статусов появляются без перезагрузки страницы', 'SignalR: new orders and status changes show up without page reload'],
        ['Вхід через ASP.NET Core Identity, ролі менеджер і адміністратор', 'Вход через ASP.NET Core Identity, роли менеджер и администратор', 'Login via ASP.NET Core Identity, manager and admin roles'],
        ['Імпорт замовлень з SalesDrive по API, звіти з вивантаженням в Excel', 'Импорт заказов из SalesDrive по API, отчёты с выгрузкой в Excel', 'Order import from SalesDrive API, reports exported to Excel'],
        ['Деплой в Azure App Service і Azure SQL, збірка через GitHub Actions', 'Деплой в Azure App Service и Azure SQL, сборка через GitHub Actions', 'Deployed to Azure App Service and Azure SQL, built with GitHub Actions'],
      ],
    },
    {
      title: ['Адміністрування IT-інфраструктури', 'Администрирование IT-инфраструктуры', 'IT infrastructure administration'],
      company: ['Власні проекти', 'Свои проекты', 'Personal projects'],
      points: [
        ['Мережа на Ubiquiti UniFi: шлюз, комутатори, точки доступу', 'Сеть на Ubiquiti UniFi: шлюз, коммутаторы, точки доступа', 'Ubiquiti UniFi network: gateway, switches, access points'],
        ['VLAN для серверів, робочих пристроїв і гостей окремо', 'VLAN отдельно для серверов, рабочих устройств и гостей', 'Separate VLANs for servers, work devices and guests'],
        ['Сервери віртуалізації Proxmox VE, бекапи через Proxmox Backup Server', 'Серверы виртуализации Proxmox VE, бэкапы через Proxmox Backup Server', 'Proxmox VE virtualization servers, backups with Proxmox Backup Server'],
        ['Windows Server 2022 і Linux', 'Windows Server 2022 и Linux', 'Windows Server 2022 and Linux'],
        ['Віддалений доступ через WireGuard VPN, правила firewall', 'Удалённый доступ через WireGuard VPN, правила firewall', 'Remote access via WireGuard VPN, firewall rules'],
        ['Діагностика заліза і мережі', 'Диагностика железа и сети', 'Hardware and network troubleshooting'],
      ],
    },
  ];

  // какие пункты раскрыты, по умолчанию все
  opened = new Set(this.jobs.map((_, i) => i));

  // event binding: сворачиваем / раскрываем по клику
  toggle(index: number) {
    if (this.opened.has(index)) this.opened.delete(index);
    else this.opened.add(index);
  }
}
