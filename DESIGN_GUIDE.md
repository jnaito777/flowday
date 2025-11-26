# FlowDay Design Guide

This guide outlines the design system and best practices for refining the FlowDay UI.

## Design Principles

1. **Clarity First** - Information should be easy to scan and understand
2. **Consistent Spacing** - Use the spacing scale consistently
3. **Smooth Animations** - Subtle animations enhance UX without being distracting
4. **Accessible** - High contrast, readable fonts, keyboard navigation
5. **Modern & Clean** - Minimal design with purposeful elements

## Color System

### Primary Colors
- **Primary Gradient**: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`
- **Primary**: `#667eea`
- **Primary Dark**: `#5568d3`
- **Secondary**: `#764ba2`

### Semantic Colors
- **Success**: `#4caf50` (completed tasks, positive actions)
- **Warning**: `#ff9800` (time over estimates)
- **Error**: `#ff5252` (delete actions, errors)

### Neutral Colors
- **Text Primary**: `#1a1a1a`
- **Text Secondary**: `#666`
- **Text Light**: `#999`
- **Background White**: `#ffffff`
- **Background Light**: `#f9f9f9`
- **Border**: `#e0e0e0`

## Typography

- **Font Family**: System fonts for performance
- **Headings**: Bold (700-900), larger sizes
- **Body**: Regular (400), 16px base
- **Small Text**: 12-14px for metadata

## Spacing Scale

- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 40px

## Border Radius

- **sm**: 6px
- **md**: 8px
- **lg**: 12px
- **xl**: 16px

## Shadows

- **sm**: `0 2px 4px rgba(0, 0, 0, 0.05)` - Subtle elevation
- **md**: `0 4px 6px rgba(0, 0, 0, 0.1)` - Cards, inputs
- **lg**: `0 10px 25px rgba(0, 0, 0, 0.15)` - Modals, important cards
- **xl**: `0 20px 40px rgba(0, 0, 0, 0.2)` - Overlays

## Animations

### Transitions
- **Fast**: 0.15s - Immediate feedback
- **Base**: 0.2s - Standard interactions
- **Slow**: 0.3s - Page transitions

### Keyframe Animations
- **fadeIn**: Smooth opacity and translateY
- **slideDown**: Header entrance
- **fadeInUp**: Content entrance with delay

## Component Patterns

### Cards
- White background
- Rounded corners (xl)
- Shadow (lg)
- Padding: 24-32px
- Hover: Slight lift with shadow increase

### Buttons
- Primary: Gradient background
- Secondary: Transparent with border
- Hover: Transform translateY(-2px)
- Active: Slight press effect
- Disabled: Reduced opacity

### Inputs
- Border: 2px solid
- Focus: Border color change + shadow
- Padding: 14px 18px
- Border radius: md

### Task Items
- Background: Light gray
- Hover: Slide right + border
- Completed: Reduced opacity + strikethrough

## Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 481px - 768px
- **Desktop**: > 768px

## Refinement Tips

1. **Add Micro-interactions**
   - Button ripple effects
   - Task item slide animations
   - Smooth tab transitions

2. **Improve Visual Hierarchy**
   - Use font weights strategically
   - Increase contrast for important elements
   - Group related information

3. **Enhance Feedback**
   - Loading states with spinners
   - Success/error messages
   - Hover states on all interactive elements

4. **Polish Details**
   - Consistent icon sizes
   - Proper spacing between elements
   - Smooth color transitions

5. **Accessibility**
   - Focus states for keyboard navigation
   - ARIA labels where needed
   - Sufficient color contrast

## Quick Wins for Design Refinement

1. ✅ Add CSS variables for consistent theming
2. ✅ Improve button hover states
3. ✅ Add loading animations
4. ✅ Enhance card shadows and borders
5. ✅ Smooth page transitions
6. ✅ Better mobile responsiveness
7. ⏳ Add icon library (e.g., react-icons)
8. ⏳ Implement dark mode
9. ⏳ Add toast notifications
10. ⏳ Improve empty states

## Tools for Design

- **Figma/Sketch**: For mockups
- **Chrome DevTools**: For live tweaking
- **CSS Variables**: For easy theming
- **React DevTools**: For component inspection


