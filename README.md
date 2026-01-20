# SkyView 

Interactive weather application with real-time data and maps.

## Features

- City search with autocomplete
- Current weather conditions
- 7-day forecast
- Hourly forecast (48 hours)
- Interactive map with OpenStreetMap
- Weather markers on map
- City comparison
- Dark/Light theme
- Mobile responsive

## Tech Stack

**Frontend:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Leaflet

**Backend:** Express.js, TypeScript

**APIs:** Open-Meteo (weather), OpenStreetMap (maps)

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open http://localhost:5000

## API Endpoints

### Search Cities
```
GET /api/geocoding?query=London
```

### Get Weather
```
GET /api/weather?latitude=51.5074&longitude=-0.1278
```

See [API.md](API.md) for full documentation.

## Project Structure

```
client/
  src/
    components/    # React components
    pages/         # Page components
    hooks/         # Custom hooks
    lib/           # Utilities
server/
  index.ts         # Server entry
  routes.ts        # API routes
shared/
  schema.ts        # Type definitions
```

## Environment

No API keys required. Uses free Open-Meteo and OpenStreetMap APIs.