import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Filters, Department, Region, ProjectStatus } from '../../types/models';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-filters-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="glass-card p-6 space-y-6">
      <!-- Search -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
        <input
          type="text"
          [(ngModel)]="searchValue"
          (ngModelChange)="onSearchChange($event)"
          placeholder="Search projects, owner, department..."
          class="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-smooth"
          aria-label="Search projects"
        />
      </div>

      <!-- Filter Pills Row -->
      <div class="flex flex-wrap gap-3">
        <!-- Date Preset -->
        <div class="flex-shrink-0">
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Time Period
          </label>
          <select
            [(ngModel)]="localFilters.datePreset"
            (ngModelChange)="onFilterChange()"
            class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth"
            aria-label="Select time period"
          >
            <option value="Last 30 days">Last 30 days</option>
            <option value="Last 90 days">Last 90 days</option>
            <option value="YTD">Year to Date</option>
            <option value="All">All Time</option>
          </select>
        </div>

        <!-- Department Multi-select -->
        <div class="flex-shrink-0 relative" #deptDropdown>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Departments
          </label>
          <button
            (click)="toggleDropdown('dept')"
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth flex items-center gap-2"
            aria-label="Select departments"
            [attr.aria-expanded]="showDeptDropdown"
          >
            <span>{{ getDepartmentLabel() }}</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
          @if (showDeptDropdown) {
            <div class="absolute z-10 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-scale-in">
              <div class="p-3 space-y-2 max-h-64 overflow-y-auto">
                @for (dept of availableDepartments; track dept) {
                  <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1.5 rounded transition-smooth">
                    <input
                      type="checkbox"
                      [checked]="localFilters.departments.includes(dept)"
                      (change)="toggleDepartment(dept)"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ dept }}</span>
                  </label>
                }
              </div>
            </div>
          }
        </div>

        <!-- Region Multi-select -->
        <div class="flex-shrink-0 relative" #regionDropdown>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Regions
          </label>
          <button
            (click)="toggleDropdown('region')"
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth flex items-center gap-2"
            aria-label="Select regions"
            [attr.aria-expanded]="showRegionDropdown"
          >
            <span>{{ getRegionLabel() }}</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
          @if (showRegionDropdown) {
            <div class="absolute z-10 mt-2 w-56 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-scale-in">
              <div class="p-3 space-y-2 max-h-64 overflow-y-auto">
                @for (region of availableRegions; track region) {
                  <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1.5 rounded transition-smooth">
                    <input
                      type="checkbox"
                      [checked]="localFilters.regions.includes(region)"
                      (change)="toggleRegion(region)"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ region }}</span>
                  </label>
                }
              </div>
            </div>
          }
        </div>

        <!-- Status Multi-select -->
        <div class="flex-shrink-0 relative" #statusDropdown>
          <label class="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1.5">
            Status
          </label>
          <button
            (click)="toggleDropdown('status')"
            class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-smooth flex items-center gap-2"
            aria-label="Select status"
            [attr.aria-expanded]="showStatusDropdown"
          >
            <span>{{ getStatusLabel() }}</span>
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/>
            </svg>
          </button>
          @if (showStatusDropdown) {
            <div class="absolute z-10 mt-2 w-48 rounded-lg shadow-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 animate-scale-in">
              <div class="p-3 space-y-2">
                @for (status of availableStatuses; track status) {
                  <label class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 px-2 py-1.5 rounded transition-smooth">
                    <input
                      type="checkbox"
                      [checked]="localFilters.statuses.includes(status)"
                      (change)="toggleStatus(status)"
                      class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    <span class="text-sm text-gray-700 dark:text-gray-300">{{ status }}</span>
                  </label>
                }
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Sliders Row -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Risk Slider -->
        <div>
          <label class="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span>Max Risk Level</span>
            <span class="text-primary-600 dark:text-primary-400 font-semibold">{{ localFilters.maxRisk }}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            [(ngModel)]="localFilters.maxRisk"
            (ngModelChange)="onFilterChange()"
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            aria-label="Maximum risk level filter"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0 (Low)</span>
            <span>100 (High)</span>
          </div>
        </div>

        <!-- Reward Slider -->
        <div>
          <label class="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <span>Min Reward Level</span>
            <span class="text-primary-600 dark:text-primary-400 font-semibold">{{ localFilters.minReward }}</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            [(ngModel)]="localFilters.minReward"
            (ngModelChange)="onFilterChange()"
            class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary-600"
            aria-label="Minimum reward level filter"
          />
          <div class="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
            <span>0 (Low)</span>
            <span>100 (High)</span>
          </div>
        </div>
      </div>

      <!-- Clear Filters Button -->
      <div class="flex justify-end">
        <button
          (click)="clearFilters()"
          class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary-500"
          aria-label="Clear all filters"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  `,
  styles: []
})
export class FiltersBarComponent implements OnInit, OnChanges {
  @Input() filters!: Filters;
  @Input() availableDepartments: Department[] = [];
  @Input() availableRegions: Region[] = [];
  @Input() availableStatuses: ProjectStatus[] = [];
  @Output() filtersChange = new EventEmitter<Filters>();

  localFilters!: Filters;
  searchValue = '';
  private searchSubject = new Subject<string>();

  showDeptDropdown = false;
  showRegionDropdown = false;
  showStatusDropdown = false;

  constructor() {
    this.searchSubject.pipe(debounceTime(300)).subscribe(value => {
      this.localFilters.search = value;
      this.onFilterChange();
    });
  }

  ngOnInit() {
    this.localFilters = { ...this.filters };
    this.searchValue = this.filters.search;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filters']) {
      // Sync local filters with external changes (e.g., from drawer quick actions)
      // Always sync to ensure UI stays in sync with parent state
      this.localFilters = { ...this.filters };
      this.searchValue = this.filters.search;

      // Close any open dropdowns when filters change externally
      this.showDeptDropdown = false;
      this.showRegionDropdown = false;
      this.showStatusDropdown = false;
    }
  }

  onSearchChange(value: string): void {
    this.searchSubject.next(value);
  }

  toggleDropdown(type: 'dept' | 'region' | 'status'): void {
    if (type === 'dept') {
      this.showDeptDropdown = !this.showDeptDropdown;
      this.showRegionDropdown = false;
      this.showStatusDropdown = false;
    } else if (type === 'region') {
      this.showRegionDropdown = !this.showRegionDropdown;
      this.showDeptDropdown = false;
      this.showStatusDropdown = false;
    } else {
      this.showStatusDropdown = !this.showStatusDropdown;
      this.showDeptDropdown = false;
      this.showRegionDropdown = false;
    }
  }

  toggleDepartment(dept: Department): void {
    const index = this.localFilters.departments.indexOf(dept);
    if (index > -1) {
      this.localFilters.departments = this.localFilters.departments.filter(d => d !== dept);
    } else {
      this.localFilters.departments = [...this.localFilters.departments, dept];
    }
    this.onFilterChange();
  }

  toggleRegion(region: Region): void {
    const index = this.localFilters.regions.indexOf(region);
    if (index > -1) {
      this.localFilters.regions = this.localFilters.regions.filter(r => r !== region);
    } else {
      this.localFilters.regions = [...this.localFilters.regions, region];
    }
    this.onFilterChange();
  }

  toggleStatus(status: ProjectStatus): void {
    const index = this.localFilters.statuses.indexOf(status);
    if (index > -1) {
      this.localFilters.statuses = this.localFilters.statuses.filter(s => s !== status);
    } else {
      this.localFilters.statuses = [...this.localFilters.statuses, status];
    }
    this.onFilterChange();
  }

  getDepartmentLabel(): string {
    const count = this.localFilters.departments.length;
    if (count === 0) return 'All Departments';
    if (count === 1) return this.localFilters.departments[0];
    return `${count} Departments`;
  }

  getRegionLabel(): string {
    const count = this.localFilters.regions.length;
    if (count === 0) return 'All Regions';
    if (count === 1) return this.localFilters.regions[0];
    return `${count} Regions`;
  }

  getStatusLabel(): string {
    const count = this.localFilters.statuses.length;
    if (count === 0) return 'All Statuses';
    if (count === 1) return this.localFilters.statuses[0];
    return `${count} Selected`;
  }

  clearFilters(): void {
    this.localFilters = {
      departments: [],
      regions: [],
      statuses: [],
      datePreset: 'All',
      search: '',
      maxRisk: 100,
      minReward: 0
    };
    this.searchValue = '';
    this.onFilterChange();
  }

  onFilterChange(): void {
    this.filtersChange.emit({ ...this.localFilters });
  }
}
