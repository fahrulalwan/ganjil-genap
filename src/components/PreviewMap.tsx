import { useCallback, useEffect, useRef, useState } from 'react';
import * as mapTilerSDK from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import { MapStyle } from '@maptiler/sdk';
import { transformRequest } from '@/utils/mapUtils';

interface MapProps {
  center: [number, number];
  heading: number;
}

// Constants
const DEFAULT_COORDINATES: [number, number] = [-6.2088, 106.8456]; // Jakarta coordinates
const DEFAULT_ZOOM = 18;

function isValidLatitude(lat: number): boolean {
  return !Number.isNaN(lat) && lat >= -90 && lat <= 90;
}

function isValidLongitude(lng: number): boolean {
  return !Number.isNaN(lng) && lng >= -180 && lng <= 180;
}

function validateAndTransformCoordinates(
  coords: [number, number],
): [number, number] {
  const [lat, lng] = coords;
  if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
    console.warn('Invalid coordinates provided, using default coordinates');
    return DEFAULT_COORDINATES;
  }
  return [lng, lat]; // MapTiler expects [lng, lat]
}

export default function PreviewMap({
  center,
  heading = 0,
}: Readonly<MapProps>) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapTilerSDK.Map | null>(null);
  const marker = useRef<mapTilerSDK.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  const updateMarker = useCallback((coordinates: [number, number]) => {
    if (!map.current) return;

    if (marker.current) {
      marker.current.remove();
    }

    marker.current = new mapTilerSDK.Marker()
      .setLngLat(coordinates)
      .addTo(map.current);
  }, []);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      const validCoordinates = validateAndTransformCoordinates(center);
      mapTilerSDK.config.apiKey = 'dummy-key';

      map.current = new mapTilerSDK.Map({
        container: mapContainer.current,
        style: MapStyle.STREETS,
        center: validCoordinates,
        zoom: DEFAULT_ZOOM,
        pitch: 60,
        bearing: heading,
        navigationControl: 'bottom-right',
        geolocateControl: 'bottom-right',
        transformRequest,
      });

      map.current.on('error', (error: Error) => {
        console.error('Map error:', error);
        setMapError('Failed to load map. Please try refreshing the page.');
      });

      map.current.on('load', () => {
        setMapError(null);
        updateMarker(validCoordinates);
      });
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map');
    }

    return () => {
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
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
