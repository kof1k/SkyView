import {
  Sun,
  Cloud,
  CloudSun,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  Snowflake,
  CloudLightning,
} from "lucide-react";
import { weatherConditions } from "@shared/schema";

interface WeatherIconProps {
  code: number;
  className?: string;
}

export function WeatherIcon({ code, className = "w-8 h-8" }: WeatherIconProps) {
  const condition = weatherConditions[code] || weatherConditions[0];
  
  const iconMap: Record<string, React.ReactNode> = {
    sun: <Sun className={className} />,
    "cloud-sun": <CloudSun className={className} />,
    cloud: <Cloud className={className} />,
    "cloud-fog": <CloudFog className={className} />,
    "cloud-drizzle": <CloudDrizzle className={className} />,
    "cloud-rain": <CloudRain className={className} />,
    snowflake: <Snowflake className={className} />,
    "cloud-lightning": <CloudLightning className={className} />,
  };

  return <>{iconMap[condition.icon] || iconMap.sun}</>;
}

export function getWeatherLabel(code: number): string {
  return weatherConditions[code]?.label || "Unknown";
}
