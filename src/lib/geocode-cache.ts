// In-memory LRU cache for Google Geocoding API responses
// Helps reduce API costs and improve response times during traffic spikes
// Note: Cache resets on cold starts but provides significant savings during active use

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface LRUCache<T> {
  cache: Map<string, CacheEntry<T>>;
  maxSize: number;
  ttlMs: number;
}

function createLRUCache<T>(maxSize: number, ttlMs: number): LRUCache<T> {
  return {
    cache: new Map(),
    maxSize,
    ttlMs,
  };
}

function get<T>(lruCache: LRUCache<T>, key: string): T | null {
  const entry = lruCache.cache.get(key);

  if (!entry) {
    return null;
  }

  // Check if entry has expired
  if (Date.now() - entry.timestamp > lruCache.ttlMs) {
    lruCache.cache.delete(key);
    return null;
  }

  // Move to end (most recently used)
  lruCache.cache.delete(key);
  lruCache.cache.set(key, entry);

  return entry.data;
}

function set<T>(lruCache: LRUCache<T>, key: string, data: T): void {
  // If at max capacity, remove oldest entry (first item in Map)
  if (lruCache.cache.size >= lruCache.maxSize) {
    const firstKey = lruCache.cache.keys().next().value;
    if (firstKey) {
      lruCache.cache.delete(firstKey);
    }
  }

  lruCache.cache.set(key, {
    data,
    timestamp: Date.now(),
  });
}

// Cache configuration
const MAX_CACHE_SIZE = 1000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Geocoding response type
export interface GeocodeResult {
  name: string;
  country: string;
  fullName: string;
  lat: number;
  lng: number;
}

// Create separate caches for forward and reverse geocoding
const forwardGeocodeCache = createLRUCache<GeocodeResult[]>(MAX_CACHE_SIZE, CACHE_TTL_MS);
const reverseGeocodeCache = createLRUCache<GeocodeResult>(MAX_CACHE_SIZE, CACHE_TTL_MS);

// Generate cache key for city search
export function getCitySearchCacheKey(query: string): string {
  return `fwd:${query.toLowerCase().trim()}`;
}

// Generate cache key for reverse geocoding
// Round coordinates to 4 decimal places (~11m precision) for better cache hits
export function getReverseGeocodeCacheKey(lat: number, lng: number): string {
  const roundedLat = Math.round(lat * 10000) / 10000;
  const roundedLng = Math.round(lng * 10000) / 10000;
  return `rev:${roundedLat},${roundedLng}`;
}

// Cache operations for forward geocoding (city search)
export function getCachedCitySearch(query: string): GeocodeResult[] | null {
  return get(forwardGeocodeCache, getCitySearchCacheKey(query));
}

export function setCachedCitySearch(query: string, results: GeocodeResult[]): void {
  set(forwardGeocodeCache, getCitySearchCacheKey(query), results);
}

// Cache operations for reverse geocoding
export function getCachedReverseGeocode(lat: number, lng: number): GeocodeResult | null {
  return get(reverseGeocodeCache, getReverseGeocodeCacheKey(lat, lng));
}

export function setCachedReverseGeocode(lat: number, lng: number, result: GeocodeResult): void {
  set(reverseGeocodeCache, getReverseGeocodeCacheKey(lat, lng), result);
}

// Get cache stats (useful for debugging)
export function getCacheStats() {
  return {
    forwardCacheSize: forwardGeocodeCache.cache.size,
    reverseCacheSize: reverseGeocodeCache.cache.size,
    maxSize: MAX_CACHE_SIZE,
    ttlHours: CACHE_TTL_MS / (60 * 60 * 1000),
  };
}
