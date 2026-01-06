import { Injectable } from '@angular/core';
import { Project, Filters } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportToCSV(projects: Project[], filename: string = 'projects-export.csv'): void {
    const headers = [
      'ID', 'Name', 'Department', 'Region', 'Status', 'Phase', 'Owner',
      'Start Date', 'End Date', 'Budget Allocated', 'Budget Spent',
      'Risk', 'Reward', 'Efficiency', 'Delay Days', 'Progress'
    ];

    const rows = projects.map(p => [
      p.id,
      `"${p.name}"`,
      p.department,
      p.region,
      p.status,
      p.phase,
      p.owner,
      p.startDate.toISOString().split('T')[0],
      p.endDate.toISOString().split('T')[0],
      p.budgetAllocated,
      p.budgetSpent,
      p.risk,
      p.reward,
      p.efficiency,
      p.delayDays,
      p.progress
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    this.downloadFile(csv, filename, 'text/csv');
  }

  exportToJSON(data: { projects: Project[], filters: Filters }, filename: string = 'dashboard-export.json'): void {
    const json = JSON.stringify(data, null, 2);
    this.downloadFile(json, filename, 'application/json');
  }

  exportSingleProject(project: Project, filename?: string): void {
    const name = filename || `project-${project.id}.json`;
    const json = JSON.stringify(project, null, 2);
    this.downloadFile(json, name, 'application/json');
  }

  printDashboard(): void {
    window.print();
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
