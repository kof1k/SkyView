import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { City, WeatherData } from "@shared/schema";
import { WeatherIcon, getWeatherLabel } from "./WeatherIcon";
import { useTheme } from "./ThemeProvider";

const createCustomIcon = (temperature: number) => {
  const color = temperature < 0 ? "#3b82f6" : temperature < 15 ? "#06b6d4" : temperature < 25 ? "#22c55e" : "#f59e0b";
  
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${color};
        color: white;
        padding: 4px 8px;
        border-radius: 9999px;
        font-weight: 600;
        font-size: 12px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        white-space: nowrap;
        border: 2px solid white;
      ">
        ${Math.round(temperature)}°C
      </div>
    `,
    iconSize: [50, 25],
    iconAnchor: [25, 12],
  });
};

interface MapMarker {
  city: City;
  weather?: WeatherData;
}

interface InteractiveMapProps {
  markers: MapMarker[];
  selectedCity?: City;
  onMarkerClick?: (city: City) => void;
  className?: string;
}

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 });
  }, [center, zoom, map]);

  useEffect(() => {
    map.scrollWheelZoom.disable();
    
    const enableScroll = () => map.scrollWheelZoom.enable();
    const disableScroll = () => map.scrollWheelZoom.disable();
    
    map.on('focus', enableScroll);
    map.on('click', enableScroll);
    map.on('blur', disableScroll);
    map.on('mouseout', disableScroll);
    
    return () => {
      map.off('focus', enableScroll);
      map.off('click', enableScroll);
      map.off('blur', disableScroll);
      map.off('mouseout', disableScroll);
    };
  }, [map]);
  
  return null;
}

export function InteractiveMap({
  markers,
  selectedCity,
  onMarkerClick,
  className = "",
}: InteractiveMapProps) {
  const { theme } = useTheme();
  const mapRef = useRef<L.Map>(null);
  const [center, setCenter] = useState<[number, number]>([51.5074, -0.1278]);
  const [zoom, setZoom] = useState(5);

  useEffect(() => {
    if (selectedCity) {
      setCenter([selectedCity.latitude, selectedCity.longitude]);
      setZoom(10);
    }
  }, [selectedCity]);

  const tileUrl = theme === "dark"
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  return (
    <div className={`relative rounded-xl overflow-hidden border ${className}`}>
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={zoom}
        className="h-full w-full"
        style={{ minHeight: "400px" }}
        scrollWheelZoom={false}
        data-testid="interactive-map"
      >
        <MapController center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url={tileUrl}
        />
        {markers.map((marker) => (
          <Marker
            key={marker.city.id}
            position={[marker.city.latitude, marker.city.longitude]}
            icon={marker.weather ? createCustomIcon(marker.weather.temperature) : L.icon({
              iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
            })}
            eventHandlers={{
              click: () => onMarkerClick?.(marker.city),
            }}
          >
            <Popup>
              <div className="p-2 min-w-[150px]">
                <h3 className="font-semibold text-foreground">{marker.city.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{marker.city.country}</p>
                {marker.weather && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {Math.round(marker.weather.temperature)}°C
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {getWeatherLabel(marker.weather.weatherCode)}
                    </span>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
