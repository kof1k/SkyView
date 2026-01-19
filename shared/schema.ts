import { z } from "zod";

// City/Location Schema
export const citySchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  timezone: z.string().optional(),
  population: z.number().optional(),
});

export type City = z.infer<typeof citySchema>;

// Weather Data Schema
export const weatherDataSchema = z.object({
  temperature: z.number(),
  feelsLike: z.number(),
  humidity: z.number(),
  windSpeed: z.number(),
  windDirection: z.number(),
  weatherCode: z.number(),
  precipitation: z.number(),
  cloudCover: z.number(),
  pressure: z.number(),
  visibility: z.number().optional(),
  uvIndex: z.number().optional(),
});

export type WeatherData = z.infer<typeof weatherDataSchema>;

// Daily Forecast Schema
export const dailyForecastSchema = z.object({
  date: z.string(),
  temperatureMax: z.number(),
  temperatureMin: z.number(),
  weatherCode: z.number(),
  precipitationSum: z.number(),
  windSpeedMax: z.number(),
  sunrise: z.string(),
  sunset: z.string(),
});

export type DailyForecast = z.infer<typeof dailyForecastSchema>;

// Hourly Forecast Schema
export const hourlyForecastSchema = z.object({
  time: z.string(),
  temperature: z.number(),
  weatherCode: z.number(),
  precipitation: z.number(),
  windSpeed: z.number(),
  humidity: z.number(),
});

export type HourlyForecast = z.infer<typeof hourlyForecastSchema>;

// Complete Weather Response
export const weatherResponseSchema = z.object({
  city: citySchema,
  current: weatherDataSchema,
  daily: z.array(dailyForecastSchema),
  hourly: z.array(hourlyForecastSchema),
});

export type WeatherResponse = z.infer<typeof weatherResponseSchema>;

// Geocoding Result
export const geocodingResultSchema = z.object({
  id: z.string(),
  name: z.string(),
  country: z.string(),
  countryCode: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  admin1: z.string().optional(),
  population: z.number().optional(),
});

export type GeocodingResult = z.infer<typeof geocodingResultSchema>;

// Saved City for comparison
export const savedCitySchema = z.object({
  city: citySchema,
  weather: weatherDataSchema,
  addedAt: z.string(),
});

export type SavedCity = z.infer<typeof savedCitySchema>;

// Weather condition codes mapping
export const weatherConditions: Record<number, { label: string; icon: string }> = {
  0: { label: "Clear sky", icon: "sun" },
  1: { label: "Mainly clear", icon: "sun" },
  2: { label: "Partly cloudy", icon: "cloud-sun" },
  3: { label: "Overcast", icon: "cloud" },
  45: { label: "Fog", icon: "cloud-fog" },
  48: { label: "Depositing rime fog", icon: "cloud-fog" },
  51: { label: "Light drizzle", icon: "cloud-drizzle" },
  53: { label: "Moderate drizzle", icon: "cloud-drizzle" },
  55: { label: "Dense drizzle", icon: "cloud-drizzle" },
  56: { label: "Light freezing drizzle", icon: "cloud-drizzle" },
  57: { label: "Dense freezing drizzle", icon: "cloud-drizzle" },
  61: { label: "Slight rain", icon: "cloud-rain" },
  63: { label: "Moderate rain", icon: "cloud-rain" },
  65: { label: "Heavy rain", icon: "cloud-rain" },
  66: { label: "Light freezing rain", icon: "cloud-rain" },
  67: { label: "Heavy freezing rain", icon: "cloud-rain" },
  71: { label: "Slight snow", icon: "snowflake" },
  73: { label: "Moderate snow", icon: "snowflake" },
  75: { label: "Heavy snow", icon: "snowflake" },
  77: { label: "Snow grains", icon: "snowflake" },
  80: { label: "Slight rain showers", icon: "cloud-rain" },
  81: { label: "Moderate rain showers", icon: "cloud-rain" },
  82: { label: "Violent rain showers", icon: "cloud-rain" },
  85: { label: "Slight snow showers", icon: "snowflake" },
  86: { label: "Heavy snow showers", icon: "snowflake" },
  95: { label: "Thunderstorm", icon: "cloud-lightning" },
  96: { label: "Thunderstorm with slight hail", icon: "cloud-lightning" },
  99: { label: "Thunderstorm with heavy hail", icon: "cloud-lightning" },
};
