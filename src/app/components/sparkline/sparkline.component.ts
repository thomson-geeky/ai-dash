import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sparkline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg
      [attr.width]="width"
      [attr.height]="height"
      class="sparkline-svg"
      [attr.aria-label]="'Trend graph showing ' + data.length + ' data points'"
      role="img"
    >
      <!-- Background gradient (optional) -->
      <defs>
        <linearGradient [id]="gradientId" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" [attr.stop-color]="color" stop-opacity="0.3"/>
          <stop offset="100%" [attr.stop-color]="color" stop-opacity="0.05"/>
        </linearGradient>
      </defs>

      <!-- Area fill -->
      @if (showArea && areaPath) {
        <path
          [attr.d]="areaPath"
          [attr.fill]="'url(#' + gradientId + ')'"
        />
      }

      <!-- Line path -->
      @if (linePath) {
        <path
          [attr.d]="linePath"
          [attr.stroke]="color"
          [attr.stroke-width]="strokeWidth"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="sparkline-path"
        />
      }

      <!-- End point dot -->
      @if (showDot && points.length > 0) {
        <circle
          [attr.cx]="points[points.length - 1].x"
          [attr.cy]="points[points.length - 1].y"
          [attr.r]="dotRadius"
          [attr.fill]="color"
          class="sparkline-dot"
        />
      }
    </svg>
  `,
  styles: [`
    .sparkline-svg {
      display: block;
    }

    .sparkline-path {
      transition: stroke-dashoffset 0.5s ease-out;
    }

    .sparkline-dot {
      filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.3));
    }
  `]
})
export class SparklineComponent implements OnChanges {
  @Input() data: number[] = [];
  @Input() width: number = 80;
  @Input() height: number = 24;
  @Input() color: string = '#0ea5e9';
  @Input() strokeWidth: number = 2;
  @Input() showArea: boolean = true;
  @Input() showDot: boolean = true;
  @Input() dotRadius: number = 2.5;
  @Input() padding: number = 2;

  linePath: string = '';
  areaPath: string = '';
  points: { x: number; y: number }[] = [];
  gradientId: string = `gradient-${Math.random().toString(36).substr(2, 9)}`;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['width'] || changes['height']) {
      this.generatePaths();
    }
  }

  private generatePaths(): void {
    if (!this.data || this.data.length === 0) {
      this.linePath = '';
      this.areaPath = '';
      this.points = [];
      return;
    }

    const data = this.data;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1; // Avoid division by zero

    const effectiveWidth = this.width - this.padding * 2;
    const effectiveHeight = this.height - this.padding * 2;

    // Calculate points
    this.points = data.map((value, index) => {
      const x = this.padding + (index / (data.length - 1)) * effectiveWidth;
      const y = this.padding + effectiveHeight - ((value - min) / range) * effectiveHeight;
      return { x, y };
    });

    // Generate line path
    this.linePath = this.points.reduce((path, point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${path} ${command} ${point.x},${point.y}`;
    }, '');

    // Generate area path (for gradient fill)
    if (this.showArea) {
      const bottomRight = `L ${this.width - this.padding},${this.height - this.padding}`;
      const bottomLeft = `L ${this.padding},${this.height - this.padding}`;
      const closePath = 'Z';
      this.areaPath = `${this.linePath} ${bottomRight} ${bottomLeft} ${closePath}`;
    }
  }
}
