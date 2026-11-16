import { Component, ElementRef, HostListener, inject, input } from '@angular/core';

// робот-декорация по бокам страницы: парит, моргает, машет рукой и следит глазами за мышкой
@Component({
  selector: 'app-robot',
  templateUrl: './robot.html',
  styleUrl: './robot.css',
  host: { '[class]': 'side()' },
})
export class Robot {
  side = input<'left' | 'right'>('left');

  private el = inject(ElementRef<HTMLElement>);

  // смещение зрачков
  eyeX = 0;
  eyeY = 0;

  @HostListener('window:mousemove', ['$event'])
  onMouse(event: MouseEvent) {
    const r = this.el.nativeElement.getBoundingClientRect();
    if (!r.width) return; // робот спрятан на узком экране
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.3;
    const dx = event.clientX - cx;
    const dy = event.clientY - cy;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    // правый робот отзеркален, поэтому по x наоборот
    this.eyeX = (dx / len) * 4 * (this.side() === 'right' ? -1 : 1);
    this.eyeY = (dy / len) * 3;
  }
}
