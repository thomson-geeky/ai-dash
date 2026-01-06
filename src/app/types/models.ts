export type ProjectStatus = 'On Track' | 'In Progress' | 'Delayed' | 'Blocked';
export type ProjectPhase = 'Planning' | 'Execution' | 'Monitoring' | 'Closure';
export type Department = 'Finance' | 'IT' | 'HR' | 'Logistics' | 'Procurement' | 'Operations';
export type Region = 'North America' | 'Europe' | 'Asia Pacific' | 'Latin America' | 'Middle East';

export interface Project {
  id: string;
  name: string;
  department: Department;
  region: Region;
  status: ProjectStatus;
  phase: ProjectPhase;
  owner: string;
  startDate: Date;
  endDate: Date;
  budgetAllocated: number;
  budgetSpent: number;
  risk: number; // 0-100
  reward: number; // 0-100
  efficiency: number; // 0-100
  delayDays: number;
  progress: number; // 0-100
}

export interface Filters {
  departments: Department[];
  regions: Region[];
  statuses: ProjectStatus[];
  datePreset: 'Last 30 days' | 'Last 90 days' | 'YTD' | 'All';
  search: string;
  maxRisk: number;
  minReward: number;
}

export interface KPI {
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  sparklineData?: number[]; // Historical data points for sparkline (e.g., last 7 or 30 days)
  sparklineColor?: string; // Custom color for the sparkline
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export type ActivityType = 'status_change' | 'completion' | 'alert' | 'milestone' | 'assignment' | 'budget' | 'delay';

export interface Activity {
  id: string;
  type: ActivityType;
  projectId: string;
  projectName: string;
  message: string;
  timestamp: Date;
  icon?: string;
  severity?: 'critical' | 'warning' | 'info' | 'success';
  metadata?: {
    oldValue?: string;
    newValue?: string;
    user?: string;
  };
}
