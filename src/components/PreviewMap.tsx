'use client';

import * as mapTilerSDK from '@maptiler/sdk';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { MapStyle } from '@maptiler/sdk';
import {
  DEFAULT_COORDINATES,
  DEFAULT_ZOOM,
  ERROR_MESSAGES,
  JABODETABEK_BOUNDS,
} from '@/constants/map';
import { ROAD_STYLE } from '@/constants/roadCoordinates';
import { transformRequest } from '@/utils/mapUtils';

// temporarily set api key to dummy key to remove the error
mapTilerSDK.config.apiKey = 'abcdefghijklmnopqrstuvwxyz';

interface MapProps {
  center: [number, number];
}

interface Road {
  name: string;
  coordinates: [number, number][];
}

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

const PreviewMap: FC<MapProps> = ({ center }: Readonly<MapProps>) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapTilerSDK.Map | null>(null);
  const geolocateControl = useRef<mapTilerSDK.GeolocateControl | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [roads, setRoads] = useState<Road[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to initialize map
  const initializeMap = useCallback(
    (coordinates: [number, number]) => {
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
      map.current.addControl(
        new mapTilerSDK.NavigationControl(),
        'bottom-right',
      );
      map.current.addControl(geolocateControl.current, 'bottom-right');

      map.current.on('error', (error: Error) => {
        logError('Map runtime', error);
        setMapError(ERROR_MESSAGES.LOAD_ERROR);
      });

      map.current.on('load', () => {
        if (!map.current) return;
        setMapError(null);

        roads.forEach((road, index) => {
          if (!map.current) return;
          const sourceId = `road-source-${index}`;
          const layerId = `road-layer-${index}`;

          map.current.addSource(sourceId, {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: { name: road.name },
              geometry: {
                type: 'LineString',
                coordinates: road.coordinates,
              },
            },
          });

          map.current.addLayer({
            id: layerId,
            type: 'line',
            source: sourceId,
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: {
              'line-color': ROAD_STYLE.activeColor,
              'line-width': ROAD_STYLE.lineWidth,
              'line-opacity': ROAD_STYLE.opacity,
            },
          });
        });

        geolocateControl.current?.trigger();
      });
    },
    [roads],
  );

  useEffect(() => {
    async function fetchRoads() {
      try {
        const response = await fetch('/api/roads');
        if (!response.ok) {
          throw new Error('Failed to fetch road data');
        }
        const data: Road[] = await response.json();
        setRoads(data);
      } catch (error) {
        logError('Fetch road data', error);
        setMapError('Could not load road data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchRoads();
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100/50 dark:bg-gray-900/50">
        <p>Loading map data...</p>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-destructive/10 text-destructive p-4 rounded-md">
        <p>{mapError}</p>
      </div>
    );
  }

  return <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />;
};

export default PreviewMap;
