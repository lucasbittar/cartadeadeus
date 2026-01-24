'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { copy } from '@/constants/copy';
import type { City } from '@/types';

interface CitySearchProps {
  value: City | null;
  onChange: (city: City | null) => void;
  className?: string;
}

export function CitySearch({ value, onChange, className }: CitySearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Sync query with value when value changes externally
  useEffect(() => {
    if (value?.fullName && query !== value.fullName) {
      setQuery(value.fullName);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Don't search if query matches current value (user selected from dropdown)
    if (value?.fullName === query) {
      setHasSearched(false);
      return;
    }

    const searchCities = async () => {
      setIsLoading(true);
      setHasSearched(false);
      setError(null);
      try {
        const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        // Check if it's an array (success) or an error object
        if (Array.isArray(data)) {
          setResults(data);
          setError(null);
        } else if (data.error) {
          console.error('City search error:', data.error);
          setResults([]);
          setError(data.error);
        } else {
          // Single result object
          setResults([data]);
          setError(null);
        }
      } catch (err) {
        console.error('Failed to search cities:', err);
        setResults([]);
        setError('Falha ao buscar cidades');
      } finally {
        setIsLoading(false);
        setHasSearched(true);
      }
    };

    const debounce = setTimeout(searchCities, 300);
    return () => clearTimeout(debounce);
  }, [query, value?.fullName]);

  const handleSelect = (city: City) => {
    setQuery(city.fullName);
    setIsOpen(false);
    setHasSearched(false);
    onChange(city);
  };

  const handleUseLocation = async () => {
    if (!navigator.geolocation) return;

    setIsLoading(true);
    setIsOpen(false);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      const response = await fetch(`/api/cities?lat=${latitude}&lng=${longitude}`);
      if (response.ok) {
        const city = await response.json();
        if (!city.error) {
          onChange(city);
          setQuery(city.fullName);
        }
      }
    } catch (error) {
      console.error('Failed to get location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showDropdown = isOpen && query.length >= 2 && (isLoading || hasSearched);

  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <label className="block text-sm font-medium text-foreground/70 mb-2">
        {copy.form.locationLabel}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (!e.target.value) {
              onChange(null);
              setHasSearched(false);
            }
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={copy.form.locationPlaceholder}
          className={cn(
            'w-full px-4 py-3 pr-24 rounded-lg border border-foreground/10',
            'bg-white text-foreground placeholder:text-foreground/40',
            'focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy',
            'transition-all duration-200'
          )}
        />
        <button
          type="button"
          onClick={handleUseLocation}
          disabled={isLoading}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-burgundy rounded-md transition-colors",
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-burgundy/5"
          )}
        >
          {isLoading ? 'Buscando...' : 'Usar GPS'}
        </button>
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-50 w-full mt-1 bg-white border border-foreground/10 rounded-lg shadow-lg max-h-60 overflow-auto"
          >
            {isLoading ? (
              <li className="px-4 py-3 text-foreground/50 text-sm">
                Buscando...
              </li>
            ) : error ? (
              <li className="px-4 py-3 text-red-600 text-sm">
                {error.includes('not enabled') || error.includes('not activated')
                  ? 'API de busca não configurada. Por favor, habilite a Geocoding API no Google Cloud Console.'
                  : 'Erro ao buscar cidades. Tente novamente.'}
              </li>
            ) : results.length > 0 ? (
              results.map((city, index) => (
                <li key={`${city.lat}-${city.lng}-${city.name}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleSelect(city)}
                    className="w-full px-4 py-3 text-left hover:bg-burgundy/5 transition-colors text-sm"
                  >
                    <span className="font-medium">{city.name}</span>
                    {city.country && (
                      <span className="text-foreground/50">, {city.country}</span>
                    )}
                  </button>
                </li>
              ))
            ) : hasSearched ? (
              <li className="px-4 py-3 text-foreground/50 text-sm">
                Nenhuma cidade encontrada para &quot;{query}&quot;
              </li>
            ) : null}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
