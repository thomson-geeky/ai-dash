import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEchartsModule } from 'ngx-echarts';
import { EChartsOption } from 'echarts';
import { Project } from '../../types/models';

@Component({
  selector: 'app-charts-panel',
  standalone: true,
  imports: [CommonModule, NgxEchartsModule],
  template: `
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Workflow Status Pie -->
      <div class="glass-card p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Workflow Status</h3>
        <div echarts [options]="workflowStatusOption" [autoResize]="true" class="w-full" style="height: 300px;"></div>
      </div>

      <!-- Workload by Department Bar -->
      <div class="glass-card p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Workload by Department</h3>
        <div echarts [options]="workloadByDeptOption" [autoResize]="true" class="w-full" style="height: 300px;"></div>
      </div>

      <!-- Budget Utilization Trend -->
      <div class="glass-card p-6 lg:col-span-2">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Budget Utilization & Forecast</h3>
        <div echarts [options]="budgetTrendOption" [autoResize]="true" class="w-full" style="height: 350px;"></div>
      </div>

      <!-- Delay Analysis Line -->
      <div class="glass-card p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Delay Analysis</h3>
        <div echarts [options]="delayAnalysisOption" [autoResize]="true" class="w-full" style="height: 300px;"></div>
      </div>

      <!-- Risk vs Reward Scatter -->
      <div class="glass-card p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Risk vs Reward</h3>
        <div echarts [options]="riskRewardOption" [autoResize]="true" (chartClick)="onChartClick($event)" class="w-full cursor-pointer" style="height: 300px;"></div>
      </div>

      <!-- Efficiency Heatmap -->
      <div class="glass-card p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Efficiency Heatmap</h3>
        <div echarts [options]="efficiencyHeatmapOption" [autoResize]="true" class="w-full" style="height: 350px;"></div>
      </div>

      <!-- Resource Allocation Radar -->
      <div class="glass-card p-6">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Resource Allocation</h3>
        <div echarts [options]="resourceRadarOption" [autoResize]="true" class="w-full" style="height: 350px;"></div>
      </div>

      <!-- Task Phase Analysis Stacked Bar -->
      <div class="glass-card p-6 lg:col-span-2">
        <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">Task Phase Distribution</h3>
        <div echarts [options]="taskPhaseOption" [autoResize]="true" class="w-full" style="height: 300px;"></div>
      </div>
    </div>
  `,
  styles: []
})
export class ChartsPanelComponent implements OnChanges {
  @Input() projects: Project[] = [];
  @Input() isDarkMode: boolean = false;
  @Output() projectClick = new EventEmitter<Project>();

  workflowStatusOption!: EChartsOption;
  workloadByDeptOption!: EChartsOption;
  budgetTrendOption!: EChartsOption;
  delayAnalysisOption!: EChartsOption;
  riskRewardOption!: EChartsOption;
  efficiencyHeatmapOption!: EChartsOption;
  resourceRadarOption!: EChartsOption;
  taskPhaseOption!: EChartsOption;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['projects'] || changes['isDarkMode']) {
      this.updateCharts();
    }
  }

  private updateCharts(): void {
    this.workflowStatusOption = this.getWorkflowStatusChart();
    this.workloadByDeptOption = this.getWorkloadByDeptChart();
    this.budgetTrendOption = this.getBudgetTrendChart();
    this.delayAnalysisOption = this.getDelayAnalysisChart();
    this.riskRewardOption = this.getRiskRewardChart();
    this.efficiencyHeatmapOption = this.getEfficiencyHeatmapChart();
    this.resourceRadarOption = this.getResourceRadarChart();
    this.taskPhaseOption = this.getTaskPhaseChart();
  }

  private getThemeColors() {
    return {
      text: this.isDarkMode ? '#f1f5f9' : '#0f172a',
      subtext: this.isDarkMode ? '#cbd5e1' : '#475569',
      background: this.isDarkMode ? '#1e293b' : '#ffffff',
      primary: ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#6366f1'],
      success: '#10b981',
      warning: '#f59e0b',
      danger: '#ef4444',
    };
  }

  private getWorkflowStatusChart(): EChartsOption {
    const colors = this.getThemeColors();
    const statusCounts = this.projects.reduce((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const statusColors: Record<string, string> = {
      'On Track': colors.success,
      'In Progress': colors.primary[0],
      'Delayed': colors.warning,
      'Blocked': colors.danger
    };

    return {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        bottom: '5%',
        left: 'center',
        textStyle: { color: colors.text }
      },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: colors.background,
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}\n{d}%',
          color: colors.text
        },
        emphasis: {
          label: { show: true, fontSize: 16, fontWeight: 'bold' },
          itemStyle: { shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0, 0, 0, 0.5)' }
        },
        data: Object.entries(statusCounts).map(([name, value]) => ({
          name,
          value,
          itemStyle: { color: statusColors[name] || colors.primary[0] }
        })),
        animationType: 'scale',
        animationEasing: 'elasticOut',
        animationDelay: () => Math.random() * 200
      }]
    };
  }

  private getWorkloadByDeptChart(): EChartsOption {
    const colors = this.getThemeColors();
    const deptCounts = this.projects.reduce((acc, p) => {
      acc[p.department] = (acc[p.department] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: Object.keys(deptCounts),
        axisLabel: {
          color: colors.text,
          rotate: 30,
          interval: 0
        },
        axisLine: { lineStyle: { color: colors.subtext } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: colors.text },
        axisLine: { lineStyle: { color: colors.subtext } },
        splitLine: { lineStyle: { color: this.isDarkMode ? '#334155' : '#e2e8f0' } }
      },
      series: [{
        type: 'bar',
        data: Object.values(deptCounts),
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#667eea' },
              { offset: 1, color: '#764ba2' }
            ]
          },
          borderRadius: [8, 8, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#7c8ef5' },
                { offset: 1, color: '#8b5cb8' }
              ]
            }
          }
        },
        animationDelay: (idx: number) => idx * 50
      }]
    };
  }

  private getBudgetTrendChart(): EChartsOption {
    const colors = this.getThemeColors();
    const sortedProjects = [...this.projects].sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

    const dates = sortedProjects.map(p => p.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    const allocated = sortedProjects.map(p => p.budgetAllocated);
    const spent = sortedProjects.map(p => p.budgetSpent);

    // Simple forecast (last value + 10% growth)
    const lastSpent = spent[spent.length - 1] || 0;
    const forecast = spent.map((_, i) => i < spent.length - 5 ? null : lastSpent * (1 + (i - spent.length + 5) * 0.02));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: ['Budget Allocated', 'Budget Spent', 'Forecast'],
        top: '0%',
        textStyle: { color: colors.text }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: { color: colors.text, rotate: 45 },
        axisLine: { lineStyle: { color: colors.subtext } }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: colors.text,
          formatter: (value: number) => '$' + (value / 1000).toFixed(0) + 'K'
        },
        axisLine: { lineStyle: { color: colors.subtext } },
        splitLine: { lineStyle: { color: this.isDarkMode ? '#334155' : '#e2e8f0' } }
      },
      series: [
        {
          name: 'Budget Allocated',
          type: 'line',
          data: allocated,
          smooth: true,
          lineStyle: { width: 2, color: colors.primary[0] },
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(14, 165, 233, 0.3)' },
                { offset: 1, color: 'rgba(14, 165, 233, 0.05)' }
              ]
            }
          }
        },
        {
          name: 'Budget Spent',
          type: 'line',
          data: spent,
          smooth: true,
          lineStyle: { width: 2, color: colors.success },
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.05)' }
              ]
            }
          }
        },
        {
          name: 'Forecast',
          type: 'line',
          data: forecast,
          smooth: true,
          lineStyle: { width: 2, type: 'dashed', color: colors.warning },
          showSymbol: false
        }
      ]
    };
  }

  private getDelayAnalysisChart(): EChartsOption {
    const colors = this.getThemeColors();
    const delayedProjects = this.projects.filter(p => p.delayDays > 0).sort((a, b) => a.delayDays - b.delayDays);

    const names = delayedProjects.slice(0, 10).map(p => p.name.substring(0, 20));
    const delays = delayedProjects.slice(0, 10).map(p => p.delayDays);

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'line' }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          color: colors.text,
          rotate: 30,
          interval: 0,
          formatter: (value: string) => value.length > 15 ? value.substring(0, 15) + '...' : value
        },
        axisLine: { lineStyle: { color: colors.subtext } }
      },
      yAxis: {
        type: 'value',
        name: 'Days',
        axisLabel: { color: colors.text },
        axisLine: { lineStyle: { color: colors.subtext } },
        splitLine: { lineStyle: { color: this.isDarkMode ? '#334155' : '#e2e8f0' } }
      },
      series: [{
        type: 'line',
        data: delays,
        smooth: true,
        lineStyle: { width: 3, color: colors.danger },
        itemStyle: {
          color: colors.danger,
          borderColor: colors.danger,
          borderWidth: 2
        },
        symbol: 'circle',
        symbolSize: 8,
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: colors.danger }
        },
        markLine: {
          data: [{ type: 'average', name: 'Average' }],
          lineStyle: { color: colors.warning }
        }
      }]
    };
  }

  private getRiskRewardChart(): EChartsOption {
    const colors = this.getThemeColors();
    const data = this.projects.map(p => ({
      value: [p.risk, p.reward, p.id],
      name: p.name,
      itemStyle: {
        color: p.risk > 70 ? colors.danger : p.risk > 40 ? colors.warning : colors.success
      }
    }));

    return {
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const data = params.data;
          return `<strong>${data.name}</strong><br/>Risk: ${data.value[0]}<br/>Reward: ${data.value[1]}`;
        }
      },
      grid: {
        left: '3%',
        right: '7%',
        bottom: '7%',
        top: '3%',
        containLabel: true
      },
      xAxis: {
        name: 'Risk',
        nameLocation: 'middle',
        nameGap: 30,
        nameTextStyle: { color: colors.text, fontWeight: 'bold' },
        min: 0,
        max: 100,
        axisLabel: { color: colors.text },
        axisLine: { lineStyle: { color: colors.subtext } },
        splitLine: { lineStyle: { color: this.isDarkMode ? '#334155' : '#e2e8f0' } }
      },
      yAxis: {
        name: 'Reward',
        nameLocation: 'middle',
        nameGap: 40,
        nameTextStyle: { color: colors.text, fontWeight: 'bold' },
        min: 0,
        max: 100,
        axisLabel: { color: colors.text },
        axisLine: { lineStyle: { color: colors.subtext } },
        splitLine: { lineStyle: { color: this.isDarkMode ? '#334155' : '#e2e8f0' } }
      },
      series: [{
        type: 'scatter',
        data: data,
        symbolSize: 12,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          scale: 1.5
        }
      }]
    };
  }

  private getEfficiencyHeatmapChart(): EChartsOption {
    const colors = this.getThemeColors();
    const departments = Array.from(new Set(this.projects.map(p => p.department)));
    const regions = Array.from(new Set(this.projects.map(p => p.region)));

    const heatmapData: any[] = [];
    departments.forEach((dept, deptIdx) => {
      regions.forEach((region, regionIdx) => {
        const relevantProjects = this.projects.filter(p => p.department === dept && p.region === region);
        if (relevantProjects.length > 0) {
          const avgEfficiency = relevantProjects.reduce((sum, p) => sum + p.efficiency, 0) / relevantProjects.length;
          heatmapData.push([deptIdx, regionIdx, Math.round(avgEfficiency)]);
        }
      });
    });

    return {
      tooltip: {
        position: 'top',
        formatter: (params: any) => {
          const [deptIdx, regionIdx, value] = params.data;
          return `${departments[deptIdx]}<br/>${regions[regionIdx]}<br/>Efficiency: ${value}%`;
        }
      },
      grid: {
        left: '15%',
        right: '4%',
        bottom: '15%',
        top: '3%',
        containLabel: false
      },
      xAxis: {
        type: 'category',
        data: departments,
        axisLabel: { color: colors.text, rotate: 30 },
        splitArea: { show: true }
      },
      yAxis: {
        type: 'category',
        data: regions,
        axisLabel: { color: colors.text }
      },
      visualMap: {
        min: 0,
        max: 100,
        calculable: true,
        orient: 'horizontal',
        left: 'center',
        bottom: '0%',
        textStyle: { color: colors.text },
        inRange: {
          color: ['#ef4444', '#f59e0b', '#fbbf24', '#a3e635', '#10b981']
        }
      },
      series: [{
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
          color: colors.text,
          fontWeight: 'bold'
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }]
    };
  }

  private getResourceRadarChart(): EChartsOption {
    const colors = this.getThemeColors();
    const departments = Array.from(new Set(this.projects.map(p => p.department)));

    const avgMetrics = departments.map(dept => {
      const deptProjects = this.projects.filter(p => p.department === dept);
      if (deptProjects.length === 0) return [0, 0, 0, 0, 0];

      return [
        deptProjects.reduce((sum, p) => sum + p.progress, 0) / deptProjects.length,
        deptProjects.reduce((sum, p) => sum + p.efficiency, 0) / deptProjects.length,
        100 - (deptProjects.reduce((sum, p) => sum + p.risk, 0) / deptProjects.length),
        deptProjects.reduce((sum, p) => sum + p.reward, 0) / deptProjects.length,
        deptProjects.reduce((sum, p) => sum + (p.budgetSpent / p.budgetAllocated * 100), 0) / deptProjects.length
      ];
    });

    return {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '5%',
        textStyle: { color: colors.text },
        data: departments
      },
      radar: {
        indicator: [
          { name: 'Progress', max: 100 },
          { name: 'Efficiency', max: 100 },
          { name: 'Low Risk', max: 100 },
          { name: 'Reward', max: 100 },
          { name: 'Budget Usage', max: 100 }
        ],
        axisName: {
          color: colors.text
        },
        splitLine: {
          lineStyle: { color: this.isDarkMode ? '#334155' : '#e2e8f0' }
        },
        splitArea: {
          areaStyle: {
            color: this.isDarkMode ? ['#1e293b', '#0f172a'] : ['#f8fafc', '#f1f5f9']
          }
        }
      },
      series: [{
        type: 'radar',
        data: departments.map((dept, idx) => ({
          value: avgMetrics[idx],
          name: dept,
          areaStyle: { opacity: 0.3 },
          lineStyle: { width: 2 }
        }))
      }]
    };
  }

  private getTaskPhaseChart(): EChartsOption {
    const colors = this.getThemeColors();
    const departments = Array.from(new Set(this.projects.map(p => p.department)));
    const phases = ['Planning', 'Execution', 'Monitoring', 'Closure'];

    const phaseData = phases.map(phase => ({
      name: phase,
      type: 'bar',
      stack: 'total',
      emphasis: { focus: 'series' },
      data: departments.map(dept =>
        this.projects.filter(p => p.department === dept && p.phase === phase).length
      )
    }));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      legend: {
        data: phases,
        top: '0%',
        textStyle: { color: colors.text }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '12%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: departments,
        axisLabel: { color: colors.text, rotate: 30 },
        axisLine: { lineStyle: { color: colors.subtext } }
      },
      yAxis: {
        type: 'value',
        axisLabel: { color: colors.text },
        axisLine: { lineStyle: { color: colors.subtext } },
        splitLine: { lineStyle: { color: this.isDarkMode ? '#334155' : '#e2e8f0' } }
      },
      series: phaseData.map((series, idx) => ({
        ...series,
        itemStyle: {
          color: colors.primary[idx],
          borderRadius: idx === phases.length - 1 ? [8, 8, 0, 0] as any : 0
        }
      })) as any
    };
  }

  onChartClick(event: any): void {
    if (event.data?.value && event.data.value[2]) {
      const projectId = event.data.value[2];
      const project = this.projects.find(p => p.id === projectId);
      if (project) {
        this.projectClick.emit(project);
      }
    }
  }
}
