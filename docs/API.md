# SkyView API Documentation

## Base URL

```
http://localhost:5000/api
```

---

## Endpoints

### 1. Search Cities (Geocoding)

Search for cities by name.

**Endpoint:** `GET /api/geocoding`

**Query Parameters:**

| Parameter | Type   | Required | Description                     |
|-----------|--------|----------|---------------------------------|
| query     | string | Yes      | City name to search (min 2 chars) |

**Example Request:**

```bash
curl "http://localhost:5000/api/geocoding?query=London"
```

**Success Response (200 OK):**

```json
[
  {
    "id": "2643743",
    "name": "London",
    "country": "United Kingdom",
    "countryCode": "GB",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "admin1": "England",
    "population": 8961989
  },
  {
    "id": "6058560",
    "name": "London",
    "country": "Canada",
    "countryCode": "CA",
    "latitude": 42.9834,
    "longitude": -81.233,
    "admin1": "Ontario",
    "population": 346765
  }
]
```

**Response Fields:**

| Field       | Type   | Description                          |
|-------------|--------|--------------------------------------|
| id          | string | Unique city identifier               |
| name        | string | City name                            |
| country     | string | Country name                         |
| countryCode | string | ISO 3166-1 alpha-2 country code      |
| latitude    | number | Geographic latitude (-90 to 90)      |
| longitude   | number | Geographic longitude (-180 to 180)   |
| admin1      | string | Administrative region (state/region) |
| population  | number | City population (if available)       |

**Error Response (500):**

```json
{
  "error": "Failed to search for cities"
}
```

---

### 2. Get Weather Data

Get current weather and forecast for specific coordinates.

**Endpoint:** `GET /api/weather`

**Query Parameters:**

| Parameter | Type   | Required | Description                      |
|-----------|--------|----------|----------------------------------|
| latitude  | number | Yes      | Geographic latitude (-90 to 90)  |
| longitude | number | Yes      | Geographic longitude (-180 to 180) |

**Example Request:**

```bash
curl "http://localhost:5000/api/weather?latitude=51.5074&longitude=-0.1278"
```

**Success Response (200 OK):**

```json
{
  "city": {
    "id": "51.51--0.13",
    "name": "London",
    "country": "United Kingdom",
    "latitude": 51.5074,
    "longitude": -0.1278,
    "timezone": "Europe/London"
  },
  "current": {
    "temperature": 12.5,
    "feelsLike": 10.2,
    "humidity": 78,
    "windSpeed": 15.3,
    "windDirection": 245,
    "weatherCode": 3,
    "precipitation": 0.0,
    "cloudCover": 75,
    "pressure": 1015.2
  },
  "daily": [
    {
      "date": "2024-01-20",
      "temperatureMax": 14.2,
      "temperatureMin": 8.5,
      "weatherCode": 3,
      "precipitationSum": 0.2,
      "windSpeedMax": 22.1,
      "sunrise": "2024-01-20T07:45",
      "sunset": "2024-01-20T16:32"
    }
  ],
  "hourly": [
    {
      "time": "2024-01-20T12:00",
      "temperature": 12.5,
      "weatherCode": 3,
      "precipitation": 0.0,
      "windSpeed": 15.3,
      "humidity": 78
    }
  ]
}
```

**Response Structure:**

#### City Object

| Field     | Type   | Description                |
|-----------|--------|----------------------------|
| id        | string | Unique identifier          |
| name      | string | City/location name         |
| country   | string | Country name               |
| latitude  | number | Geographic latitude        |
| longitude | number | Geographic longitude       |
| timezone  | string | IANA timezone identifier   |

#### Current Weather Object

| Field         | Type   | Description                              |
|---------------|--------|------------------------------------------|
| temperature   | number | Current temperature (°C)                 |
| feelsLike     | number | Feels like temperature (°C)              |
| humidity      | number | Relative humidity (%)                    |
| windSpeed     | number | Wind speed (km/h)                        |
| windDirection | number | Wind direction (degrees, 0-360)          |
| weatherCode   | number | WMO weather code (see table below)       |
| precipitation | number | Current precipitation (mm)               |
| cloudCover    | number | Cloud cover (%)                          |
| pressure      | number | Atmospheric pressure (hPa)               |

#### Daily Forecast Object (7 days)

| Field           | Type   | Description                    |
|-----------------|--------|--------------------------------|
| date            | string | Date (YYYY-MM-DD)              |
| temperatureMax  | number | Maximum temperature (°C)       |
| temperatureMin  | number | Minimum temperature (°C)       |
| weatherCode     | number | WMO weather code               |
| precipitationSum| number | Total precipitation (mm)       |
| windSpeedMax    | number | Maximum wind speed (km/h)      |
| sunrise         | string | Sunrise time (ISO 8601)        |
| sunset          | string | Sunset time (ISO 8601)         |

#### Hourly Forecast Object (48 hours)

| Field        | Type   | Description               |
|--------------|--------|---------------------------|
| time         | string | Time (ISO 8601)           |
| temperature  | number | Temperature (°C)          |
| weatherCode  | number | WMO weather code          |
| precipitation| number | Precipitation (mm)        |
| windSpeed    | number | Wind speed (km/h)         |
| humidity     | number | Relative humidity (%)     |

**Error Responses:**

```json
// 400 Bad Request - Invalid coordinates
{
  "error": "Invalid coordinates",
  "details": [...]
}

// 500 Internal Server Error
{
  "error": "Failed to fetch weather data"
}
```

---

## WMO Weather Codes

| Code | Description           |
|------|-----------------------|
| 0    | Clear sky             |
| 1    | Mainly clear          |
| 2    | Partly cloudy         |
| 3    | Overcast              |
| 45   | Foggy                 |
| 48   | Depositing rime fog   |
| 51   | Light drizzle         |
| 53   | Moderate drizzle      |
| 55   | Dense drizzle         |
| 56   | Light freezing drizzle|
| 57   | Dense freezing drizzle|
| 61   | Slight rain           |
| 63   | Moderate rain         |
| 65   | Heavy rain            |
| 66   | Light freezing rain   |
| 67   | Heavy freezing rain   |
| 71   | Slight snow fall      |
| 73   | Moderate snow fall    |
| 75   | Heavy snow fall       |
| 77   | Snow grains           |
| 80   | Slight rain showers   |
| 81   | Moderate rain showers |
| 82   | Violent rain showers  |
| 85   | Slight snow showers   |
| 86   | Heavy snow showers    |
| 95   | Thunderstorm          |
| 96   | Thunderstorm with hail|
| 99   | Thunderstorm with heavy hail |

---

## External APIs Used

This project uses the following free APIs:

### Open-Meteo

- **Geocoding API:** `https://geocoding-api.open-meteo.com/v1/search`
- **Weather API:** `https://api.open-meteo.com/v1/forecast`
- **Documentation:** https://open-meteo.com/en/docs
- **No API key required**

### OpenStreetMap Nominatim

- **Reverse Geocoding:** `https://nominatim.openstreetmap.org/reverse`
- **Documentation:** https://nominatim.org/release-docs/latest/api/Reverse/
- **No API key required**

---

## Usage Examples

### JavaScript/TypeScript

```typescript
// Search for cities
const searchCities = async (query: string) => {
  const response = await fetch(`/api/geocoding?query=${encodeURIComponent(query)}`);
  return response.json();
};

// Get weather data
const getWeather = async (lat: number, lon: number) => {
  const response = await fetch(`/api/weather?latitude=${lat}&longitude=${lon}`);
  return response.json();
};

// Example usage
const cities = await searchCities("Paris");
const weather = await getWeather(48.8566, 2.3522);
```

### Python

```python
import requests

# Search for cities
def search_cities(query):
    response = requests.get(f"http://localhost:5000/api/geocoding?query={query}")
    return response.json()

# Get weather data
def get_weather(lat, lon):
    response = requests.get(f"http://localhost:5000/api/weather?latitude={lat}&longitude={lon}")
    return response.json()

# Example usage
cities = search_cities("Berlin")
weather = get_weather(52.52, 13.405)
```

### cURL

```bash
# Search for cities
curl "http://localhost:5000/api/geocoding?query=Tokyo"

# Get weather for Tokyo
curl "http://localhost:5000/api/weather?latitude=35.6762&longitude=139.6503"
```

---

## Rate Limits

This application proxies requests to Open-Meteo and OpenStreetMap APIs. Please respect their usage policies:

- **Open-Meteo:** No strict limits for non-commercial use
- **OpenStreetMap Nominatim:** Max 1 request per second

---

## Error Handling

All endpoints return JSON responses. Error responses include an `error` field with a description:

```json
{
  "error": "Error message here"
}
```

HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error
