import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { X, Trash2, BarChart3 } from "lucide-react";
import { WeatherIcon, getWeatherLabel } from "./WeatherIcon";
import type { WeatherResponse } from "@shared/schema";

interface ComparePanelProps {
  cities: WeatherResponse[];
  onRemove: (cityId: string) => void;
  onClear: () => void;
  onSelectCity: (weather: WeatherResponse) => void;
}

export function ComparePanel({
  cities,
  onRemove,
  onClear,
  onSelectCity,
}: ComparePanelProps) {
  if (cities.length === 0) return null;

  const getTemperatureColor = (temp: number) => {
    if (temp < 0) return "text-blue-500";
    if (temp < 10) return "text-cyan-500";
    if (temp < 20) return "text-green-500";
    if (temp < 30) return "text-amber-500";
    return "text-red-500";
  };

  const maxTemp = Math.max(...cities.map((c) => c.current.temperature));
  const minTemp = Math.min(...cities.map((c) => c.current.temperature));
  const maxWind = Math.max(...cities.map((c) => c.current.windSpeed));
  const maxHumidity = Math.max(...cities.map((c) => c.current.humidity));

  return (
    <Card className="w-full">
      <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <CardTitle className="text-sm sm:text-lg font-semibold">Compare</CardTitle>
            <Badge variant="secondary" className="text-[10px] sm:text-xs">{cities.length}</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground h-8 px-2 sm:px-3 text-xs sm:text-sm"
            data-testid="button-clear-compare"
          >
            <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-1" />
            <span className="hidden sm:inline">Clear All</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 sm:gap-4 pb-2">
            {cities.map((weather) => (
              <div
                key={weather.city.id}
                className="relative flex-shrink-0 w-[140px] sm:w-[180px] p-2.5 sm:p-4 rounded-xl bg-muted/50 hover-elevate cursor-pointer"
                onClick={() => onSelectCity(weather)}
                data-testid={`compare-city-${weather.city.id}`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-5 w-5 sm:h-6 sm:w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(weather.city.id);
                  }}
                  data-testid={`button-remove-compare-${weather.city.id}`}
                >
                  <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                </Button>

                <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                  <WeatherIcon code={weather.current.weatherCode} className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-xs sm:text-sm truncate">{weather.city.name}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{weather.city.country}</p>
                  </div>
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Temp</span>
                    <span className={`font-bold text-xs sm:text-sm ${getTemperatureColor(weather.current.temperature)}`}>
                      {Math.round(weather.current.temperature)}°
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Humidity</span>
                    <span className="font-medium text-xs sm:text-sm">
                      {weather.current.humidity}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">Wind</span>
                    <span className="font-medium text-xs sm:text-sm">
                      {Math.round(weather.current.windSpeed)} km/h
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {cities.length >= 2 && (
          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t">
            <h4 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3">Quick Stats</h4>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="p-2 sm:p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Warmest</p>
                <p className="font-medium text-xs sm:text-sm truncate">
                  {cities.find((c) => c.current.temperature === maxTemp)?.city.name}
                </p>
                <p className="text-sm sm:text-lg font-bold text-amber-500">{Math.round(maxTemp)}°C</p>
              </div>
              <div className="p-2 sm:p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-[10px] sm:text-xs text-muted-foreground mb-0.5 sm:mb-1">Coldest</p>
                <p className="font-medium text-xs sm:text-sm truncate">
                  {cities.find((c) => c.current.temperature === minTemp)?.city.name}
                </p>
                <p className="text-sm sm:text-lg font-bold text-blue-500">{Math.round(minTemp)}°C</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
