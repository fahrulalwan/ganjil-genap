import { useCallback, useEffect, useRef, useState } from 'react';
import * as mapTilerSDK from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { type LngLatBoundsLike, MapStyle } from '@maptiler/sdk';
import { transformRequest } from '@/utils/mapUtils';

// temporarily set api key to dummy key to remove the error
mapTilerSDK.config.apiKey = 'abcdefghijklmnopqrstuvwxyz';

interface MapProps {
  center: [number, number];
  heading: number;
}

// Constants
const DEFAULT_COORDINATES: [number, number] = [-6.2088, 106.8456]; // Jakarta coordinates
const DEFAULT_ZOOM = 18;
const DEFAULT_HEADING = 0;

/**
 * TODO: Fine-tune these bounds to better cover Jakarta's Ganjil-Genap areas
 * @see GitHub Issue: https://github.com/fahrulalwan/ganjil-genap/issues/2
 */
// Jakarta bounds including main surrounding areas
const JABODETABEK_BOUNDS: LngLatBoundsLike = [
  [106.6885, -6.3728], // Southwest (includes parts of Tangerang and South Jakarta)
  [106.9873, -6.0805], // Northeast (includes parts of North Jakarta and Bekasi)
] as const;

// Error messages
const ERROR_MESSAGES = {
  INITIALIZATION: 'Failed to initialize map',
  LOAD_ERROR: 'Failed to load map. Please try refreshing the page.',
  INVALID_COORDINATES: 'Invalid coordinates provided',
  INVALID_HEADING: 'Invalid heading value provided',
} as const;

function logError(context: string, error: unknown) {
  // Safe error logging that doesn't expose internal details
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[PreviewMap] ${context}: ${errorMessage}`);
}

function isValidLatitude(lat: number): boolean {
  return !Number.isNaN(lat) && lat >= -90 && lat <= 90;
}

function isValidLongitude(lng: number): boolean {
  return !Number.isNaN(lng) && lng >= -180 && lng <= 180;
}

function isValidHeading(heading: number): boolean {
  return !Number.isNaN(heading) && Number.isFinite(heading);
}

function normalizeHeading(heading: number): number {
  if (!isValidHeading(heading)) {
    logError('Heading validation', new Error(ERROR_MESSAGES.INVALID_HEADING));
    return DEFAULT_HEADING;
  }
  return ((heading % 360) + 360) % 360;
}

function validateAndTransformCoordinates(
  coords: [number, number],
): [number, number] {
  const [lat, lng] = coords;
  if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
    logError(
      'Coordinate validation',
      new Error(ERROR_MESSAGES.INVALID_COORDINATES),
    );
    return DEFAULT_COORDINATES;
  }
  return [lng, lat];
}

export default function PreviewMap({
  center,
  heading = DEFAULT_HEADING,
}: Readonly<MapProps>) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapTilerSDK.Map | null>(null);
  const marker = useRef<mapTilerSDK.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const updateMarker = useCallback((coordinates: [number, number]) => {
    if (!map.current) return;

    try {
      if (marker.current) {
        marker.current.remove();
      }

      marker.current = new mapTilerSDK.Marker()
        .setLngLat(coordinates)
        .addTo(map.current);
    } catch (error) {
      logError('Marker update', error);
    }
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const validCoordinates = validateAndTransformCoordinates(center);
      const validHeading = normalizeHeading(heading);

      map.current = new mapTilerSDK.Map({
        container: mapContainer.current,
        style: MapStyle.STREETS,
        center: validCoordinates,
        zoom: DEFAULT_ZOOM,
        pitch: 60,
        bearing: validHeading,
        navigationControl: 'bottom-right',
        geolocateControl: 'bottom-right',
        maxBounds: JABODETABEK_BOUNDS,
        forceNoAttributionControl: true,
        transformRequest,
      });

      map.current.on('error', (error: Error) => {
        logError('Map runtime', error);
        setMapError(ERROR_MESSAGES.LOAD_ERROR);
      });

      map.current.on('load', () => {
        setMapError(null);
        updateMarker(validCoordinates);
      });
    } catch (error) {
      logError('Map initialization', error);
      setMapError(ERROR_MESSAGES.INITIALIZATION);
    }

    return () => {
      try {
        if (marker.current) {
          marker.current.remove();
          marker.current = null;
        }
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      } catch (error) {
        logError('Cleanup', error);
      }
    };
  }, [center, heading, updateMarker]);

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-destructive/10 text-destructive p-4 rounded-md">
        <p>{mapError}</p>
      </div>
    );
  }

  return <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />;
}
