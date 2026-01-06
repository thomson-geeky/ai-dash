import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Insight {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  category: 'risk' | 'budget' | 'timeline' | 'performance' | 'recommendation';
  actionLabel?: string;
  actionData?: any;
  confidence?: number; // 0-100
}

@Component({
  selector: 'app-ai-insights-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="glass-card overflow-hidden relative">
      <!-- AI Badge -->
      <div class="absolute top-4 right-4 z-10">
        <div class="flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-white text-xs font-semibold shadow-lg">
          <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
          <span>AI Powered</span>
        </div>
      </div>

      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div class="flex items-start gap-3">
          <div class="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
            </svg>
          </div>
          <div class="flex-1">
            <h3 class="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
              AI Insights
            </h3>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Intelligent recommendations based on your data
            </p>
          </div>
        </div>
      </div>

      <!-- Insights List -->
      <div class="divide-y divide-gray-200 dark:divide-gray-700">
        @if (insights.length === 0) {
          <!-- Empty State -->
          <div class="px-6 py-12 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-600 dark:text-gray-400 text-sm">All systems running smoothly!</p>
            <p class="text-gray-400 dark:text-gray-500 text-xs mt-1">No insights to report right now</p>
          </div>
        } @else {
          @for (insight of insights; track insight.id) {
            <div class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-smooth">
              <div class="flex items-start gap-3">
                <!-- Severity Icon -->
                <div [class]="getSeverityIconClass(insight.severity)" class="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center">
                  <span class="text-lg">{{ getSeverityIcon(insight.severity) }}</span>
                </div>

                <!-- Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h4 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {{ insight.title }}
                    </h4>
                    @if (insight.confidence) {
                      <span
                        class="flex-shrink-0 text-xs font-medium text-gray-500 dark:text-gray-400"
                        [attr.title]="'AI Confidence: ' + insight.confidence + '%'"
                      >
                        {{ insight.confidence }}%
                      </span>
                    }
                  </div>

                  <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-2">
                    {{ insight.description }}
                  </p>

                  <!-- Category Badge -->
                  <div class="flex items-center gap-2">
                    <span [class]="getCategoryBadgeClass(insight.category)" class="text-xs font-medium px-2 py-0.5 rounded-full">
                      {{ getCategoryLabel(insight.category) }}
                    </span>

                    <!-- Action Button -->
                    @if (insight.actionLabel) {
                      <button
                        (click)="onActionClick(insight)"
                        class="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 underline focus:outline-none"
                      >
                        {{ insight.actionLabel }} →
                      </button>
                    }
                  </div>
                </div>
              </div>
            </div>
          }
        }
      </div>

      <!-- Footer -->
      @if (insights.length > 0) {
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-600 dark:text-gray-400">
              <span class="font-semibold">{{ insights.length }}</span> insights generated
            </p>
            @if (showDismissAll) {
              <button
                (click)="onDismissAll()"
                class="text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-smooth"
              >
                Dismiss All
              </button>
            }
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class AiInsightsPanelComponent {
  @Input() insights: Insight[] = [];
  @Input() showDismissAll: boolean = false;
  @Output() actionClick = new EventEmitter<Insight>();
  @Output() dismissAll = new EventEmitter<void>();

  getSeverityIcon(severity: string): string {
    const icons: Record<string, string> = {
      critical: '🔴',
      warning: '⚠️',
      info: 'ℹ️',
      success: '✅'
    };
    return icons[severity] || 'ℹ️';
  }

  getSeverityIconClass(severity: string): string {
    const classes: Record<string, string> = {
      critical: 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400',
      warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
      info: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400',
      success: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400'
    };
    return classes[severity] || classes['info'];
  }

  getCategoryBadgeClass(category: string): string {
    const classes: Record<string, string> = {
      risk: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
      budget: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
      timeline: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
      performance: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
      recommendation: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
    };
    return classes[category] || classes['recommendation'];
  }

  getCategoryLabel(category: string): string {
    const labels: Record<string, string> = {
      risk: 'Risk',
      budget: 'Budget',
      timeline: 'Timeline',
      performance: 'Performance',
      recommendation: 'Recommendation'
    };
    return labels[category] || category;
  }

  onActionClick(insight: Insight): void {
    this.actionClick.emit(insight);
  }

  onDismissAll(): void {
    this.dismissAll.emit();
  }
}
