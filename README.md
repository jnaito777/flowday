# FlowDay - Productivity Task Management App

## Project Overview

**FlowDay** is a comprehensive productivity application designed to help users track, manage, and schedule their daily tasks with usage analytics. The app provides visual task scheduling, completion tracking, and detailed productivity metrics.

### Key Features
✅ **Task Management** - Create, edit, complete, and delete tasks  
✅ **Visual Scheduler** - Drag-and-drop interface for time-based task planning (9AM-5PM)  
✅ **Usage Analytics** - Track daily, monthly, and yearly completion rates  
✅ **Incomplete Task Indicators** - Red-highlighted section showing unfinished tasks  
✅ **Time Tracking** - Estimate and track actual time spent on tasks  
✅ **Authentication** - Secure login/signup with Supabase  
✅ **Real-time Sync** - Live task updates across devices  
✅ **Responsive Design** - Mobile, tablet, and desktop optimized  

---

## Technology Stack

### Frontend
- **React 18.3.1** - UI framework
- **TypeScript** - Type-safe development
- **Vite 7.2.4** - Build tool
- **Tailwind CSS 4.1.3** - Utility-first styling
- **date-fns** - Date utilities

### Backend
- **Supabase** - PostgreSQL database + authentication
- **Row-Level Security (RLS)** - Data isolation per user

### Deployment
- **Vercel** - CI/CD and hosting

### Development
- **ESLint** - Code linting
- **SWC** - Fast TypeScript compilation

---

## Project Structure

```
flowday/
├── src/
│   ├── components/              # React components
│   │   ├── Auth.tsx            # Login/signup interface
│   │   ├── TaskInput.tsx       # Task creation form
│   │   ├── TaskList.tsx        # Task grid display
│   │   ├── ScheduleBuilder.tsx # Drag-drop scheduler
│   │   ├── DaySummary.tsx      # End-of-day summary (RED incomplete tasks)
│   │   ├── UsageStats.tsx      # Statistics cards
│   │   └── [component].css     # Component styles
│   │
│   ├── contexts/                # React contexts
│   │   └── AuthContext.tsx      # Authentication provider & useAuth hook
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useTasks.ts         # Task CRUD + event recording
│   │   └── useUserStats.ts     # Statistics calculation
│   │
│   ├── lib/                     # Utilities & configurations
│   │   └── supabase.ts         # Supabase client setup
│   │
│   ├── types/                   # TypeScript definitions
│   │   └── index.ts            # Task, DaySummary, TimeBlock types
│   │
│   ├── designs/                 # Design documentation
│   │   ├── DESIGN_SYSTEM.md    # Color palette, typography, components
│   │   └── FIGMA_INTEGRATION.md # Figma-to-React mapping
│   │
│   ├── styles/                  # Global styles
│   │   └── globals.css         # Tailwind setup
│   │
│   ├── App.tsx                 # Main app component (tabs layout)
│   ├── App.css                 # App-level styles
│   ├── main.tsx                # React entry point
│   └── index.css               # Global CSS
│
├── dist/                        # Production build output
├── public/                      # Static assets
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── index.html                  # HTML entry point
├── .env.local                  # Environment variables (local dev)
├── supabase-schema.sql         # Database schema
└── SUPABASE_SETUP.md           # Supabase setup guide
```

---

## Setup & Development

### Prerequisites
- Node.js 18+
- npm or bun package manager
- Supabase account
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/jnaito777/flowday.git
cd flowday

# Install dependencies
npm install

# Create .env.local with Supabase credentials
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJxxxxxx...
```

### Running Locally

```bash
# Start dev server (port 3001)
npm run dev

# Build for production
npm run build

# Lint code
npm run lint
```

### Database Setup

```bash
# Apply schema to Supabase SQL Editor
# Copy contents of supabase-schema.sql and execute
```

---

## Environment Variables

### Required (`.env.local`)
```
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ...
```

---

## Build & Deployment

### Local Build
```bash
npm run build
# Output: dist/ folder
```

### Deploy to Vercel
```bash
# Push to GitHub
git push origin master

# Vercel automatically builds and deploys
# View: https://flowday.vercel.app
```

---

## Database Schema

### Tasks Table
```sql
- id (UUID PRIMARY KEY)
- user_id (UUID) - Owner
- title (TEXT) - Task name
- description (TEXT) - Details
- estimated_minutes (INTEGER) - Duration
- category (TEXT) - work/personal/other
- scheduled_start (TIMESTAMP)
- scheduled_end (TIMESTAMP)
- completed (BOOLEAN)
- completed_at (TIMESTAMP)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Task Events Table (Analytics)
```sql
- id (UUID PRIMARY KEY)
- user_id (UUID)
- task_id (UUID)
- event_type (TEXT) - 'completed'
- event_at (TIMESTAMP)
- created_at (TIMESTAMP)
```

---

## Components

| Component | Purpose |
|-----------|---------|
| **Auth.tsx** | Login/signup form |
| **TaskInput.tsx** | Create new tasks |
| **TaskList.tsx** | Display all tasks |
| **ScheduleBuilder.tsx** | Drag-drop scheduler |
| **DaySummary.tsx** | End-of-day summary with **RED incomplete tasks** |
| **UsageStats.tsx** | Statistics display |

---

## Custom Hooks

### `useTasks()`
```typescript
const { tasks, loading, addTask, deleteTask, completeTask, scheduleTask } = useTasks();
```

### `useUserStats()`
```typescript
const { getDaily, getMonthly, getYearly } = useUserStats();
```

### `useAuth()`
```typescript
const { user, loading, signUp, signIn, signOut } = useAuth();
```

---

## Key Features

### Visual Scheduler
- Drag-and-drop task scheduling (9AM-5PM)
- Time block visualization
- Estimated duration auto-calculation

### Incomplete Task Indicators
**CRITICAL**: Red-highlighted section showing unfinished tasks in DaySummary

### Usage Analytics
- Daily, monthly, yearly completion tracking
- Progress bars and completion rates
- Productivity scoring

### Responsive Design
- Mobile: Single column
- Tablet: 2-column layout
- Desktop: 3-4 columns with sidebar

---

## Design System

**See**: `src/designs/DESIGN_SYSTEM.md` and `src/designs/FIGMA_INTEGRATION.md`

### Colors
- Primary: #667eea (Purple)
- Success: #10b981 (Green) - Completed
- Error: #ef4444 (Red) - **Incomplete tasks**
- Neutral: Grays (#1a1a1a - #f9fafb)

### Typography
- Headings: 600-700 weight
- Body: 400-500 weight
- Font: System UI / Inter

---

## Performance

- **Build Size**: ~357KB JS, ~35KB CSS (gzipped)
- **Build Tool**: Vite with SWC
- **Database**: Indexed queries, RLS for security
- **Deployment**: Vercel edge network

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Blank white page | Check AuthProvider in main.tsx |
| Cannot fetch tasks | Verify .env.local credentials |
| Build fails | Run `npm run build` to see errors |
| Vercel deploy fails | Ensure vite.config.ts outDir='dist' |

---

## Contributing

1. Create feature branch: `git checkout -b feature/name`
2. Make changes and test
3. Commit: `git commit -m "Add: Description"`
4. Push and create Pull Request

---

## Future Roadmap

- [ ] Dark mode
- [ ] Profile/settings page
- [ ] Recurring tasks
- [ ] Notifications
- [ ] Data export (CSV/PDF)
- [ ] Collaboration features
- [ ] Mobile app (iOS/Android)
- [ ] Time tracking timer
- [ ] Calendar integrations

---

## License

MIT License

---

## Support

- GitHub Issues: [flowday/issues](https://github.com/jnaito777/flowday/issues)
- Setup Guide: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- Design Docs: [src/designs/](./src/designs/)

---

**FlowDay** - Your Daily Productivity Companion ✨

Built with React, TypeScript, Supabase, and Vercel.
