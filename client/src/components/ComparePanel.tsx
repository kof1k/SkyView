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
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg font-semibold">Compare Cities</CardTitle>
            <Badge variant="secondary">{cities.length} cities</Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground"
            data-testid="button-clear-compare"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-4 pb-2">
            {cities.map((weather) => (
              <div
                key={weather.city.id}
                className="relative flex-shrink-0 w-[200px] p-4 rounded-xl bg-muted/50 hover-elevate cursor-pointer"
                onClick={() => onSelectCity(weather)}
                data-testid={`compare-city-${weather.city.id}`}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(weather.city.id);
                  }}
                  data-testid={`button-remove-compare-${weather.city.id}`}
                >
                  <X className="h-3 w-3" />
                </Button>

                <div className="flex items-center gap-2 mb-3">
                  <WeatherIcon code={weather.current.weatherCode} className="w-8 h-8 text-primary" />
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{weather.city.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{weather.city.country}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Temp</span>
                    <span className={`font-bold ${getTemperatureColor(weather.current.temperature)}`}>
                      {Math.round(weather.current.temperature)}°C
                      {weather.current.temperature === maxTemp && (
                        <Badge variant="destructive" className="ml-1 text-[10px] px-1 py-0">H</Badge>
                      )}
                      {weather.current.temperature === minTemp && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">L</Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Humidity</span>
                    <span className="font-medium text-sm">
                      {weather.current.humidity}%
                      {weather.current.humidity === maxHumidity && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">H</Badge>
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Wind</span>
                    <span className="font-medium text-sm">
                      {Math.round(weather.current.windSpeed)} km/h
                      {weather.current.windSpeed === maxWind && (
                        <Badge variant="secondary" className="ml-1 text-[10px] px-1 py-0">H</Badge>
                      )}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-2 truncate">
                  {getWeatherLabel(weather.current.weatherCode)}
                </p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {cities.length >= 2 && (
          <div className="mt-4 pt-4 border-t">
            <h4 className="text-sm font-medium mb-3">Quick Stats</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Warmest</p>
                <p className="font-medium truncate">
                  {cities.find((c) => c.current.temperature === maxTemp)?.city.name}
                </p>
                <p className="text-lg font-bold text-amber-500">{Math.round(maxTemp)}°C</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Coldest</p>
                <p className="font-medium truncate">
                  {cities.find((c) => c.current.temperature === minTemp)?.city.name}
                </p>
                <p className="text-lg font-bold text-blue-500">{Math.round(minTemp)}°C</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Windiest</p>
                <p className="font-medium truncate">
                  {cities.find((c) => c.current.windSpeed === maxWind)?.city.name}
                </p>
                <p className="text-lg font-bold text-cyan-500">{Math.round(maxWind)} km/h</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/30 text-center">
                <p className="text-xs text-muted-foreground mb-1">Most Humid</p>
                <p className="font-medium truncate">
                  {cities.find((c) => c.current.humidity === maxHumidity)?.city.name}
                </p>
                <p className="text-lg font-bold text-blue-400">{maxHumidity}%</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
