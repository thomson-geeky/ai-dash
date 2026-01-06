# Enterprise Dashboard - AI Analytics Platform

A production-ready SaaS dashboard built with Angular 17+ featuring modern 2026 design aesthetics, comparable to Stripe, Linear, and Vercel dashboards.

## Features

### 🎨 Modern UI/UX
- **Glassmorphism Design**: Translucent cards with backdrop blur effects
- **Ambient Mesh Gradients**: Dynamic animated background gradients
- **Dark Mode Support**: Seamless theme switching with system preference detection
- **Micro-interactions**: Subtle animations and hover effects throughout
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop

### 📊 Dashboard Components
- **KPI Cards**: Key metrics with trend indicators
- **8 Chart Types**:
  - Workflow Status (Pie Chart)
  - Workload by Department (Bar Chart)
  - Budget Utilization & Forecast (Area/Line Chart)
  - Delay Analysis (Line Chart)
  - Risk vs Reward (Scatter Plot with drill-down)
  - Efficiency Heatmap
  - Resource Allocation (Radar Chart)
  - Task Phase Distribution (Stacked Bar Chart)

### 🔍 Advanced Filtering
- Department multi-select filter
- Region multi-select filter
- Status multi-select filter
- Date presets (Last 30/90 days, YTD, All)
- Search with debounce (project name, ID, owner, dept, region)
- Risk level slider (0-100)
- Reward level slider (0-100)
- All filters update charts and tables instantly

### 📋 Projects Management
- **Sortable Table**: Click column headers to sort by any metric
- **Pagination**: Navigate through large datasets efficiently
- **Project Drawer**: Detailed drill-down view with:
  - Project summary and status
  - Progress visualization
  - Risk, Reward, Efficiency metrics
  - Budget breakdown with burn rate
  - Timeline with delay tracking
  - AI-powered severity analysis
  - Quick action buttons

### 📤 Export & Actions
- Export to CSV
- Export to JSON (with filters)
- Print-friendly layout
- Single project export from drawer

### ♿ Accessibility
- WCAG AA compliant
- Keyboard navigation support
- Proper ARIA labels and roles
- Focus management
- Screen reader friendly

## Tech Stack

- **Framework**: Angular 17+ (standalone components)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Apache ECharts (via ngx-echarts)
- **Animations**: Angular Animations
- **State Management**: Signals (Angular 17)

## Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Start development server:
\`\`\`bash
npm start
\`\`\`

3. Open browser to `http://localhost:4200`

### Build for Production

\`\`\`bash
npm run build
\`\`\`

The build artifacts will be stored in the `dist/` directory.

## Project Structure

\`\`\`
src/
├── app/
│   ├── components/
│   │   ├── dashboard/           # Main dashboard orchestrator
│   │   ├── charts-panel/        # All 8 chart visualizations
│   │   ├── filters-bar/         # Multi-filter component
│   │   ├── projects-table/      # Sortable paginated table
│   │   ├── project-drawer/      # Drill-down detail view
│   │   ├── kpi-card/           # KPI metric cards
│   │   ├── skeleton-loader/    # Loading placeholders
│   │   └── toast-container/    # Toast notifications
│   ├── services/
│   │   ├── demo-data.service.ts    # Deterministic data generator
│   │   ├── export.service.ts       # CSV/JSON/Print exports
│   │   ├── toast.service.ts        # Toast notification manager
│   │   └── theme.service.ts        # Dark mode controller
│   ├── types/
│   │   └── models.ts            # TypeScript interfaces
│   ├── app.component.ts         # Root component
│   └── app.config.ts            # App configuration
├── styles.scss                  # Global styles + Tailwind
└── index.html
\`\`\`

## Key Features Explained

### Data Generation
- **Deterministic**: Uses seeded random generation for consistent demo data
- **Realistic**: 48 projects with proper relationships between metrics
- **Diverse**: Covers 6 departments, 5 regions, multiple statuses and phases

### Filtering System
- **Real-time Updates**: All filters apply instantly using computed signals
- **Compound Logic**: Multiple filters work together seamlessly
- **Debounced Search**: 300ms debounce on search input for performance

### Chart Interactions
- **Click-to-Drill**: Scatter plot points open the project drawer
- **Theme-Aware**: Charts automatically adapt colors for dark mode
- **Smooth Animations**: ECharts configured for optimal visual transitions

### Performance
- **Signals**: Angular 17 signals for optimal change detection
- **Computed Values**: Efficient derived state using computed()
- **Lazy Loading**: Components load on demand
- **Skeleton Loaders**: Perceived performance improvement

## Customization

### Colors
Edit `tailwind.config.js` to customize the color palette.

### Charts
Modify chart options in `charts-panel.component.ts` for different visualizations.

### Data
Adjust data generation in `demo-data.service.ts` to match your needs.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## License

MIT

## Credits

Built with Angular 17+ and modern web technologies for a 2026-ready dashboard experience.
