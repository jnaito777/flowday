# FlowDay Design System

## Overview
FlowDay is a productivity application built with a comprehensive design system based on Figma prototypes. This document outlines the design structure and component hierarchy.

## Color Palette
- **Primary Purple**: #667eea
- **Secondary Purple**: #764ba2
- **Success Green**: #10b981
- **Warning Orange**: #f59e0b
- **Error Red**: #ef4444
- **Gray Scale**: #1a1a1a to #f9fafb

## Typography
- **Font Family**: System UI / Inter (fallback to sans-serif)
- **Headings**: 600-700 weight
- **Body**: 400-500 weight
- **Small Text**: 0.875rem

## Component Architecture

### Core Components
- **Auth**: Authentication (login/signup)
- **TaskInput**: Task creation form
- **TaskList**: Task display grid
- **ScheduleBuilder**: Visual drag-drop scheduler
- **DaySummary**: End-of-day summary with incomplete task indicators
- **UsageStats**: Completion statistics (daily/monthly/yearly)

### Supporting Components
- **TaskCard**: Individual task display
- **ProgressTracker**: Completion progress visualization
- **NavLink**: Navigation items

## Layout Structure

### App Shell
```
App (Main Container)
├── Header (AppHeader with logo & user menu)
├── Navigation Bar (Tasks, Schedule, Summary tabs)
└── Main Content Area
    └── Tab Content (conditional rendering)
```

### Responsive Design
- **Desktop**: Multi-column layouts, full sidebar
- **Tablet**: 2-column layouts
- **Mobile**: Single column, collapsible navigation

## Features Implemented

### 1. Task Management
- Create, read, update, delete tasks
- Task categorization (work, personal, other)
- Task scheduling and time tracking

### 2. Usage Tracking
- Daily completion statistics
- Monthly completion trends
- Yearly completion data
- Incomplete task indicators (red highlighting)

### 3. Visual Scheduler
- Drag-and-drop interface (9AM-5PM)
- Visual time block representation
- Estimated time allocation

### 4. Summary View
- Daily task completion metrics
- Time accuracy tracking
- Productivity score calculation
- Red-highlighted incomplete tasks

### 5. Authentication
- Supabase auth integration
- Email/password signup and login
- Session persistence
- Secure logout

## File Organization

```
src/
├── components/          # React components
│   ├── Auth.tsx        # Login/signup UI
│   ├── TaskInput.tsx   # Task creation form
│   ├── TaskList.tsx    # Task list display
│   ├── ScheduleBuilder.tsx # Visual scheduler
│   ├── DaySummary.tsx  # Summary with incomplete indicators
│   ├── UsageStats.tsx  # Statistics display
│   └── [component].css # Component styles
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication provider
├── hooks/              # Custom React hooks
│   ├── useTasks.ts    # Task CRUD + event recording
│   └── useUserStats.ts # Statistics aggregation
├── lib/                # Utilities & libraries
│   └── supabase.ts    # Supabase client
├── types/              # TypeScript definitions
│   └── index.ts       # Shared types
├── designs/            # Design documentation
│   └── DESIGN_SYSTEM.md # This file
├── styles/             # Global styles
│   └── globals.css    # Tailwind setup
└── App.tsx            # Main app component
```

## Database Schema

### Users (via Supabase Auth)
- id (UUID)
- email
- created_at

### Tasks Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  estimated_minutes INTEGER,
  category TEXT,
  scheduled_start TIMESTAMP,
  scheduled_end TIMESTAMP,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
)
```

### Task Events Table (for tracking)
```sql
CREATE TABLE task_events (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  task_id UUID NOT NULL,
  event_type TEXT, -- 'completed' | 'uncompleted'
  event_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now()
)
```

## Design Principles

1. **Simplicity**: Clean, uncluttered interface
2. **Visibility**: Obvious completion status (red for incomplete)
3. **Responsiveness**: Mobile-first approach
4. **Accessibility**: Semantic HTML, good color contrast
5. **Performance**: Optimized renders, efficient state management

## Styling Approach

- **CSS Modules**: Component-scoped styles in .css files
- **Tailwind CSS**: Utility-first for rapid development
- **Custom Properties**: CSS variables for theming
- **Gradient Accents**: Purple gradients for visual interest

## Dark Mode (Future)
Reserved for future implementation with CSS custom properties

## Accessibility Features
- Semantic HTML structure
- ARIA labels where needed
- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Focus indicators on interactive elements

## Performance Considerations
- Code splitting via React.lazy (future)
- Image optimization
- Efficient re-renders via React.memo (where needed)
- Optimized CSS with minimal specificity
- Production build: ~357KB JS, ~35KB CSS (gzipped)

## Integration Points

### Supabase
- Authentication: Email/password auth
- Database: PostgreSQL for tasks and events
- Real-time: Subscription to task changes
- RLS Policies: Row-level security for user data isolation

### Development
- **Build Tool**: Vite
- **Runtime**: React 18 + TypeScript
- **Output**: dist/ (Vercel deployment)
- **Env Vars**: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY

## Browser Support
- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 12+, Android 5+

---

Last Updated: November 29, 2025
FlowDay Team
