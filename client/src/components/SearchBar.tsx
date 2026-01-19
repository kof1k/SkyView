import { useState, useRef, useEffect } from "react";
import { Search, MapPin, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { GeocodingResult } from "@shared/schema";

interface SearchBarProps {
  onSelectCity: (city: GeocodingResult) => void;
  className?: string;
}

export function SearchBar({ onSelectCity, className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: results, isLoading } = useQuery<GeocodingResult[]>({
    queryKey: ["/api/geocoding", query],
    enabled: query.length >= 2,
  });

  useEffect(() => {
    if (results && results.length > 0) {
      setIsOpen(true);
    }
  }, [results]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!results || results.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  const handleSelect = (city: GeocodingResult) => {
    onSelectCity(city);
    setQuery("");
    setIsOpen(false);
    setSelectedIndex(-1);
  };

  const clearSearch = () => {
    setQuery("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative w-full max-w-xl ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
        <Input
          ref={inputRef}
          type="search"
          placeholder="Search for a city..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(-1);
          }}
          onFocus={() => results && results.length > 0 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="h-11 sm:h-12 pl-10 sm:pl-12 pr-10 sm:pr-12 text-sm sm:text-base rounded-xl border-2 border-transparent bg-muted focus:border-primary focus:bg-background transition-all"
          data-testid="input-search-city"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            onClick={clearSearch}
            data-testid="button-clear-search"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      {isOpen && results && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-popover border border-popover-border rounded-xl shadow-lg overflow-hidden z-50"
        >
          <ul className="py-2">
            {results.map((city, index) => (
              <li key={city.id}>
                <button
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 flex items-center gap-2 sm:gap-3 text-left transition-colors hover-elevate ${
                    index === selectedIndex ? "bg-accent" : ""
                  }`}
                  onClick={() => handleSelect(city)}
                  data-testid={`button-city-result-${index}`}
                >
                  <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">{city.name}</p>
                    <p className="text-xs sm:text-sm text-muted-foreground truncate">
                      {city.admin1 ? `${city.admin1}, ` : ""}
                      {city.country}
                    </p>
                  </div>
                  {city.population && (
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      {(city.population / 1000).toFixed(0)}k
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && query.length >= 2 && (!results || results.length === 0) && !isLoading && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-popover-border rounded-xl shadow-lg p-4 text-center text-muted-foreground z-50">
          No cities found for "{query}"
        </div>
      )}
    </div>
  );
}
