import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";

const geocodingQuerySchema = z.object({
  query: z.string().min(2).optional(),
});

const weatherQuerySchema = z.object({
  latitude: z.string().transform((val) => parseFloat(val)).refine((val) => !isNaN(val) && val >= -90 && val <= 90, "Invalid latitude"),
  longitude: z.string().transform((val) => parseFloat(val)).refine((val) => !isNaN(val) && val >= -180 && val <= 180, "Invalid longitude"),
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Geocoding API endpoint - search for cities
  app.get("/api/geocoding", async (req, res) => {
    try {
      const validation = geocodingQuerySchema.safeParse(req.query);
      
      if (!validation.success || !validation.data.query) {
        return res.json([]);
      }
      
      const query = validation.data.query;

      const response = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch geocoding data");
      }

      const data = await response.json();
      
      if (!data.results) {
        return res.json([]);
      }

      const results = data.results.map((result: any) => ({
        id: `${result.id}`,
        name: result.name,
        country: result.country || "Unknown",
        countryCode: result.country_code || "",
        latitude: result.latitude,
        longitude: result.longitude,
        admin1: result.admin1,
        population: result.population,
      }));

      res.json(results);
    } catch (error) {
      console.error("Geocoding error:", error);
      res.status(500).json({ error: "Failed to search for cities" });
    }
  });

  // Weather API endpoint - get weather for coordinates
  app.get("/api/weather", async (req, res) => {
    try {
      const validation = weatherQuerySchema.safeParse(req.query);
      
      if (!validation.success) {
        return res.status(400).json({ error: "Invalid coordinates", details: validation.error.errors });
      }
      
      const { latitude, longitude } = validation.data;

      // Fetch weather data from Open-Meteo
      const weatherUrl = new URL("https://api.open-meteo.com/v1/forecast");
      weatherUrl.searchParams.set("latitude", latitude.toString());
      weatherUrl.searchParams.set("longitude", longitude.toString());
      weatherUrl.searchParams.set(
        "current",
        "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,pressure_msl,cloud_cover,wind_speed_10m,wind_direction_10m,precipitation"
      );
      weatherUrl.searchParams.set(
        "hourly",
        "temperature_2m,weather_code,precipitation,wind_speed_10m,relative_humidity_2m"
      );
      weatherUrl.searchParams.set(
        "daily",
        "weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max,sunrise,sunset"
      );
      weatherUrl.searchParams.set("timezone", "auto");
      weatherUrl.searchParams.set("forecast_days", "7");

      const response = await fetch(weatherUrl.toString());

      if (!response.ok) {
        throw new Error("Failed to fetch weather data");
      }

      const data = await response.json();

      // Get city info from reverse geocoding
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${latitude.toFixed(2)},${longitude.toFixed(2)}&count=1&language=en&format=json`
      );
      
      let cityName = "Unknown Location";
      let countryName = "Unknown";
      
      // Try to find nearest city
      const nearestCityUrl = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&zoom=10`;
      try {
        const nominatimResponse = await fetch(nearestCityUrl, {
          headers: { "User-Agent": "WeatherMap/1.0" },
        });
        if (nominatimResponse.ok) {
          const nominatimData = await nominatimResponse.json();
          cityName = nominatimData.address?.city || 
                     nominatimData.address?.town || 
                     nominatimData.address?.village ||
                     nominatimData.address?.municipality ||
                     "Unknown Location";
          countryName = nominatimData.address?.country || "Unknown";
        }
      } catch {
        // Fallback - use coordinates as name
        cityName = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
      }

      const weatherResponse = {
        city: {
          id: `${latitude}-${longitude}`,
          name: cityName,
          country: countryName,
          latitude,
          longitude,
          timezone: data.timezone,
        },
        current: {
          temperature: data.current.temperature_2m,
          feelsLike: data.current.apparent_temperature,
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          weatherCode: data.current.weather_code,
          precipitation: data.current.precipitation,
          cloudCover: data.current.cloud_cover,
          pressure: data.current.pressure_msl,
        },
        daily: data.daily.time.map((date: string, index: number) => ({
          date,
          temperatureMax: data.daily.temperature_2m_max[index],
          temperatureMin: data.daily.temperature_2m_min[index],
          weatherCode: data.daily.weather_code[index],
          precipitationSum: data.daily.precipitation_sum[index],
          windSpeedMax: data.daily.wind_speed_10m_max[index],
          sunrise: data.daily.sunrise[index],
          sunset: data.daily.sunset[index],
        })),
        hourly: data.hourly.time.slice(0, 48).map((time: string, index: number) => ({
          time,
          temperature: data.hourly.temperature_2m[index],
          weatherCode: data.hourly.weather_code[index],
          precipitation: data.hourly.precipitation[index],
          windSpeed: data.hourly.wind_speed_10m[index],
          humidity: data.hourly.relative_humidity_2m[index],
        })),
      };

      res.json(weatherResponse);
    } catch (error) {
      console.error("Weather error:", error);
      res.status(500).json({ error: "Failed to fetch weather data" });
    }
  });

  return httpServer;
}
