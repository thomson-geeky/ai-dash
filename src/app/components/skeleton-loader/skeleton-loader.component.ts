import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass">
      @if (type === 'card') {
        <div class="glass-card p-6 space-y-4">
          <div class="skeleton h-6 w-1/3"></div>
          <div class="skeleton h-10 w-1/2"></div>
          <div class="skeleton h-4 w-2/3"></div>
        </div>
      }
      @if (type === 'chart') {
        <div class="glass-card p-6">
          <div class="skeleton h-6 w-1/4 mb-4"></div>
          <div class="skeleton h-64 w-full"></div>
        </div>
      }
      @if (type === 'table') {
        <div class="glass-card p-6 space-y-3">
          <div class="skeleton h-10 w-full"></div>
          @for (row of [1,2,3,4,5]; track row) {
            <div class="skeleton h-16 w-full"></div>
          }
        </div>
      }
      @if (type === 'kpi') {
        <div class="glass-card p-6 space-y-3">
          <div class="skeleton h-4 w-1/2"></div>
          <div class="skeleton h-8 w-2/3"></div>
          <div class="skeleton h-3 w-1/3"></div>
        </div>
      }
    </div>
  `,
  styles: []
})
export class SkeletonLoaderComponent {
  @Input() type: 'card' | 'chart' | 'table' | 'kpi' = 'card';
  @Input() containerClass: string = '';
}
