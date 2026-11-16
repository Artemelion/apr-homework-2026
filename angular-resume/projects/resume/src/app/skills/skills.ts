import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { I18n, Tr, same } from '../i18n';

interface Group {
  title: Tr;
  items: (string | Tr)[];
}

interface GNode {
  id: string;
  label: Tr;
  type: 'center' | 'group' | 'skill';
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface GLink {
  a: GNode;
  b: GNode;
  len: number;
}

interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

// навыки в виде графа как в Obsidian: узлы, связи, подсветка соседей,
// колесо мыши - масштаб, перетаскивание пустого места - сдвиг, узлы тоже можно таскать
@Component({
  selector: 'app-skills',
  imports: [NgClass, NgStyle],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills implements OnDestroy {
  i18n = inject(I18n);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('svg') svg!: ElementRef<SVGSVGElement>;

  groups: Group[] = [
    {
      title: ['Операційні системи', 'Операционные системы', 'Operating systems'],
      items: ['Windows 10/11', 'Windows Server 2022', 'Ubuntu Server LTS', 'Linux', 'PowerShell', 'CMD', 'Bash'],
    },
    {
      title: ['Мережі', 'Сети', 'Networking'],
      items: [
        'TCP/IP', 'DHCP', 'DNS', 'NAT', 'VLAN',
        'UniFi Gateway', 'UniFi Switch', 'UniFi Access Point',
        'WireGuard VPN', 'Firewall',
        ['Маршрутизація', 'Маршрутизация', 'Routing'],
        'Wi-Fi WPA2/WPA3',
        ['Сегментація мереж', 'Сегментация сетей', 'Network segmentation'],
        ['Діагностика мережі', 'Диагностика сети', 'Network troubleshooting'],
      ],
    },
    {
      title: ['Сервери та віртуалізація', 'Серверы и виртуализация', 'Servers & virtualization'],
      items: [
        'Proxmox VE', 'Proxmox Backup Server', 'VMware', 'VirtualBox',
        ['Віртуальні машини', 'Виртуальные машины', 'Virtual machines'],
        ['LXC-контейнери', 'LXC-контейнеры', 'LXC containers'],
        ['Бекапи та відновлення', 'Бэкапы и восстановление', 'Backup & recovery'],
        ['Віддалене адміністрування', 'Удалённое администрирование', 'Remote administration'],
      ],
    },
    {
      title: ['Обладнання', 'Железо', 'Hardware'],
      items: [
        ['Складання ПК', 'Сборка ПК', 'PC building'],
        ['Модернізація ПК', 'Апгрейд ПК', 'PC upgrades'],
        ['Діагностика несправностей', 'Диагностика неисправностей', 'Hardware diagnostics'],
        ['Встановлення ОС і драйверів', 'Установка ОС и драйверов', 'OS & driver setup'],
        ['Накопичувачі, RAM, БЖ', 'Накопители, RAM, БП', 'Drives, RAM, PSU'],
        ['Периферія', 'Периферия', 'Peripherals'],
      ],
    },
    {
      title: ['Програмування', 'Программирование', 'Programming'],
      items: ['C', 'C++', 'C#', 'Python', 'JavaScript', 'TypeScript', ['Скрипти автоматизації', 'Скрипты автоматизации', 'Automation scripts']],
    },
    {
      title: same('.NET'),
      items: ['ASP.NET Core', 'Entity Framework Core', 'Blazor', 'SignalR', 'ASP.NET Identity', 'Azure', 'Visual Studio'],
    },
    {
      title: ['Бази даних', 'Базы данных', 'Databases'],
      items: ['SQL', 'PostgreSQL', 'MySQL', 'MS SQL Server'],
    },
    {
      title: same('Web'),
      items: ['HTML / CSS', 'React', 'Angular', 'Node.js', 'REST API', ['API-інтеграції', 'API-интеграции', 'API integrations']],
    },
    {
      title: ['Інструменти', 'Инструменты', 'Tools'],
      items: ['Git', 'GitHub Actions'],
    },
    {
      title: same('E-commerce'),
      items: ['SalesDrive CRM', 'Prom.ua', 'Rozetka', ['API Нової пошти', 'API Новой почты', 'Nova Poshta API'], 'CSV / XLSX', 'XML / YML', 'Telegram Bot API'],
    },
  ];

  // связи между навыками из разных групп, чтобы граф был "живой"
  extra: [string, string][] = [
    ['TypeScript', 'Angular'],
    ['JavaScript', 'React'],
    ['JavaScript', 'Node.js'],
    ['C#', 'ASP.NET Core'],
    ['Visual Studio', 'C#'],
    ['Entity Framework Core', 'MS SQL Server'],
    ['Azure', 'GitHub Actions'],
    ['Ubuntu Server LTS', 'Bash'],
    ['Windows Server 2022', 'PowerShell'],
    ['Python', 'XML / YML'],
    ['Python', 'CSV / XLSX'],
    ['REST API', 'SalesDrive CRM'],
    ['REST API', 'ASP.NET Core'],
    ['Firewall', 'Proxmox VE'],
    ['VLAN', 'Proxmox VE'],
    ['WireGuard VPN', 'Віддалене адміністрування'],
    ['Linux', 'Ubuntu Server LTS'],
    ['Linux', 'LXC-контейнери'],
    ['Встановлення ОС і драйверів', 'Windows 10/11'],
  ];

  nodes: GNode[] = [];
  links: GLink[] = [];
  neighbors = new Map<string, Set<string>>();

  hovered: string | null = null;
  dragged: GNode | null = null;
  overGraph = false;

  private base: View = { x: 0, y: 0, w: 800, h: 500 };
  view: View = { ...this.base };
  private panStart: { cx: number; cy: number; view: View } | null = null;
  private frame = 0;
  private energy = 0;

  constructor() {
    const center = this.addNode('me', ['Я', 'Я', 'Me'], 'center', 0, 0);
    this.groups.forEach((g, gi) => {
      const angle = (gi / this.groups.length) * Math.PI * 2;
      const gx = Math.cos(angle) * 220;
      const gy = Math.sin(angle) * 220;
      const group = this.addNode('g' + gi, g.title, 'group', gx, gy);
      this.addLink(center, group, 170);
      g.items.forEach((item, i) => {
        const label = typeof item === 'string' ? same(item) : item;
        const a = angle + (i - g.items.length / 2) * 0.3;
        const skill = this.addNode(label[0], label, 'skill', gx + Math.cos(a) * 90, gy + Math.sin(a) * 90);
        this.addLink(group, skill, 70);
      });
    });
    for (const [a, b] of this.extra) {
      const na = this.nodes.find((n) => n.id === a);
      const nb = this.nodes.find((n) => n.id === b);
      if (na && nb) this.addLink(na, nb, 160);
    }

    // раскладываем граф заранее, чтобы он сразу был красивый
    for (let i = 0; i < 500; i++) this.tick(1);
    this.fit();
  }

  get viewBox() {
    const v = this.view;
    return `${v.x} ${v.y} ${v.w} ${v.h}`;
  }

  get zoom() {
    return Math.round((this.base.w / this.view.w) * 100);
  }

  private addNode(id: string, label: Tr, type: GNode['type'], x: number, y: number) {
    const node: GNode = { id, label, type, x, y, vx: 0, vy: 0 };
    this.nodes.push(node);
    this.neighbors.set(id, new Set());
    return node;
  }

  private addLink(a: GNode, b: GNode, len: number) {
    this.links.push({ a, b, len });
    this.neighbors.get(a.id)!.add(b.id);
    this.neighbors.get(b.id)!.add(a.id);
  }

  // один шаг "физики": узлы отталкиваются, связи работают как пружины
  private tick(alpha: number) {
    const n = this.nodes;
    for (let i = 0; i < n.length; i++) {
      for (let j = i + 1; j < n.length; j++) {
        const dx = n[j].x - n[i].x;
        const dy = n[j].y - n[i].y;
        const d2 = dx * dx + dy * dy + 0.01;
        const f = (1500 / d2) * alpha;
        const d = Math.sqrt(d2);
        n[i].vx -= (dx / d) * f;
        n[i].vy -= (dy / d) * f;
        n[j].vx += (dx / d) * f;
        n[j].vy += (dy / d) * f;
      }
    }
    for (const l of this.links) {
      const dx = l.b.x - l.a.x;
      const dy = l.b.y - l.a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const f = (d - l.len) * 0.03 * alpha;
      l.a.vx += (dx / d) * f;
      l.a.vy += (dy / d) * f;
      l.b.vx -= (dx / d) * f;
      l.b.vy -= (dy / d) * f;
    }
    for (const node of n) {
      // лёгкое притяжение к центру
      node.vx -= node.x * 0.004 * alpha;
      node.vy -= node.y * 0.004 * alpha;
      if (node === this.dragged) {
        node.vx = node.vy = 0;
        continue;
      }
      node.vx *= 0.6;
      node.vy *= 0.6;
      node.x += node.vx;
      node.y += node.vy;
    }
  }

  // подгоняем видимую область под размер графа
  private fit() {
    const xs = this.nodes.map((n) => n.x);
    const ys = this.nodes.map((n) => n.y);
    const pad = 60;
    const x = Math.min(...xs) - pad;
    const y = Math.min(...ys) - pad;
    this.base = { x, y, w: Math.max(...xs) - x + pad, h: Math.max(...ys) - y + pad };
    this.view = { ...this.base };
  }

  // анимация после перетаскивания узла, пока граф не успокоится
  private animate() {
    cancelAnimationFrame(this.frame);
    const step = () => {
      this.tick(0.5);
      this.cdr.markForCheck();
      if (this.dragged || --this.energy > 0) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  // координаты мыши в системе координат svg
  private toSvg(event: MouseEvent) {
    const svg = this.svg.nativeElement;
    return new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
  }

  radius(n: GNode) {
    if (n.type === 'center') return 16;
    if (n.type === 'group') return 10;
    return 5;
  }

  isActive(id: string) {
    return this.hovered === id || !!this.neighbors.get(this.hovered!)?.has(id);
  }

  linkActive(l: GLink) {
    return this.hovered === l.a.id || this.hovered === l.b.id;
  }

  // масштаб колесом относительно курсора
  onWheel(event: WheelEvent) {
    event.preventDefault();
    this.zoomAt(this.toSvg(event), event.deltaY > 0 ? 1.15 : 1 / 1.15);
  }

  zoomBy(factor: number) {
    const v = this.view;
    this.zoomAt({ x: v.x + v.w / 2, y: v.y + v.h / 2 }, factor);
  }

  private zoomAt(p: { x: number; y: number }, factor: number) {
    const v = this.view;
    const w = Math.min(this.base.w * 1.5, Math.max(this.base.w / 6, v.w * factor));
    const k = w / v.w;
    this.view = { x: p.x - (p.x - v.x) * k, y: p.y - (p.y - v.y) * k, w, h: v.h * k };
  }

  resetView() {
    this.view = { ...this.base };
  }

  // перетаскивание узла
  startDrag(event: PointerEvent, node: GNode) {
    event.stopPropagation();
    this.dragged = node;
    this.svg.nativeElement.setPointerCapture(event.pointerId);
    this.animate();
  }

  // перетаскивание пустого места - сдвиг графа
  startPan(event: PointerEvent) {
    this.panStart = { cx: event.clientX, cy: event.clientY, view: { ...this.view } };
    this.svg.nativeElement.setPointerCapture(event.pointerId);
  }

  onMove(event: PointerEvent) {
    if (this.dragged) {
      const p = this.toSvg(event);
      this.dragged.x = p.x;
      this.dragged.y = p.y;
    } else if (this.panStart) {
      const s = this.panStart;
      const k = s.view.w / this.svg.nativeElement.clientWidth;
      this.view = { ...s.view, x: s.view.x - (event.clientX - s.cx) * k, y: s.view.y - (event.clientY - s.cy) * k };
    }
  }

  endDrag() {
    this.panStart = null;
    if (!this.dragged) return;
    this.dragged = null;
    this.energy = 90;
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
  }
}
