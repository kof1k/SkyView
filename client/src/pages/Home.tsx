import { useState, useMemo, Suspense, lazy } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { WeatherCard } from "@/components/WeatherCard";
import { ForecastSection } from "@/components/ForecastSection";
import { ComparePanel } from "@/components/ComparePanel";
import {
  WeatherCardSkeleton,
  MapSkeleton,
  ForecastSkeleton,
  EmptyState,
  ErrorState,
} from "@/components/LoadingState";
import type { GeocodingResult, WeatherResponse, City } from "@shared/schema";

const InteractiveMap = lazy(() =>
  import("@/components/InteractiveMap").then((m) => ({ default: m.InteractiveMap }))
);

export default function Home() {
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [compareCities, setCompareCities] = useState<WeatherResponse[]>([]);

  const {
    data: weather,
    isLoading,
    error,
    refetch,
  } = useQuery<WeatherResponse>({
    queryKey: ["/api/weather", selectedCity?.latitude, selectedCity?.longitude],
    enabled: !!selectedCity,
  });

  const handleSelectCity = (result: GeocodingResult) => {
    const city: City = {
      id: result.id,
      name: result.name,
      country: result.country,
      latitude: result.latitude,
      longitude: result.longitude,
    };
    setSelectedCity(city);
  };

  const handleAddToCompare = () => {
    if (weather && !compareCities.find((c) => c.city.id === weather.city.id)) {
      setCompareCities((prev) => [...prev, weather]);
    }
  };

  const handleRemoveFromCompare = (cityId: string) => {
    setCompareCities((prev) => prev.filter((c) => c.city.id !== cityId));
  };

  const handleClearCompare = () => {
    setCompareCities([]);
  };

  const handleSelectFromCompare = (cityWeather: WeatherResponse) => {
    setSelectedCity(cityWeather.city);
  };

  const mapMarkers = useMemo(() => {
    const markers: { city: City; weather?: any }[] = [];
    
    if (weather) {
      markers.push({ city: weather.city, weather: weather.current });
    }
    
    compareCities.forEach((c) => {
      if (!markers.find((m) => m.city.id === c.city.id)) {
        markers.push({ city: c.city, weather: c.current });
      }
    });
    
    return markers;
  }, [weather, compareCities]);

  const isInCompare = weather ? compareCities.some((c) => c.city.id === weather.city.id) : false;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container px-4 md:px-6 py-6 md:py-8">
        <section className="mb-8">
          <div className="max-w-3xl mx-auto text-center mb-6">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              Weather & Map Explorer
            </h2>
            <p className="text-muted-foreground text-lg">
              Search cities worldwide, view real-time weather data, and compare multiple locations
            </p>
          </div>
          <div className="flex justify-center">
            <SearchBar onSelectCity={handleSelectCity} className="w-full max-w-xl" />
          </div>
        </section>

        {compareCities.length > 0 && (
          <section className="mb-8">
            <ComparePanel
              cities={compareCities}
              onRemove={handleRemoveFromCompare}
              onClear={handleClearCompare}
              onSelectCity={handleSelectFromCompare}
            />
          </section>
        )}

        {!selectedCity && compareCities.length === 0 && <EmptyState />}

        {selectedCity && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              {isLoading && <WeatherCardSkeleton />}
              {error && (
                <ErrorState
                  message="Failed to load weather data. Please try again."
                  onRetry={() => refetch()}
                />
              )}
              {weather && (
                <>
                  <WeatherCard
                    weather={weather}
                    onClose={() => setSelectedCity(null)}
                    onAddToCompare={handleAddToCompare}
                    isInCompare={isInCompare}
                    isMain
                  />
                  <ForecastSection daily={weather.daily} hourly={weather.hourly} />
                </>
              )}
              {isLoading && <ForecastSkeleton />}
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <Suspense fallback={<MapSkeleton />}>
                <InteractiveMap
                  markers={mapMarkers}
                  selectedCity={selectedCity}
                  onMarkerClick={(city) => setSelectedCity(city)}
                  className="h-[500px] lg:h-[600px]"
                />
              </Suspense>
            </div>
          </div>
        )}

        {!selectedCity && compareCities.length > 0 && (
          <div className="mt-8">
            <Suspense fallback={<MapSkeleton />}>
              <InteractiveMap
                markers={mapMarkers}
                onMarkerClick={(city) => {
                  const cityWeather = compareCities.find((c) => c.city.id === city.id);
                  if (cityWeather) {
                    setSelectedCity(cityWeather.city);
                  }
                }}
                className="h-[400px] md:h-[500px]"
              />
            </Suspense>
          </div>
        )}
      </main>

      <footer className="border-t bg-muted/30 py-6 mt-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Data from</span>
              <a
                href="https://open-meteo.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                Open-Meteo
              </a>
              <span>&</span>
              <a
                href="https://www.openstreetmap.org/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium hover:text-foreground transition-colors"
              >
                OpenStreetMap
              </a>
            </div>
            <p className="text-sm text-muted-foreground">
              Built with React, TypeScript, Leaflet
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
