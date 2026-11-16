import { Directive, ElementRef, OnDestroy, OnInit, inject } from '@angular/core';

// директива: карточка плавно выезжает, когда доходишь до неё прокруткой
@Directive({
  selector: '[reveal]',
  host: { class: 'reveal' },
})
export class Reveal implements OnInit, OnDestroy {
  private el = inject(ElementRef<HTMLElement>);
  private observer?: IntersectionObserver;

  ngOnInit() {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('visible');
            this.observer?.unobserve(e.target);
          }
        }
      },
      { threshold: 0.1 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
