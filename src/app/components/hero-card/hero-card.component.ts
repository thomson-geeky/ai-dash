import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-gradient-card lift-on-hover">
      <div class="relative z-10">
        <!-- Icon/Illustration placeholder -->
        <div class="mb-6">
          <div class="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center text-5xl backdrop-blur-sm">
            {{ icon }}
          </div>
        </div>

        <!-- Content -->
        <div class="mb-6">
          <h2 class="text-2xl font-bold text-white mb-3">
            {{ title }}
          </h2>
          <p class="text-white/90 text-base leading-relaxed max-w-md">
            {{ description }}
          </p>
        </div>

        <!-- CTA Button -->
        @if (ctaLabel) {
          <button
            (click)="onCtaClick()"
            class="btn-pill bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm scale-on-press"
          >
            <span>{{ ctaLabel }}</span>
            <span>→</span>
          </button>
        }
      </div>

      <!-- Background decoration -->
      <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -z-10"></div>
      <div class="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -z-10"></div>
    </div>
  `,
  styles: []
})
export class HeroCardComponent {
  @Input() icon: string = '🎯';
  @Input() title: string = 'Create New Milestone';
  @Input() description: string = 'Set up a new project milestone to track progress and deliverables.';
  @Input() ctaLabel: string = '+ Create Milestone';
  @Output() ctaClick = new EventEmitter<void>();

  onCtaClick(): void {
    this.ctaClick.emit();
  }
}
