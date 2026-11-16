import { ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { I18n, Tr, same } from '../i18n';

interface Group {
  title: Tr;
  items: string[];
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

// навыки в виде графа как в Obsidian: узлы, связи, подсветка соседей при наведении
@Component({
  selector: 'app-skills',
  imports: [NgClass],
  templateUrl: './skills.html',
  styleUrl: './skills.css',
})
export class Skills implements OnDestroy {
  i18n = inject(I18n);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('svg') svg!: ElementRef<SVGSVGElement>;

  groups: Group[] = [
    {
      title: ['Мережі', 'Сети', 'Networking'],
      items: ['TCP/IP', 'DHCP', 'DNS', 'NAT', 'VLAN', 'Ubiquiti UniFi', 'WireGuard VPN', 'Firewall'],
    },
    {
      title: ['Сервери', 'Серверы', 'Servers'],
      items: ['Proxmox VE', 'Proxmox Backup', 'VMware', 'LXC', 'Windows Server', 'Ubuntu Server'],
    },
    {
      title: ['Програмування', 'Программирование', 'Programming'],
      items: ['C / C++', 'C# / .NET', 'Python', 'JavaScript', 'TypeScript'],
    },
    {
      title: same('Web'),
      items: ['HTML / CSS', 'React', 'Angular', 'Node.js', 'API'],
    },
    {
      title: ['Бази даних', 'Базы данных', 'Databases'],
      items: ['SQL', 'PostgreSQL', 'MySQL', 'MS SQL Server'],
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

  // дополнительные связи между навыками из разных групп, чтобы граф был "живой"
  extra: [string, string][] = [
    ['TypeScript', 'Angular'],
    ['JavaScript', 'React'],
    ['JavaScript', 'Node.js'],
    ['C# / .NET', 'Visual Studio'],
    ['Ubuntu Server', 'Bash'],
    ['Windows Server', 'PowerShell'],
    ['Python', 'CSV / XLSX / XML'],
    ['API', 'SalesDrive CRM'],
    ['Firewall', 'Proxmox VE'],
    ['SQL', 'C# / .NET'],
  ];

  nodes: GNode[] = [];
  links: GLink[] = [];
  neighbors = new Map<string, Set<string>>();

  hovered: string | null = null;
  dragged: GNode | null = null;
  viewBox = '0 0 800 500';
  private frame = 0;
  private energy = 0;

  constructor() {
    const center = this.addNode('me', ['Я', 'Я', 'Me'], 'center', 0, 0);
    this.groups.forEach((g, gi) => {
      const angle = (gi / this.groups.length) * Math.PI * 2;
      const gx = Math.cos(angle) * 150;
      const gy = Math.sin(angle) * 150;
      const group = this.addNode('g' + gi, g.title, 'group', gx, gy);
      this.addLink(center, group, 120);
      g.items.forEach((item, i) => {
        const a = angle + (i - g.items.length / 2) * 0.25;
        const skill = this.addNode(item, same(item), 'skill', gx + Math.cos(a) * 80, gy + Math.sin(a) * 80);
        this.addLink(group, skill, 60);
      });
    });
    for (const [a, b] of this.extra) {
      const na = this.nodes.find((n) => n.id === a);
      const nb = this.nodes.find((n) => n.id === b);
      if (na && nb) this.addLink(na, nb, 140);
    }

    // раскладываем граф заранее, чтобы он сразу был красивый
    for (let i = 0; i < 400; i++) this.tick(1);
    this.fit();
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
        const f = (1200 / d2) * alpha;
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
      node.vx -= node.x * 0.005 * alpha;
      node.vy -= node.y * 0.005 * alpha;
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

  // подгоняем viewBox под размер графа
  private fit() {
    const xs = this.nodes.map((n) => n.x);
    const ys = this.nodes.map((n) => n.y);
    const pad = 50;
    const minX = Math.min(...xs) - pad;
    const minY = Math.min(...ys) - pad;
    const w = Math.max(...xs) - minX + pad;
    const h = Math.max(...ys) - minY + pad;
    this.viewBox = `${minX} ${minY} ${w} ${h}`;
  }

  // анимация после перетаскивания, пока граф не успокоится
  private animate() {
    cancelAnimationFrame(this.frame);
    const step = () => {
      this.tick(0.5);
      this.cdr.markForCheck();
      if (this.dragged || --this.energy > 0) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }

  radius(n: GNode) {
    if (n.type === 'center') return 14;
    if (n.type === 'group') return 9;
    return 5;
  }

  isActive(id: string) {
    return this.hovered === id || !!this.neighbors.get(this.hovered!)?.has(id);
  }

  linkActive(l: GLink) {
    return this.hovered === l.a.id || this.hovered === l.b.id;
  }

  // перетаскивание узлов мышкой
  startDrag(event: PointerEvent, node: GNode) {
    this.dragged = node;
    (event.target as Element).setPointerCapture(event.pointerId);
    this.animate();
  }

  onMove(event: PointerEvent) {
    if (!this.dragged) return;
    const svg = this.svg.nativeElement;
    const pt = new DOMPoint(event.clientX, event.clientY).matrixTransform(svg.getScreenCTM()!.inverse());
    this.dragged.x = pt.x;
    this.dragged.y = pt.y;
  }

  endDrag() {
    if (!this.dragged) return;
    this.dragged = null;
    this.energy = 90;
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.frame);
  }
}
