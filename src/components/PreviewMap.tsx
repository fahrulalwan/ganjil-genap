import { useCallback, useEffect, useRef, useState } from 'react';
import * as mapTilerSDK from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { type LngLatBoundsLike, MapStyle } from '@maptiler/sdk';
import { transformRequest } from '@/utils/mapUtils';
import { ROAD_COORDINATES, ROAD_STYLE } from '@/constants/roadCoordinates';

// temporarily set api key to dummy key to remove the error
mapTilerSDK.config.apiKey = 'abcdefghijklmnopqrstuvwxyz';

interface MapProps {
  center: [number, number];
}

// Constants
const DEFAULT_COORDINATES: [number, number] = [-6.2088, 106.8456]; // Jakarta coordinates
const DEFAULT_ZOOM = 18;

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

export default function PreviewMap({ center }: Readonly<MapProps>) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapTilerSDK.Map | null>(null);
  const geolocateControl = useRef<mapTilerSDK.GeolocateControl | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  // Helper function to initialize map
  const initializeMap = useCallback((coordinates: [number, number]) => {
    if (!mapContainer.current) return;

    map.current = new mapTilerSDK.Map({
      container: mapContainer.current,
      style: MapStyle.STREETS,
      center: coordinates,
      zoom: DEFAULT_ZOOM,
      pitch: 60,
      maxBounds: JABODETABEK_BOUNDS,
      forceNoAttributionControl: true,
      navigationControl: false,
      geolocateControl: false,
      antialias: true,
      transformRequest,
    });

    // Initialize geolocate control
    geolocateControl.current = new mapTilerSDK.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      fitBoundsOptions: {
        maxZoom: DEFAULT_ZOOM,
      },
      trackUserLocation: true,
      showAccuracyCircle: true,
      showUserLocation: true,
    });

    // Add controls to map
    map.current.addControl(new mapTilerSDK.NavigationControl(), 'bottom-right');
    map.current.addControl(geolocateControl.current, 'bottom-right');

    map.current.on('error', (error: Error) => {
      logError('Map runtime', error);
      setMapError(ERROR_MESSAGES.LOAD_ERROR);
    });

    map.current.on('load', () => {
      setMapError(null);
      // Add road polylines
      Object.entries(ROAD_COORDINATES).forEach(([_, coordinates]  , index) => {
        // Add the line source
        map.current?.addSource(`road-${index}`, {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          }
        });

        // Add the line layer
        map.current?.addLayer({
          id: `road-line-${index}`,
          type: 'line',
          source: `road-${index}`,
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': ROAD_STYLE.activeColor,
            'line-width': ROAD_STYLE.lineWidth,
            'line-opacity': ROAD_STYLE.opacity
          }
        });
      });

      // Trigger geolocation on load
      geolocateControl.current?.trigger();
    });
  }, []);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      // MapTiler expects [lng, lat] order for coordinates
      const [lat, lng] = center;

      // Validate coordinates
      if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
        logError(
          'Coordinate validation',
          new Error(ERROR_MESSAGES.INVALID_COORDINATES),
        );
        // Use default coordinates as fallback
        const [defaultLat, defaultLng] = DEFAULT_COORDINATES;
        const fallbackCoordinates: [number, number] = [defaultLng, defaultLat];
        initializeMap(fallbackCoordinates);
        return;
      }

      const validCoordinates: [number, number] = [lng, lat];
      initializeMap(validCoordinates);
    } catch (error) {
      logError('Map initialization', error);
      setMapError(ERROR_MESSAGES.INITIALIZATION);
    }

    return () => {
      try {
        if (map.current) {
          map.current.remove();
          map.current = null;
        }
      } catch (error) {
        logError('Cleanup', error);
      }
    };
  }, [center, initializeMap]);

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-destructive/10 text-destructive p-4 rounded-md">
        <p>{mapError}</p>
      </div>
    );
  }

  return <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />;
}
