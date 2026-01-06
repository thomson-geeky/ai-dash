import { Injectable } from '@angular/core';
import { Project, Department, Region, ProjectStatus, ProjectPhase } from '../types/models';

@Injectable({
  providedIn: 'root'
})
export class DemoDataService {
  private departments: Department[] = ['Finance', 'IT', 'HR', 'Logistics', 'Procurement', 'Operations'];
  private regions: Region[] = ['North America', 'Europe', 'Asia Pacific', 'Latin America', 'Middle East'];
  private statuses: ProjectStatus[] = ['On Track', 'In Progress', 'Delayed', 'Blocked'];
  private phases: ProjectPhase[] = ['Planning', 'Execution', 'Monitoring', 'Closure'];

  private projectNames = [
    'Digital Transformation Initiative',
    'Cloud Migration Project',
    'ERP System Upgrade',
    'Customer Portal Redesign',
    'Data Analytics Platform',
    'Mobile App Development',
    'Cybersecurity Enhancement',
    'Supply Chain Optimization',
    'AI Integration Program',
    'Warehouse Automation',
    'Financial Reporting System',
    'HR Management Platform',
    'Marketing Campaign Suite',
    'Inventory Management System',
    'Quality Assurance Framework',
    'Vendor Management Portal',
    'Employee Training Platform',
    'Business Intelligence Dashboard',
    'API Gateway Implementation',
    'Legacy System Modernization'
  ];

  private owners = [
    'Sarah Johnson', 'Michael Chen', 'Emma Williams', 'James Rodriguez',
    'Olivia Brown', 'William Davis', 'Sophia Martinez', 'Lucas Anderson',
    'Isabella Taylor', 'Alexander Lee', 'Mia Thompson', 'Benjamin White',
    'Charlotte Harris', 'Daniel Clark', 'Amelia Lewis', 'Matthew Walker'
  ];

  generateProjects(count: number = 48): Project[] {
    const projects: Project[] = [];
    const seed = 12345; // Deterministic seed
    let random = this.seededRandom(seed);

    for (let i = 0; i < count; i++) {
      const startDate = this.randomDate(random, new Date(2024, 0, 1), new Date(2025, 11, 31));
      const duration = Math.floor(random() * 180) + 30; // 30-210 days
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + duration);

      const budgetAllocated = Math.floor(random() * 900000) + 100000; // $100k-$1M
      const budgetSpentRatio = random() * 1.3; // 0-130% spent
      const budgetSpent = Math.floor(budgetAllocated * budgetSpentRatio);

      const progress = Math.floor(random() * 100);
      const risk = Math.floor(random() * 100);
      const reward = Math.floor(random() * 100);
      const efficiency = Math.max(0, Math.min(100, 100 - (risk / 2) + (progress / 3)));

      const delayDays = risk > 70 ? Math.floor(random() * 30) : (risk > 40 ? Math.floor(random() * 15) : 0);

      let status: ProjectStatus;
      if (risk > 80 || delayDays > 20) status = 'Blocked';
      else if (delayDays > 10) status = 'Delayed';
      else if (progress < 100) status = 'In Progress';
      else status = 'On Track';

      projects.push({
        id: `PRJ-${(i + 1).toString().padStart(4, '0')}`,
        name: this.generateProjectName(i, random),
        department: this.departments[Math.floor(random() * this.departments.length)],
        region: this.regions[Math.floor(random() * this.regions.length)],
        status,
        phase: this.phases[Math.floor(random() * this.phases.length)],
        owner: this.owners[Math.floor(random() * this.owners.length)],
        startDate,
        endDate,
        budgetAllocated,
        budgetSpent,
        risk,
        reward,
        efficiency: Math.floor(efficiency),
        delayDays,
        progress
      });
    }

    return projects;
  }

  private generateProjectName(index: number, random: () => number): string {
    const baseIndex = index % this.projectNames.length;
    const suffix = index >= this.projectNames.length ? ` Phase ${Math.floor(index / this.projectNames.length) + 1}` : '';
    return this.projectNames[baseIndex] + suffix;
  }

  private seededRandom(seed: number): () => number {
    return function() {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  }

  private randomDate(random: () => number, start: Date, end: Date): Date {
    return new Date(start.getTime() + random() * (end.getTime() - start.getTime()));
  }

  getDepartments(): Department[] {
    return [...this.departments];
  }

  getRegions(): Region[] {
    return [...this.regions];
  }

  getStatuses(): ProjectStatus[] {
    return [...this.statuses];
  }

  getPhases(): ProjectPhase[] {
    return [...this.phases];
  }
}
