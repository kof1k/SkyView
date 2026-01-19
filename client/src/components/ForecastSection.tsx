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
    <div className="space-y-4 sm:space-y-6">
      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold">Hourly Forecast</CardTitle>
        </CardHeader>
        <CardContent className="pb-3 sm:pb-4">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-2 sm:gap-3 pb-2">
              {next24Hours.map((hour, index) => (
                <div
                  key={hour.time}
                  className="flex flex-col items-center gap-1.5 sm:gap-2 p-2 sm:p-3 rounded-lg bg-muted/50 min-w-[56px] sm:min-w-[70px]"
                  data-testid={`hourly-forecast-${index}`}
                >
                  <span className="text-[10px] sm:text-xs text-muted-foreground">
                    {index === 0 ? "Now" : formatHour(hour.time)}
                  </span>
                  <WeatherIcon code={hour.weatherCode} className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                  <span className="font-medium text-xs sm:text-sm">{Math.round(hour.temperature)}°</span>
                  {hour.precipitation > 0 && (
                    <span className="text-[10px] sm:text-xs text-blue-500">{hour.precipitation}mm</span>
                  )}
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2 sm:pb-3">
          <CardTitle className="text-base sm:text-lg font-semibold">7-Day Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1.5 sm:space-y-2">
            {daily.map((day, index) => (
              <div
                key={day.date}
                className="flex items-center justify-between p-2 sm:p-3 rounded-lg hover-elevate bg-muted/30"
                data-testid={`daily-forecast-${index}`}
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <WeatherIcon code={day.weatherCode} className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
                  <span className="font-medium text-xs sm:text-sm truncate">{formatDate(day.date)}</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  {day.precipitationSum > 0 && (
                    <span className="text-[10px] sm:text-xs text-blue-500 hidden sm:inline">{day.precipitationSum.toFixed(1)}mm</span>
                  )}
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm">
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
