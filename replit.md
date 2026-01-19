# WeatherMap - Weather & Maps Explorer

## Overview

WeatherMap is a full-stack weather application that combines real-time weather data with interactive maps. Users can search for cities worldwide, view current weather conditions and forecasts, and compare weather across multiple locations. The application integrates Open-Meteo for weather data and OpenStreetMap/Leaflet for interactive mapping.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework:** React with TypeScript, built using Vite
- Single-page application with client-side routing via Wouter
- State management through TanStack React Query for server state
- Component library built on shadcn/ui (Radix UI primitives + Tailwind CSS)

**Design System:**
- Tailwind CSS with custom CSS variables for theming (light/dark mode support)
- Typography: Inter for UI, JetBrains Mono for technical data
- Component styling follows shadcn/ui "new-york" style variant

**Key Frontend Patterns:**
- Lazy loading for heavy components (InteractiveMap)
- Custom hooks for mobile detection and toast notifications
- Theme context provider for dark/light mode toggling
- Zod schemas shared between client and server for type safety

### Backend Architecture

**Framework:** Express.js with TypeScript
- HTTP server with JSON body parsing
- Proxy endpoints for external API calls (geocoding, weather)
- Static file serving for production builds

**API Design:**
- `/api/geocoding` - City search using Open-Meteo Geocoding API
- `/api/weather` - Weather data fetching using Open-Meteo Weather API
- Server acts as a proxy to external APIs, handling data transformation

**Build System:**
- Development: tsx for TypeScript execution, Vite dev server with HMR
- Production: esbuild for server bundling, Vite for client bundling
- Output: `dist/` directory with `index.cjs` (server) and `public/` (client assets)

### Data Layer

**Schema Definition:** Zod schemas in `shared/schema.ts`
- City, WeatherData, DailyForecast, HourlyForecast types
- User schema with Drizzle ORM integration (prepared for PostgreSQL)

**Storage:**
- In-memory storage implementation (`MemStorage` class) for user data
- Drizzle ORM configured for PostgreSQL (requires `DATABASE_URL` environment variable)
- Storage interface allows swapping implementations

### Client-Server Communication

**Pattern:** TanStack React Query with custom query function
- Query keys encode API endpoints and parameters
- Automatic request building based on query key structure
- Credentials included for session support

## External Dependencies

### APIs
- **Open-Meteo Geocoding API** - City search and location data
- **Open-Meteo Weather API** - Current weather and forecasts (free, no API key required)
- **OpenStreetMap** - Map tiles via Leaflet

### Database
- **PostgreSQL** - Configured via Drizzle ORM (requires `DATABASE_URL`)
- **Drizzle Kit** - Database migrations in `./migrations`

### Key Libraries
- **Leaflet/react-leaflet** - Interactive maps
- **Radix UI** - Accessible component primitives
- **TanStack React Query** - Server state management
- **Zod** - Schema validation
- **date-fns** - Date formatting

### Development Tools
- **Vite** - Development server and bundler
- **esbuild** - Production server bundling
- **tsx** - TypeScript execution
- **Tailwind CSS** - Utility-first styling