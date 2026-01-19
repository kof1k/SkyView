# Design Guidelines: API Data Display Application

## Design Approach
**Selected Approach:** Hybrid - Drawing inspiration from modern data-focused applications like Linear (clean interfaces) and Notion (content organization), combined with Fluent Design System principles for data clarity and professional presentation.

**Core Principle:** Create a clean, data-first interface that makes API information immediately accessible and visually engaging, regardless of the chosen API source.

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - All UI elements, body text
- Accent: JetBrains Mono (Google Fonts) - Code snippets, API endpoints, technical data

**Hierarchy:**
- Hero/Page Title: text-5xl md:text-6xl, font-bold
- Section Headers: text-3xl md:text-4xl, font-semibold
- Data Cards Title: text-xl, font-semibold
- Body Text: text-base, font-normal
- Data Values: text-2xl md:text-3xl, font-bold
- Labels/Meta: text-sm, font-medium, uppercase tracking-wide

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, and 16
- Component padding: p-6 to p-8
- Section spacing: py-12 md:py-16
- Grid gaps: gap-6 to gap-8
- Container max-width: max-w-7xl

**Grid Structure:**
- Data cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature comparisons: grid-cols-1 lg:grid-cols-2
- Stats display: grid-cols-2 md:grid-cols-4

## Component Library

### Navigation
- Fixed header with project name and API source indicator
- Search/filter bar centered below header (if applicable)
- Minimal navigation: Logo left, API status indicator right

### Hero Section
**Layout:** Asymmetric split layout (60/40)
- Left: Large headline explaining the API purpose, subtitle with API source, primary CTA button
- Right: Live data preview card or featured API result
- Height: min-h-[70vh], not forced to 100vh
- Background: Subtle gradient mesh or abstract data visualization pattern

**Image:** Hero background should feature abstract data visualization patterns, API-themed illustrations, or live data representation (e.g., weather map, space imagery, statistical graphs) depending on chosen API. Image should be subtle, overlaid with gradient for text readability.

### Data Display Cards
**Structure:**
- Rounded corners (rounded-xl)
- Elevated shadow (shadow-lg)
- Padding: p-6 to p-8
- Icon/image at top (if relevant - API logo, category icon)
- Primary data value (large, bold)
- Label/description (smaller, muted)
- Timestamp or update indicator
- Optional: Trend indicator or secondary metrics

### Search/Filter Section
- Prominent search input with icon (h-12, rounded-lg)
- Filter chips/tags below search
- Clear button visible when filters active
- Sticky positioning on scroll (top-20)

### Data Visualization Zone
- Full-width container for charts/graphs (if using statistics)
- Responsive canvas containers
- Legend positioned top-right
- Grid background for data context

### API Information Panel
- Collapsible section showing API endpoint, request details
- Code block with syntax highlighting
- Copy-to-clipboard functionality
- Rate limit/usage indicators

### Loading & Empty States
- Skeleton loaders matching card structure
- Animated pulse effect
- Empty state with helpful illustration and CTA
- Error states with retry button

### Footer
- API attribution and documentation link
- GitHub repository link
- Last updated timestamp
- Tech stack badges

## Page Structure

**Single Page Application Layout:**

1. **Header** (h-16, sticky top-0)
2. **Hero Section** (min-h-[70vh], px-6 md:px-12)
3. **Search/Control Bar** (py-8, sticky top-16, backdrop-blur)
4. **Data Grid Section** (py-12, min-h-screen)
   - Dynamic cards based on API results
   - Infinite scroll or pagination
5. **API Details Section** (py-16, optional collapse)
6. **Footer** (py-8)

## Interaction Patterns

**Data Loading:**
- Skeleton screens during fetch
- Smooth fade-in for loaded content (transition-opacity duration-300)
- Stagger animation for multiple cards (delay-[100ms], delay-[200ms], etc.)

**Search/Filter:**
- Instant feedback on input
- Results update with debounce (300ms)
- Clear visual indicator of active filters

**Cards:**
- Subtle hover lift (hover:translate-y-[-4px] transition-transform)
- No aggressive animations - keep data readable

**Buttons:**
- Primary: Solid fill, rounded-lg, px-6 py-3
- Secondary: Outline style, same padding
- Icon buttons: Square (w-10 h-10), rounded-lg
- All buttons: backdrop-blur-md when over images

## Images

**Hero Background:** Abstract data visualization pattern or API-themed illustration (gradient mesh, floating data points, network visualization). Should be atmospheric, not distracting - overlay with gradient for text contrast.

**Data Cards:** Include relevant imagery where applicable:
- Weather API: Weather condition icons
- NASA API: Space imagery thumbnails
- Pokemon API: Character sprites
- Statistics: Mini chart previews

**Empty States:** Friendly illustration matching the data theme (e.g., telescope for NASA, cloud for weather)

## Accessibility

- Form inputs: Consistent rounded-lg, h-12, px-4, proper labels
- Focus states: ring-2 ring-offset-2 on all interactive elements
- ARIA labels for icon-only buttons
- Proper heading hierarchy (h1 → h2 → h3)
- Sufficient contrast for data readability

## Responsive Behavior

- Mobile: Single column, stacked layout, larger touch targets
- Tablet: Two-column grid, condensed header
- Desktop: Full grid layouts, expanded data visualizations
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)