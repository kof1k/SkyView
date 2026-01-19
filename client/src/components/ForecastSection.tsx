import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { WeatherIcon } from "./WeatherIcon";
import type { DailyForecast, HourlyForecast } from "@shared/schema";

interface ForecastSectionProps {
  daily: DailyForecast[];
  hourly: HourlyForecast[];
}

export function ForecastSection({ daily, hourly }: ForecastSectionProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    return date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  };

  const formatHour = (timeStr: string) => {
    const date = new Date(timeStr);
    return date.toLocaleTimeString("en-US", { hour: "numeric", hour12: true });
  };

  const next24Hours = hourly.slice(0, 24);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-2">
              {next24Hours.map((hour, index) => (
                <div
                  key={hour.time}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg bg-muted/50 min-w-[70px]"
                  data-testid={`hourly-forecast-${index}`}
                >
                  <span className="text-xs text-muted-foreground">
                    {index === 0 ? "Now" : formatHour(hour.time)}
                  </span>
                  <WeatherIcon code={hour.weatherCode} className="w-6 h-6 text-primary" />
                  <span className="font-medium text-sm">{Math.round(hour.temperature)}°</span>
                  {hour.precipitation > 0 && (
                    <span className="text-xs text-blue-500">{hour.precipitation}mm</span>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {daily.map((day, index) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-3 rounded-lg hover-elevate bg-muted/30"
                data-testid={`daily-forecast-${index}`}
              >
                <div className="flex items-center gap-3 min-w-[120px]">
                  <WeatherIcon code={day.weatherCode} className="w-6 h-6 text-primary" />
                  <span className="font-medium text-sm">{formatDate(day.date)}</span>
                </div>
                <div className="flex items-center gap-4">
                  {day.precipitationSum > 0 && (
                    <span className="text-xs text-blue-500">{day.precipitationSum.toFixed(1)}mm</span>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-primary">{Math.round(day.temperatureMax)}°</span>
                    <span className="text-muted-foreground">{Math.round(day.temperatureMin)}°</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
