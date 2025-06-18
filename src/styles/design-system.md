# The Blog Spot Design System

## Color Palette

### Primary Colors

- **Bodega Brick**: `#D2691E` - Primary brand color for CTAs and highlights
- **Community Teal**: `#008B8B` - Secondary brand color for accents
- **Vintage Ink**: `#2F4F4F` - Primary text color
- **Storyteller Cream**: `#F5F5DC` - Light accent color

### Background Colors

- **Cream**: `#FFFDD0` - Main background color
- **Charcoal**: `#36454F` - Footer and dark section backgrounds

### Interactive Colors

- **Warm Terracotta**: `#E2725B` - Hover states and warm accents

## Typography

### Font Families

- **Playfair Display**: Headings and display text
- **Source Sans Pro**: Body text and UI elements

### Font Sizes

- **text-xs**: 12px
- **text-sm**: 14px
- **text-base**: 16px
- **text-lg**: 18px
- **text-xl**: 20px
- **text-2xl**: 24px
- **text-3xl**: 30px
- **text-4xl**: 36px
- **text-5xl**: 48px
- **text-6xl**: 60px
- **text-7xl**: 72px

## Spacing Scale

### Padding/Margin

- **1**: 4px
- **2**: 8px
- **3**: 12px
- **4**: 16px
- **6**: 24px
- **8**: 32px
- **12**: 48px
- **16**: 64px
- **20**: 80px

## Component Guidelines

### Buttons

- Use `Button` component for all interactive elements
- Variants: `primary`, `secondary`, `outline`, `ghost`
- Sizes: `sm`, `md`, `lg`
- Always include proper ARIA labels
- Include hover and active states

### Loading States

- Use `LoadingSpinner` component for loading indicators
- Sizes: `sm`, `md`, `lg`
- Colors: `primary`, `secondary`, `white`
- Always include proper ARIA labels

### Error Handling

- Wrap components in `ErrorBoundary`
- Provide fallback UI for errors
- Include retry mechanisms
- Show helpful error messages

## Accessibility Guidelines

### ARIA Labels

- All interactive elements must have descriptive ARIA labels
- Use `role` attributes appropriately
- Include `aria-describedby` for complex interactions

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Use proper focus management
- Include visible focus indicators

### Screen Readers

- Use semantic HTML elements
- Include `sr-only` text for context
- Provide alternative text for images

## Animation Guidelines

### Micro-interactions

- Use subtle hover effects (scale, shadow, color)
- Transition duration: 200-300ms
- Use `ease-in-out` timing function
- Include active states for tactile feedback

### Loading Animations

- Use spin animations for loading indicators
- Keep animations smooth and purposeful
- Respect user's motion preferences

## Layout Guidelines

### Grid System

- Use CSS Grid for complex layouts
- Use Flexbox for component-level layouts
- Maintain consistent spacing
- Ensure responsive design

### Container Widths

- Use `container-custom` class for consistent max-widths
- Ensure proper padding on mobile devices
- Maintain readability across all screen sizes

## Best Practices

### Performance

- Use lazy loading for routes and heavy components
- Implement proper error boundaries
- Optimize images and assets
- Use memo for expensive components

### Maintainability

- Follow consistent naming conventions
- Use TypeScript for type safety
- Document complex components
- Keep components focused and reusable

### User Experience

- Provide clear feedback for user actions
- Maintain consistent navigation
- Ensure fast loading times
- Design for accessibility first
