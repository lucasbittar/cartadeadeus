import { NextRequest, NextResponse } from 'next/server';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

interface GoogleGeocodingResponse {
  status: string;
  results: Array<{
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }>;
  error_message?: string;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Google Maps API key not configured');
    return NextResponse.json(
      { error: 'API not configured. Please set GOOGLE_MAPS_API_KEY in .env.local' },
      { status: 500 }
    );
  }

  // Reverse geocoding (lat/lng to city)
  if (lat && lng) {
    return handleReverseGeocode(parseFloat(lat), parseFloat(lng));
  }

  // City search using geocoding
  if (query && query.length >= 2) {
    return handleCitySearch(query);
  }

  return NextResponse.json([]);
}

async function handleCitySearch(query: string) {
  try {
    // Use Geocoding API for city search
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('address', query);
    url.searchParams.set('language', 'pt-BR');
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY!);

    const response = await fetch(url.toString());
    const data: GoogleGeocodingResponse = await response.json();

    // Check for API errors
    if (data.error_message) {
      console.error('Google Geocoding API error:', data.error_message);

      // Provide helpful message for common errors
      if (data.error_message.includes('not activated') || data.error_message.includes('not enabled')) {
        return NextResponse.json({
          error: 'Google Geocoding API not enabled. Please enable it at: https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com'
        }, { status: 400 });
      }

      return NextResponse.json({ error: data.error_message }, { status: 400 });
    }

    if (data.status !== 'OK') {
      if (data.status === 'ZERO_RESULTS') {
        return NextResponse.json([]);
      }
      if (data.status === 'REQUEST_DENIED') {
        return NextResponse.json({
          error: 'API request denied. Please check your API key and enable Geocoding API.'
        }, { status: 400 });
      }
      console.error('Geocoding API error:', data.status);
      return NextResponse.json([]);
    }

    // Map geocoding results to city format
    const cities = data.results.slice(0, 5).map((result) => {
      const cityComponent = result.address_components.find(
        (c) => c.types.includes('locality') || c.types.includes('administrative_area_level_2')
      );
      const stateComponent = result.address_components.find(
        (c) => c.types.includes('administrative_area_level_1')
      );
      const countryComponent = result.address_components.find(
        (c) => c.types.includes('country')
      );

      const cityName = cityComponent?.long_name || result.formatted_address.split(',')[0];
      const stateName = stateComponent?.short_name;
      const countryName = countryComponent?.long_name || '';

      let fullName = cityName;
      if (stateName) fullName += `, ${stateName}`;
      if (countryName) fullName += `, ${countryName}`;

      return {
        name: cityName,
        country: countryName,
        fullName,
        lat: result.geometry.location.lat,
        lng: result.geometry.location.lng,
      };
    });

    return NextResponse.json(cities);
  } catch (error) {
    console.error('Error searching cities:', error);
    return NextResponse.json({ error: 'Failed to search cities' }, { status: 500 });
  }
}

async function handleReverseGeocode(lat: number, lng: number) {
  try {
    const url = new URL('https://maps.googleapis.com/maps/api/geocode/json');
    url.searchParams.set('latlng', `${lat},${lng}`);
    url.searchParams.set('language', 'pt-BR');
    url.searchParams.set('key', GOOGLE_MAPS_API_KEY!);

    const response = await fetch(url.toString());
    const data: GoogleGeocodingResponse = await response.json();

    if (data.error_message) {
      console.error('Reverse geocoding API error:', data.error_message);
    }

    if (data.status !== 'OK' || !data.results || data.results.length === 0) {
      console.error('Reverse geocoding error:', data.status);
      return NextResponse.json({
        name: 'Local desconhecido',
        country: '',
        lat,
        lng,
        fullName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
      });
    }

    const result = data.results[0];
    const cityComponent = result.address_components.find(
      (c) => c.types.includes('locality') || c.types.includes('administrative_area_level_2')
    );
    const stateComponent = result.address_components.find(
      (c) => c.types.includes('administrative_area_level_1')
    );
    const countryComponent = result.address_components.find(
      (c) => c.types.includes('country')
    );

    const cityName = cityComponent?.long_name || 'Local desconhecido';
    const stateName = stateComponent?.short_name;
    const countryName = countryComponent?.long_name || '';

    let fullName = cityName;
    if (stateName) fullName += `, ${stateName}`;
    if (countryName) fullName += `, ${countryName}`;

    return NextResponse.json({
      name: cityName,
      country: countryName,
      lat,
      lng,
      fullName,
    });
  } catch (error) {
    console.error('Error reverse geocoding:', error);
    return NextResponse.json({
      name: 'Local desconhecido',
      country: '',
      lat,
      lng,
      fullName: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    });
  }
}
