import { Component, inject } from '@angular/core';
import { I18n, Tr, same } from '../i18n';

interface Group {
  title: Tr;
  items: string[];
}

// навыки по группам
@Component({
  selector: 'app-skills',
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills {
  i18n = inject(I18n);

  groups: Group[] = [
    {
      title: ['Мережі', 'Сети', 'Networking'],
      items: ['TCP/IP', 'DHCP', 'DNS', 'NAT', 'VLAN', 'Ubiquiti UniFi', 'WireGuard VPN', 'Firewall'],
    },
    {
      title: ['Сервери та віртуалізація', 'Серверы и виртуализация', 'Servers & virtualization'],
      items: ['Proxmox VE', 'Proxmox Backup Server', 'VMware', 'LXC', 'Windows Server 2022', 'Ubuntu Server'],
    },
    {
      title: ['Програмування', 'Программирование', 'Programming'],
      items: ['C / C++', 'C# / .NET', 'Python', 'JavaScript', 'TypeScript', 'SQL'],
    },
    {
      title: same('Web'),
      items: ['HTML / CSS', 'React', 'Angular', 'Node.js', 'API'],
    },
    {
      title: ['Бази даних', 'Базы данных', 'Databases'],
      items: ['PostgreSQL', 'MySQL', 'MS SQL Server'],
    },
    {
      title: ['Інструменти', 'Инструменты', 'Tools'],
      items: ['Git', 'Visual Studio', 'PowerShell', 'Bash'],
    },
    {
      title: same('E-commerce'),
      items: ['SalesDrive CRM', 'Prom.ua', 'Rozetka', 'CSV / XLSX / XML'],
    },
  ];
}
