import { Component, inject } from '@angular/core';
import { I18n, Tr } from '../i18n';

interface Project {
  name: string;
  description: Tr;
  stack: string;
  url: string;
}

// мои проекты со ссылками
@Component({
  selector: 'app-projects',
  templateUrl: './projects.html',
  styleUrl: './projects.css',
})
export class Projects {
  i18n = inject(I18n);

  projects: Project[] = [
    {
      name: 'Drotar Orders',
      description: ['Сайт обліку замовлень інтернет-магазину', 'Сайт учёта заказов интернет-магазина', 'Online store order management app'],
      stack: 'ASP.NET Core, Blazor, SignalR, EF Core, Azure',
      url: 'https://github.com/Artemelion/drotar-orders',
    },
    {
      name: 'Marketplace Sync',
      description: [
        'Синхронізація замовлень і залишків SalesDrive, Prom.ua, Rozetka',
        'Синхронизация заказов и остатков SalesDrive, Prom.ua, Rozetka',
        'Order and stock sync for SalesDrive, Prom.ua, Rozetka',
      ],
      stack: 'Python, REST API, XML/YML',
      url: 'https://github.com/Artemelion/marketplace-sync',
    },
    {
      name: 'Home Lab',
      description: ['Домашня інфраструктура: мережа, сервери, бекапи', 'Домашняя инфраструктура: сеть, серверы, бэкапы', 'Home infrastructure: network, servers, backups'],
      stack: 'UniFi, VLAN, Proxmox VE, WireGuard',
      url: 'https://github.com/Artemelion/homelab',
    },
    {
      name: 'Weather Forecast',
      description: ['Командний проект, прогноз погоди', 'Командный проект, прогноз погоды', 'Team project, weather forecast'],
      stack: 'React',
      url: 'https://github.com/Artemelion/Weather-Forecast',
    },
  ];
}
