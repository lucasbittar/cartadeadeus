'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { copy } from '@/constants/copy';
import type { City } from '@/types';

type LocationState = 'loading' | 'success' | 'editing' | 'fallback';

interface CitySearchProps {
  value: City | null;
  onChange: (city: City | null) => void;
  className?: string;
}

export function CitySearch({ value, onChange, className }: CitySearchProps) {
  const [state, setState] = useState<LocationState>('loading');
  const [cityName, setCityName] = useState('');
  const [gpsCoordinates, setGpsCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fallback search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<City[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Auto-request GPS on mount
  useEffect(() => {
    requestGpsLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fallback search effect (only in fallback mode)
  useEffect(() => {
    if (state !== 'fallback' || query.length < 2) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    // Don't search if query matches current value
    if (value?.fullName === query) {
      setHasSearched(false);
      return;
    }

    const searchCities = async () => {
      setIsSearching(true);
      setHasSearched(false);
      try {
        const response = await fetch(`/api/cities?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (Array.isArray(data)) {
          setResults(data);
        } else if (data.error) {
          setResults([]);
        } else {
          setResults([data]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsSearching(false);
        setHasSearched(true);
      }
    };

    const debounce = setTimeout(searchCities, 300);
    return () => clearTimeout(debounce);
  }, [query, value?.fullName, state]);

  const requestGpsLocation = async () => {
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada pelo navegador');
      setState('fallback');
      return;
    }

    setState('loading');
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });

      const { latitude, longitude } = position.coords;
      setGpsCoordinates({ lat: latitude, lng: longitude });

      // Reverse geocode for display name
      const response = await fetch(`/api/cities?lat=${latitude}&lng=${longitude}`);
      if (response.ok) {
        const city = await response.json();
        if (!city.error) {
          setCityName(city.fullName);
          onChange({
            ...city,
            lat: latitude,
            lng: longitude,
          });
          setState('success');
          return;
        }
      }

      // Reverse geocoding failed - use coordinates as fallback display
      const fallbackName = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      setCityName(fallbackName);
      onChange({
        name: fallbackName,
        country: '',
        fullName: fallbackName,
        lat: latitude,
        lng: longitude,
      });
      setState('success');
    } catch (err) {
      const geoError = err as GeolocationPositionError;
      if (geoError.code === geoError.PERMISSION_DENIED) {
        setError('Permita o acesso à localização para continuar');
      } else if (geoError.code === geoError.TIMEOUT) {
        setError('Tempo esgotado. Tente novamente.');
      } else {
        setError('Não foi possível obter sua localização');
      }
      setState('fallback');
    }
  };

  const handleEdit = () => {
    setState('editing');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleSave = () => {
    if (!gpsCoordinates) return;

    onChange({
      name: cityName,
      country: '',
      fullName: cityName,
      lat: gpsCoordinates.lat,
      lng: gpsCoordinates.lng,
    });
    setState('success');
  };

  const handleFallbackSelect = (city: City) => {
    setQuery(city.fullName);
    setIsOpen(false);
    setHasSearched(false);
    onChange(city);
  };

  const showDropdown = state === 'fallback' && isOpen && query.length >= 2 && (isSearching || hasSearched);

  // Loading state
  if (state === 'loading') {
    return (
      <div className={cn('relative', className)}>
        <label className="block text-sm font-medium text-foreground/70 mb-2">
          {copy.form.locationLabel}
        </label>
        <div className={cn(
          'w-full px-4 py-3 rounded-lg border border-foreground/10',
          'bg-white text-foreground/50',
          'flex items-center gap-3'
        )}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-4 h-4 border-2 border-burgundy/30 border-t-burgundy rounded-full"
          />
          <span className="text-sm">Obtendo localização...</span>
        </div>
      </div>
    );
  }

  // Success state (read-only)
  if (state === 'success') {
    return (
      <div className={cn('relative', className)}>
        <label className="block text-sm font-medium text-foreground/70 mb-2">
          {copy.form.locationLabel}
        </label>
        <div className={cn(
          'w-full px-4 py-3 rounded-lg border border-foreground/10',
          'bg-white text-foreground',
          'flex items-center justify-between'
        )}>
          <div className="flex items-center gap-2">
            <span className="text-burgundy">📍</span>
            <span className="text-sm">{cityName}</span>
          </div>
          <button
            type="button"
            onClick={handleEdit}
            className="px-3 py-1 text-xs font-medium text-burgundy hover:bg-burgundy/5 rounded-md transition-colors"
          >
            Editar
          </button>
        </div>
      </div>
    );
  }

  // Editing state
  if (state === 'editing') {
    return (
      <div className={cn('relative', className)}>
        <label className="block text-sm font-medium text-foreground/70 mb-2">
          {copy.form.locationLabel}
        </label>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className={cn(
              'w-full px-4 py-3 pr-24 rounded-lg border border-foreground/10',
              'bg-white text-foreground placeholder:text-foreground/40',
              'focus:outline-none focus:ring-2 focus:ring-burgundy/30 focus:border-burgundy',
              'transition-all duration-200'
            )}
          />
          <button
            type="button"
            onClick={handleSave}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-burgundy hover:bg-burgundy/5 rounded-md transition-colors"
          >
            Salvar
          </button>
        </div>
        <p className="mt-1 text-xs text-foreground/50">
          A localização no mapa permanece a mesma (sua posição atual).
        </p>
      </div>
    );
  }

  // Fallback state (manual search)
  return (
    <div ref={wrapperRef} className={cn('relative', className)}>
      <label className="block text-sm font-medium text-foreground/70 mb-2">
        {copy.form.locationLabel}
      </label>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-foreground/60 mb-2 flex items-center gap-2"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={requestGpsLocation}
            className="text-burgundy hover:underline text-xs"
          >
            Tentar novamente
          </button>
        </motion.p>
      )}

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
          onClick={requestGpsLocation}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-burgundy hover:bg-burgundy/5 rounded-md transition-colors"
        >
          Usar GPS
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
            {isSearching ? (
              <li className="px-4 py-3 text-foreground/50 text-sm">
                Buscando...
              </li>
            ) : results.length > 0 ? (
              results.map((city, index) => (
                <li key={`${city.lat}-${city.lng}-${city.name}-${index}`}>
                  <button
                    type="button"
                    onClick={() => handleFallbackSelect(city)}
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
