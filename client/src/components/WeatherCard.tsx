import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Thermometer,
  Droplets,
  Wind,
  Gauge,
  Eye,
  MapPin,
  X,
  Plus,
  Check,
} from "lucide-react";
import { WeatherIcon, getWeatherLabel } from "./WeatherIcon";
import type { WeatherResponse } from "@shared/schema";

interface WeatherCardProps {
  weather: WeatherResponse;
  onClose?: () => void;
  onAddToCompare?: () => void;
  isInCompare?: boolean;
  isMain?: boolean;
}

export function WeatherCard({
  weather,
  onClose,
  onAddToCompare,
  isInCompare,
  isMain = false,
}: WeatherCardProps) {
  const { city, current, daily } = weather;
  const today = daily[0];

  return (
    <Card className={`relative overflow-hidden ${isMain ? "border-primary" : ""}`}>
      {onClose && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8 z-10"
          onClick={onClose}
          data-testid="button-close-weather-card"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2 pr-8">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
              <h3 className="font-semibold text-lg truncate" data-testid="text-city-name">
                {city.name}
              </h3>
            </div>
            <p className="text-sm text-muted-foreground truncate">{city.country}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-primary/10 text-primary">
              <WeatherIcon code={current.weatherCode} className="w-10 h-10" />
            </div>
            <div>
              <p className="text-4xl font-bold" data-testid="text-temperature">
                {Math.round(current.temperature)}°
              </p>
              <p className="text-sm text-muted-foreground">
                Feels like {Math.round(current.feelsLike)}°
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {getWeatherLabel(current.weatherCode)}
          </Badge>
        </div>

        {today && (
          <div className="flex items-center justify-center gap-4 py-2 px-4 rounded-lg bg-muted text-sm">
            <span className="text-primary font-medium">
              H: {Math.round(today.temperatureMax)}°
            </span>
            <span className="text-muted-foreground">
              L: {Math.round(today.temperatureMin)}°
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Humidity</p>
              <p className="font-medium" data-testid="text-humidity">{current.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Wind className="h-4 w-4 text-cyan-500" />
            <div>
              <p className="text-xs text-muted-foreground">Wind</p>
              <p className="font-medium" data-testid="text-wind">{Math.round(current.windSpeed)} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Gauge className="h-4 w-4 text-purple-500" />
            <div>
              <p className="text-xs text-muted-foreground">Pressure</p>
              <p className="font-medium">{current.pressure} hPa</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
            <Eye className="h-4 w-4 text-amber-500" />
            <div>
              <p className="text-xs text-muted-foreground">Cloud Cover</p>
              <p className="font-medium">{current.cloudCover}%</p>
            </div>
          </div>
        </div>

        {onAddToCompare && (
          <Button
            variant={isInCompare ? "secondary" : "outline"}
            className="w-full"
            onClick={onAddToCompare}
            disabled={isInCompare}
            data-testid="button-add-to-compare"
          >
            {isInCompare ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Added to Compare
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add to Compare
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
