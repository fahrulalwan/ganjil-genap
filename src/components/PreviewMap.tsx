'use client';

import * as mapTilerSDK from '@maptiler/sdk';
import { type FC, useCallback, useEffect, useRef, useState } from 'react';
import type { Road } from '@/types/road';
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
mapTilerSDK.config.caching = true;

interface MapProps {
  userLocation: [number, number] | null;
  roads: Road[];
}

function logError(context: string, error: unknown) {
  const errorMessage = error instanceof Error ? error.message : 'Unknown error';
  console.error(`[PreviewMap] ${context}: ${errorMessage}`);
}

function isValidLatitude(lat: number): boolean {
  return !Number.isNaN(lat) && lat >= -90 && lat <= 90;
}

function isValidLongitude(lng: number): boolean {
  return !Number.isNaN(lng) && lng >= -180 && lng <= 180;
}

const PreviewMap: FC<MapProps> = ({ userLocation, roads }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapTilerSDK.Map | null>(null);
  const geolocateControl = useRef<mapTilerSDK.GeolocateControl | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

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

      geolocateControl.current = new mapTilerSDK.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        fitBoundsOptions: { maxZoom: DEFAULT_ZOOM },
        trackUserLocation: true,
        showAccuracyCircle: true,
        showUserLocation: true,
      });

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
    if (!mapContainer.current || map.current) return;

    const center = userLocation || DEFAULT_COORDINATES;

    try {
      const [lat, lng] = center;

      if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
        logError(
          'Coordinate validation',
          new Error(ERROR_MESSAGES.INVALID_COORDINATES),
        );
        const [defaultLat, defaultLng] = DEFAULT_COORDINATES;
        initializeMap([defaultLng, defaultLat]);
        return;
      }

      initializeMap([lng, lat]);
    } catch (error) {
      logError('Map initialization', error);
      setMapError(ERROR_MESSAGES.INITIALIZATION);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [userLocation, initializeMap]);

  if (mapError) {
    return (
      <div className="flex items-center justify-center h-full bg-red-100/50 dark:bg-red-900/50">
        <p className="text-red-700">{mapError}</p>
      </div>
    );
  }

  return <div ref={mapContainer} style={{ height: '100%', width: '100%' }} />;
};

export default PreviewMap;
