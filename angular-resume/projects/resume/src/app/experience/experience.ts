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
      company: ['Власна справа · E-commerce', 'Своё дело · E-commerce', 'Own business · E-commerce'],
      points: [
        ['SalesDrive CRM, Prom.ua, Rozetka', 'SalesDrive CRM, Prom.ua, Rozetka', 'SalesDrive CRM, Prom.ua, Rozetka'],
        ['Обробка товарних даних: CSV, XLSX, XML/YML', 'Обработка товарных данных: CSV, XLSX, XML/YML', 'Product data processing: CSV, XLSX, XML/YML'],
        ['Інтеграції та автоматизація процесів', 'Интеграции и автоматизация процессов', 'Integrations and process automation'],
      ],
    },
    {
      title: ['Розробка сайту обліку замовлень', 'Разработка сайта учёта заказов', 'Order management website'],
      company: ['Drotar · E-commerce', 'Drotar · E-commerce', 'Drotar · E-commerce'],
      points: [
        ['Сайт для обліку та обробки замовлень інтернет-магазину', 'Сайт для учёта и обработки заказов интернет-магазина', 'Website for tracking and processing online store orders'],
      ],
    },
    {
      title: ['Розробка лендингів', 'Разработка лендингов', 'Landing page development'],
      company: ['Фріланс', 'Фриланс', 'Freelance'],
      points: [
        ['Верстка та запуск лендингів, адаптивний дизайн', 'Вёрстка и запуск лендингов, адаптивный дизайн', 'Building and launching landing pages, responsive design'],
      ],
    },
    {
      title: ['Адміністрування IT-інфраструктури', 'Администрирование IT-инфраструктуры', 'IT infrastructure administration'],
      company: ['Самостійні проекти', 'Самостоятельные проекты', 'Personal projects'],
      points: [
        ['Мережа на Ubiquiti UniFi, сегментація через VLAN', 'Сеть на Ubiquiti UniFi, сегментация через VLAN', 'Ubiquiti UniFi network with VLAN segmentation'],
        ['Сервери віртуалізації Proxmox VE, резервне копіювання', 'Серверы виртуализации Proxmox VE, резервное копирование', 'Proxmox VE virtualization servers, backups'],
        ['Windows Server 2022 та Linux', 'Windows Server 2022 и Linux', 'Windows Server 2022 and Linux'],
        ['Віддалений доступ через WireGuard VPN, firewall', 'Удалённый доступ через WireGuard VPN, firewall', 'Remote access via WireGuard VPN, firewall rules'],
      ],
    },
  ];

  selected = 0;

  // event binding: раскрываем описание по клику
  select(index: number) {
    this.selected = this.selected === index ? -1 : index;
  }
}
