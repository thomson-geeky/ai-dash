import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KPI } from '../../types/models';
import { SparklineComponent } from '../sparkline/sparkline.component';

@Component({
  selector: 'app-kpi-card',
  standalone: true,
  imports: [CommonModule, SparklineComponent],
  template: `
    <div class="floating-card lift-on-hover whitespace-lg">
      <!-- Header: Label + Trend Badge -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <h3 class="text-sm font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">
            {{ kpi.label }}
          </h3>
        </div>
        @if (kpi.trend && kpi.change !== undefined) {
          <span
            [class]="getTrendBadgeClasses()"
            class="badge scale-on-press"
            [attr.aria-label]="getTrendLabel()"
          >
            <span>{{ getTrendIcon() }}</span>
            <span class="font-bold">{{ formatChange(kpi.change) }}</span>
          </span>
        }
      </div>

      <!-- Value: Large, bold, gradient text -->
      <div class="mb-6">
        <p class="text-4xl font-extrabold gradient-text leading-tight">
          {{ kpi.value }}
        </p>
      </div>

      <!-- Sparkline visualization -->
      @if (kpi.sparklineData && kpi.sparklineData.length > 0) {
        <div class="mb-4">
          <app-sparkline
            [data]="kpi.sparklineData"
            [width]="140"
            [height]="40"
            [color]="getSparklineColor()"
            [strokeWidth]="3"
            [showArea]="true"
            [showDot]="true"
          ></app-sparkline>
        </div>
      }

      <!-- Change Description -->
      @if (kpi.change !== undefined) {
        <p class="text-sm text-slate-600 dark:text-slate-400 font-medium">
          <span [class]="getChangeTextColor()">{{ formatChange(kpi.change) }}</span>
          <span> from last period</span>
        </p>
      }
    </div>
  `,
  styles: []
})
export class KpiCardComponent {
  @Input({ required: true }) kpi!: KPI;

  getTrendBadgeClasses(): string {
    switch (this.kpi.trend) {
      case 'up':
        return 'badge-success';
      case 'down':
        return 'badge-danger';
      case 'neutral':
        return 'badge-info';
      default:
        return 'badge-info';
    }
  }

  getTrendIcon(): string {
    switch (this.kpi.trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      case 'neutral':
        return '→';
      default:
        return '';
    }
  }

  getTrendLabel(): string {
    const direction = this.kpi.trend === 'up' ? 'increased' : this.kpi.trend === 'down' ? 'decreased' : 'unchanged';
    return `${this.kpi.label} has ${direction}`;
  }

  formatChange(change: number): string {
    const sign = change > 0 ? '+' : '';
    return `${sign}${change.toFixed(1)}%`;
  }

  getChangeTextColor(): string {
    if (this.kpi.trend === 'up') {
      return 'text-success-600 dark:text-success-400 font-bold';
    } else if (this.kpi.trend === 'down') {
      return 'text-danger-600 dark:text-danger-400 font-bold';
    }
    return 'text-slate-600 dark:text-slate-400';
  }

  getSparklineColor(): string {
    // Use custom color if provided
    if (this.kpi.sparklineColor) {
      return this.kpi.sparklineColor;
    }

    // Color based on trend
    if (this.kpi.trend === 'up') {
      return '#10b981'; // success green
    } else if (this.kpi.trend === 'down') {
      return '#ef4444'; // danger red
    }

    // Default to primary gradient color
    return '#22c55e';
  }
}
