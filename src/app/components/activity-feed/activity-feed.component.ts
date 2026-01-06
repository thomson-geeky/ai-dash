import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Activity } from '../../types/models';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-activity-feed',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger(50, [
            animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  template: `
    <div class="glass-card overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div>
          <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-200">Recent Activity</h3>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Real-time project updates</p>
        </div>
        @if (showViewAll) {
          <button
            (click)="onViewAll()"
            class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500 rounded px-2 py-1"
          >
            View All →
          </button>
        }
      </div>

      <!-- Activity List -->
      <div class="max-h-[480px] overflow-y-auto" [@listAnimation]="activities.length">
        @if (activities.length === 0) {
          <!-- Empty State -->
          <div class="px-6 py-12 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-gray-600 dark:text-gray-400">No recent activity</p>
          </div>
        } @else {
          <div class="divide-y divide-gray-200 dark:divide-gray-700">
            @for (activity of activities; track activity.id) {
              <div
                class="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-smooth cursor-pointer group"
                (click)="onActivityClick(activity)"
                [attr.role]="'button'"
                [attr.tabindex]="0"
                (keydown.enter)="onActivityClick(activity)"
              >
                <div class="flex items-start gap-3">
                  <!-- Icon -->
                  <div
                    [class]="getIconClasses(activity.severity || 'info')"
                    class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    <span class="text-base">{{ getActivityIcon(activity.type) }}</span>
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-smooth">
                      {{ activity.message }}
                    </p>
                    <div class="flex items-center gap-2 mt-1">
                      <span class="text-xs text-gray-500 dark:text-gray-400">
                        {{ activity.projectId }}
                      </span>
                      <span class="text-xs text-gray-400">•</span>
                      <span class="text-xs text-gray-500 dark:text-gray-400" [attr.title]="activity.timestamp.toLocaleString()">
                        {{ getRelativeTime(activity.timestamp) }}
                      </span>
                    </div>
                    @if (activity.metadata && activity.metadata.user) {
                      <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">
                        by {{ activity.metadata.user }}
                      </p>
                    }
                  </div>

                  <!-- Severity Badge (if applicable) -->
                  @if (activity.severity === 'critical' || activity.severity === 'warning') {
                    <div class="flex-shrink-0">
                      <span
                        [class]="getSeverityBadgeClass(activity.severity)"
                        class="px-2 py-1 text-xs font-semibold rounded-full"
                      >
                        {{ activity.severity }}
                      </span>
                    </div>
                  }
                </div>
              </div>
            }
          </div>
        }
      </div>

      <!-- Footer -->
      @if (activities.length > 0 && showRefresh) {
        <div class="px-6 py-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/30">
          <span class="text-xs text-gray-500 dark:text-gray-400">
            Last updated: {{ getLastUpdateTime() }}
          </span>
          <button
            (click)="onRefresh()"
            class="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-smooth focus:outline-none"
            [attr.aria-label]="'Refresh activity feed'"
          >
            ↻ Refresh
          </button>
        </div>
      }
    </div>
  `,
  styles: []
})
export class ActivityFeedComponent {
  @Input() activities: Activity[] = [];
  @Input() maxItems: number = 10;
  @Input() showViewAll: boolean = true;
  @Input() showRefresh: boolean = true;
  @Output() activityClick = new EventEmitter<Activity>();
  @Output() viewAll = new EventEmitter<void>();
  @Output() refresh = new EventEmitter<void>();

  getActivityIcon(type: string): string {
    const icons: Record<string, string> = {
      status_change: '🔄',
      completion: '✅',
      alert: '⚠️',
      milestone: '🎯',
      assignment: '👤',
      budget: '💰',
      delay: '⏱️'
    };
    return icons[type] || 'ℹ️';
  }

  getIconClasses(severity: string): string {
    const classes: Record<string, string> = {
      critical: 'bg-danger-100 dark:bg-danger-900/30 text-danger-600 dark:text-danger-400',
      warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-600 dark:text-warning-400',
      success: 'bg-success-100 dark:bg-success-900/30 text-success-600 dark:text-success-400',
      info: 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
    };
    return classes[severity] || classes['info'];
  }

  getSeverityBadgeClass(severity: string): string {
    const classes: Record<string, string> = {
      critical: 'bg-danger-100 dark:bg-danger-900/30 text-danger-700 dark:text-danger-300',
      warning: 'bg-warning-100 dark:bg-warning-900/30 text-warning-700 dark:text-warning-300'
    };
    return classes[severity] || '';
  }

  getRelativeTime(timestamp: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - timestamp.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return timestamp.toLocaleDateString();
  }

  getLastUpdateTime(): string {
    return new Date().toLocaleTimeString();
  }

  onActivityClick(activity: Activity): void {
    this.activityClick.emit(activity);
  }

  onViewAll(): void {
    this.viewAll.emit();
  }

  onRefresh(): void {
    this.refresh.emit();
  }
}
