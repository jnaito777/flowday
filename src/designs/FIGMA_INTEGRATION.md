# Figma Design Integration Guide

## Figma Project Structure for FlowDay

This guide maps the FlowDay component structure to Figma design files. All designs follow the Figma to React component pattern.

## Design Pages (Figma Artboards)

### 1. Dashboard Page
**Components**: Dashboard/Overview screen showing task stats and upcoming tasks
- Layout: Header + Sidebar + Main content area
- Key Sections:
  - User greeting and status
  - Quick stats (tasks today, completed, in progress)
  - Recent tasks list
  - Quick actions

**React Implementation**:
- `components/TaskList.tsx` (main task display)
- `components/UsageStats.tsx` (statistics)
- `App.tsx` (layout structure)

---

### 2. Task Management Page
**Components**: Full task management interface with filters
- Layout: Task creation form + Filterable task list
- Key Sections:
  - Task input form (title, description, category, time estimate)
  - Filter buttons (all, active, completed)
  - Task cards in grid layout

**React Implementation**:
- `components/TaskInput.tsx` (form)
- `components/TaskList.tsx` (list with filtering)
- `TaskList.css` (responsive grid)

---

### 3. Schedule/Calendar Page
**Components**: Visual time-based task scheduler
- Layout: Time grid (9AM-5PM) + Unscheduled tasks panel
- Key Sections:
  - Hourly time blocks
  - Draggable task cards
  - Duration indicators
  - Add new task quick action

**React Implementation**:
- `components/ScheduleBuilder.tsx` (drag-drop scheduler)
- `ScheduleBuilder.css` (time grid styling)
- `useTasks.ts` (scheduleTask function)

---

### 4. Summary/Analytics Page
**Components**: Daily/monthly/yearly productivity summary
- Layout: Statistics cards + Completed tasks list + Incomplete tasks alert
- Key Sections:
  - Stat cards (completion rate, productivity score)
  - Completed tasks (green highlights)
  - **Incomplete tasks (RED highlights - CRITICAL)**
  - Time accuracy metrics

**React Implementation**:
- `components/DaySummary.tsx` (main summary)
- `components/UsageStats.tsx` (statistics)
- `useUserStats.ts` (data calculation)
- **Red incomplete section is mandatory per requirements**

---

### 5. Authentication Page
**Components**: Login and signup screens
- Layout: Card-based form centered on gradient background
- Key Sections:
  - Email input
  - Password input
  - Submit button
  - Toggle between login/signup
  - Error messages

**React Implementation**:
- `components/Auth.tsx` (form)
- `Auth.css` (styling)
- `contexts/AuthContext.tsx` (auth logic)

---

### 6. User Profile Page (Future)
**Components**: User settings and preferences
- Layout: Profile header + Settings sections
- Sections: Account info, preferences, notifications, etc.
- Status: NOT YET IMPLEMENTED

---

## Color System in Figma

### Primary Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Primary Purple | #667eea | CTA buttons, headers, primary accents |
| Secondary Purple | #764ba2 | Gradient pairs with #667eea |
| Success Green | #10b981 | Complete/positive states |
| Warning Orange | #f59e0b | Time overrun, cautions |
| Error Red | #ef4444 | Incomplete tasks, deletions |

### Neutral Colors
| Color | Hex | Usage |
|-------|-----|-------|
| Dark Text | #1a1a1a | Primary text |
| Medium Gray | #666 | Secondary text |
| Light Gray | #f9fafb | Backgrounds |
| Border Gray | #e5e7eb | Dividers, borders |

---

## Component Design Tokens

### Typography Scale
```
Heading 1: 2rem / 700 weight
Heading 2: 1.5rem / 600 weight
Heading 3: 1.1rem / 600 weight
Body: 1rem / 400 weight
Small: 0.9rem / 500 weight
Caption: 0.875rem / 400 weight
```

### Spacing Scale
- 0.5rem (8px) - Compact
- 1rem (16px) - Standard
- 1.5rem (24px) - Comfortable
- 2rem (32px) - Spacious
- 3rem (48px) - Section spacing

### Border Radius
- 0.5rem - Small buttons, inputs
- 0.75rem - Medium cards
- 1rem - Large sections
- 3.40282e38px - Fully rounded (circles)

### Shadows
- Small: `0 4px 12px rgba(0,0,0,0.1)`
- Medium: `0 8px 24px rgba(0,0,0,0.12)`
- Large: `0 12px 24px rgba(102,126,234,0.3)` (purple-tinted)

---

## Interactive States

### Buttons
- **Default**: Gradient background, white text
- **Hover**: Slight lift (translateY -2px) + enhanced shadow
- **Active**: Darker gradient
- **Disabled**: 50% opacity, no cursor

### Form Inputs
- **Default**: White background, gray border
- **Focus**: Blue border (#667eea), shadow ring
- **Error**: Red border (#ef4444), error text below
- **Disabled**: Gray background, no interaction

### Task Cards
- **Default**: White background, subtle border
- **Hover**: Border color change to purple, enhanced shadow
- **Completed**: Grayed out background, strikethrough text
- **Scheduled**: Purple-tinted background, left border accent

---

## Responsive Breakpoints

### Mobile-First Approach
```css
/* Default: Mobile (320px - 640px) */
/* Tablet: md (640px - 1024px) */
/* Desktop: lg (1024px+) */
```

### Key Layout Changes
- **Mobile**: Single column, collapsed nav, full-width cards
- **Tablet**: 2-column grid for tasks, 2-column schedule
- **Desktop**: 3-4 column grid, sidebar nav, full schedule

---

## Animation/Transition Patterns

### Page Transitions
- Fade in: 0.3s ease-out
- Slide up: 0.3s ease-out

### Component Interactions
- Button hover: 0.3s ease
- Form focus: 0.15s ease-in
- Completeness toggle: 0.6s ease (progress bar fill)

### Loading States
- Pulse animation: 2s infinite
- Skeleton loaders: Theme-based gradients

---

## Accessibility Considerations

### Color Contrast
- Text on backgrounds: 4.5:1+ (WCAG AA)
- UI components: 3:1+ (WCAG AA)
- Red incomplete section: Tested for colorblind-friendly patterns

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators visible (2px blue ring)
- All interactive elements keyboard accessible

### ARIA Labels
- Form fields have associated labels
- Buttons have descriptive text
- Icons have title attributes
- Important sections have landmark roles

---

## Implementation Checklist

- [x] Dashboard overview with stats
- [x] Task CRUD interface
- [x] Visual scheduler (drag-drop)
- [x] Summary with metrics
- [x] **Red incomplete task indicators**
- [x] Authentication flow
- [ ] Profile/Settings page
- [ ] Dark mode theme
- [ ] Export/import functionality
- [ ] Mobile app responsive design

---

## Figma Export Settings

### Web Assets
- **Format**: SVG for icons, PNG for screenshots
- **Scale**: 1x for web, 2x for retina
- **Compression**: Optimize for web use

### Code Generation
- Use Figma plugin: "Figma to HTML"
- Export CSS variables for colors
- Document component props in Figma

---

## Future Design Enhancements

1. **Dark Mode**: All components should support theme switching
2. **Animated Onboarding**: Welcome tour for new users
3. **Data Visualization**: Charts for productivity trends
4. **Notifications**: Toast and banner components
5. **Advanced Filtering**: Complex task queries with UI
6. **Collaboration Features**: Shared tasks and comments
7. **Mobile App**: Native iOS/Android versions

---

## Design Review Checklist

When updating designs in Figma, ensure:
- [ ] All states documented (default, hover, active, disabled)
- [ ] Colors match defined palette
- [ ] Spacing follows token system
- [ ] Typography matches scale
- [ ] Shadows consistent
- [ ] Responsive variants created
- [ ] Accessibility considered
- [ ] Component documentation updated

---

**Last Updated**: November 29, 2025
**Figma File**: [Link to your Figma workspace]
**Design System Version**: 1.0
