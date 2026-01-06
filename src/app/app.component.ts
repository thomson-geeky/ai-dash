import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ToastContainerComponent } from './components/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DashboardComponent, ToastContainerComponent],
  template: `
    <!-- Mesh gradient background -->
    <div class="mesh-gradient-bg"></div>

    <!-- Main content -->
    <app-dashboard></app-dashboard>

    <!-- Toast notifications -->
    <app-toast-container></app-toast-container>
  `,
  styles: []
})
export class AppComponent {
  title = 'ai-dashboard';
}
