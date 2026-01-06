import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../types/models';

type SortColumn = 'name' | 'department' | 'status' | 'risk' | 'progress';
type SortDirection = 'asc' | 'desc' | null;

@Component({
  selector: 'app-projects-table',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="floating-card whitespace-lg">
      <!-- Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h3 class="text-lg font-bold text-slate-900 dark:text-slate-100">
            Projects
          </h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
            {{ sortedProjects().length }} projects total
          </p>
        </div>

        <!-- Sort Dropdown -->
        <div class="relative">
          <button
            (click)="toggleSortDropdown()"
            class="btn-pill btn-pill-secondary text-sm"
          >
            <span>⬍</span>
            <span>Sort</span>
          </button>

          @if (showSortDropdown()) {
            <div class="dropdown-menu">
              <button
                (click)="sort('name')"
                class="dropdown-item"
              >
                Name {{ getSortIcon('name') }}
              </button>
              <button
                (click)="sort('status')"
                class="dropdown-item"
              >
                Status {{ getSortIcon('status') }}
              </button>
              <button
                (click)="sort('progress')"
                class="dropdown-item"
              >
                Progress {{ getSortIcon('progress') }}
              </button>
              <button
                (click)="sort('risk')"
                class="dropdown-item"
              >
                Risk {{ getSortIcon('risk') }}
              </button>
            </div>
          }
        </div>
      </div>

      <!-- Task Rows List -->
      <div class="space-y-3">
        @if (paginatedProjects().length === 0) {
          <!-- Empty State -->
          <div class="py-12 text-center">
            <div class="w-16 h-16 mx-auto mb-4 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center">
              <span class="text-3xl">📁</span>
            </div>
            <p class="text-slate-600 dark:text-slate-400 font-medium">
              No projects found
            </p>
            <p class="text-sm text-slate-500 dark:text-slate-500 mt-1">
              Try adjusting your filters
            </p>
          </div>
        }

        @for (project of paginatedProjects(); track project.id) {
          <div
            class="task-row scale-on-press cursor-pointer"
            (click)="onProjectClick(project)"
            (keydown.enter)="onProjectClick(project)"
            tabindex="0"
            [attr.aria-label]="'View details for ' + project.name"
          >
            <!-- Left: Icon Button -->
            <div
              class="task-row-icon"
              [class]="getProjectIconClass(project.status)"
            >
              <span class="text-lg">{{ getProjectIcon(project.status) }}</span>
            </div>

            <!-- Middle: Title + Metadata -->
            <div class="task-row-content">
              <div class="task-row-title">
                {{ project.name }}
              </div>
              <div class="task-row-meta flex items-center gap-2">
                <span>{{ project.department }}</span>
                <span>•</span>
                <span>{{ project.region }}</span>
                <span>•</span>
                <span [class]="getStatusTextClass(project.status)">
                  {{ project.status }}
                </span>
                @if (project.delayDays > 0) {
                  <span>•</span>
                  <span class="text-danger-600 dark:text-danger-400 font-semibold">
                    +{{ project.delayDays }}d delay
                  </span>
                }
              </div>
            </div>

            <!-- Right: Progress + Action -->
            <div class="task-row-action flex items-center gap-4">
              <!-- Progress Bar -->
              <div class="flex items-center gap-3 min-w-[140px]">
                <div class="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-300"
                    [class]="getProgressBarClass(project.status)"
                    [style.width.%]="project.progress"
                  ></div>
                </div>
                <span class="text-sm font-semibold text-slate-700 dark:text-slate-300 min-w-[40px] text-right">
                  {{ project.progress }}%
                </span>
              </div>

              <!-- Action Button -->
              <button
                class="btn-pill btn-pill-secondary text-xs"
                (click)="onActionClick($event, project)"
                [attr.aria-label]="'View ' + project.name"
              >
                <span>View</span>
                <span>→</span>
              </button>
            </div>
          </div>
        }
      </div>

      <!-- Pagination -->
      @if (totalPages() > 1) {
        <div class="flex items-center justify-between mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div class="text-sm text-slate-600 dark:text-slate-400">
            Showing {{ (currentPage() - 1) * pageSize() + 1 }}–{{ Math.min(currentPage() * pageSize(), sortedProjects().length) }} of {{ sortedProjects().length }}
          </div>
          <div class="flex gap-2">
            <button
              (click)="previousPage()"
              [disabled]="currentPage() === 1"
              class="icon-btn scale-on-press"
              [class.opacity-50]="currentPage() === 1"
              [class.cursor-not-allowed]="currentPage() === 1"
              aria-label="Previous page"
            >
              <span>←</span>
            </button>

            @for (page of getPageNumbers(); track page) {
              <button
                (click)="goToPage(page)"
                [class]="page === currentPage() ? 'icon-btn icon-btn-active' : 'icon-btn'"
                class="scale-on-press"
                [attr.aria-label]="'Go to page ' + page"
                [attr.aria-current]="page === currentPage() ? 'page' : null"
              >
                <span class="text-sm font-semibold">{{ page }}</span>
              </button>
            }

            <button
              (click)="nextPage()"
              [disabled]="currentPage() === totalPages()"
              class="icon-btn scale-on-press"
              [class.opacity-50]="currentPage() === totalPages()"
              [class.cursor-not-allowed]="currentPage() === totalPages()"
              aria-label="Next page"
            >
              <span>→</span>
            </button>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .dropdown-menu {
      position: absolute;
      top: calc(100% + 8px);
      right: 0;
      min-width: 180px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: 16px;
      box-shadow: var(--shadow-soft-xl);
      padding: 8px;
      z-index: 50;
      animation: slideUp 0.2s ease-out;
    }

    .dropdown-item {
      display: block;
      width: 100%;
      padding: 10px 16px;
      text-align: left;
      font-size: 14px;
      font-weight: 500;
      color: var(--text-primary);
      background: transparent;
      border: none;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .dropdown-item:hover {
      background: var(--bg-tertiary);
    }
  `]
})
export class ProjectsTableComponent implements OnChanges {
  @Input() projects: Project[] = [];
  @Output() projectSelect = new EventEmitter<Project>();

  Math = Math;

  private projectsSignal = signal<Project[]>([]);
  private sortColumnSignal = signal<SortColumn | null>(null);
  private sortDirectionSignal = signal<SortDirection>(null);
  private currentPageSignal = signal<number>(1);
  private pageSizeSignal = signal<number>(8);
  private showSortDropdownSignal = signal<boolean>(false);

  sortColumn = this.sortColumnSignal.asReadonly();
  sortDirection = this.sortDirectionSignal.asReadonly();
  currentPage = this.currentPageSignal.asReadonly();
  pageSize = this.pageSizeSignal.asReadonly();
  showSortDropdown = this.showSortDropdownSignal.asReadonly();

  sortedProjects = computed(() => {
    let sorted = [...this.projectsSignal()];
    const col = this.sortColumn();
    const dir = this.sortDirection();

    if (col && dir) {
      sorted.sort((a, b) => {
        let aVal: any = a[col];
        let bVal: any = b[col];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return sorted;
  });

  totalPages = computed(() => Math.ceil(this.sortedProjects().length / this.pageSize()));

  paginatedProjects = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return this.sortedProjects().slice(start, end);
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects']) {
      this.projectsSignal.set(this.projects);
      this.currentPageSignal.set(1);
    }
  }

  toggleSortDropdown(): void {
    this.showSortDropdownSignal.update(v => !v);
  }

  sort(column: SortColumn): void {
    if (this.sortColumn() === column) {
      if (this.sortDirection() === 'asc') {
        this.sortDirectionSignal.set('desc');
      } else {
        this.sortDirectionSignal.set(null);
        this.sortColumnSignal.set(null);
      }
    } else {
      this.sortColumnSignal.set(column);
      this.sortDirectionSignal.set('asc');
    }
    this.currentPageSignal.set(1);
    this.showSortDropdownSignal.set(false);
  }

  getSortIcon(column: SortColumn): string {
    if (this.sortColumn() !== column) return '';
    return this.sortDirection() === 'asc' ? '↑' : '↓';
  }

  getProjectIcon(status: string): string {
    switch (status) {
      case 'On Track': return '✓';
      case 'In Progress': return '⟳';
      case 'Delayed': return '⚠';
      case 'Blocked': return '⊘';
      default: return '◯';
    }
  }

  getProjectIconClass(status: string): string {
    switch (status) {
      case 'On Track':
        return 'bg-gradient-to-br from-success-100 to-success-200 dark:from-success-900/30 dark:to-success-800/30 text-success-700 dark:text-success-400';
      case 'In Progress':
        return 'bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-emerald-400';
      case 'Delayed':
        return 'bg-gradient-to-br from-warning-100 to-warning-200 dark:from-warning-900/30 dark:to-warning-800/30 text-warning-700 dark:text-warning-400';
      case 'Blocked':
        return 'bg-gradient-to-br from-danger-100 to-danger-200 dark:from-danger-900/30 dark:to-danger-800/30 text-danger-700 dark:text-danger-400';
      default:
        return 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 text-slate-700 dark:text-slate-400';
    }
  }

  getStatusTextClass(status: string): string {
    switch (status) {
      case 'On Track':
        return 'text-success-600 dark:text-success-400 font-semibold';
      case 'In Progress':
        return 'text-green-600 dark:text-emerald-400 font-semibold';
      case 'Delayed':
        return 'text-warning-600 dark:text-warning-400 font-semibold';
      case 'Blocked':
        return 'text-danger-600 dark:text-danger-400 font-semibold';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  }

  getProgressBarClass(status: string): string {
    switch (status) {
      case 'On Track':
        return 'bg-gradient-to-r from-success-500 to-success-600';
      case 'In Progress':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'Delayed':
        return 'bg-gradient-to-r from-warning-500 to-warning-600';
      case 'Blocked':
        return 'bg-gradient-to-r from-danger-500 to-danger-600';
      default:
        return 'bg-gradient-to-r from-slate-500 to-slate-600';
    }
  }

  previousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPageSignal.update(page => page - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPageSignal.update(page => page + 1);
    }
  }

  goToPage(page: number): void {
    this.currentPageSignal.set(page);
  }

  getPageNumbers(): number[] {
    const total = this.totalPages();
    const current = this.currentPage();
    const pages: number[] = [];

    if (total <= 5) {
      for (let i = 1; i <= total; i++) {
        pages.push(i);
      }
    } else {
      if (current <= 2) {
        pages.push(1, 2, 3);
      } else if (current >= total - 1) {
        pages.push(total - 2, total - 1, total);
      } else {
        pages.push(current - 1, current, current + 1);
      }
    }

    return pages;
  }

  onProjectClick(project: Project): void {
    this.projectSelect.emit(project);
  }

  onActionClick(event: Event, project: Project): void {
    event.stopPropagation();
    this.projectSelect.emit(project);
  }
}
