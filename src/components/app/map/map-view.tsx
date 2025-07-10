'use client';

import { type FC, Suspense, useCallback, useEffect, useState } from 'react';
import MapFloatingInfoCard from '@/components/app/map/map-floating-info-card';
import MapLoadingScreen from '@/components/app/map/map-loading-screen';
import PreviewMap from '@/components/PreviewMap';
import { Button } from '@/components/ui/button';
import {
  GEOLOCATION_OPTIONS,
  LOCATION_THRESHOLD,
  MAX_RETRIES,
  RETRY_DELAY,
  UPDATE_DEBOUNCE,
} from '@/constants/geolocation';
import { DEFAULT_COORDINATES } from '@/constants/map';
import type { Road } from '@/types/road';
import MapSimulationCard from './map-simulation-card';

const useLocation = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [streetAddress, setStreetAddress] = useState<string>('Inisialisasi...');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const [lastCoordinate, setLastCoordinate] = useState<[number, number] | null>(
    null,
  );

  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);

  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = 'Tidak dapat mendapatkan lokasi Anda. ';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage += 'Mohon aktifkan layanan lokasi.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage += 'Informasi lokasi tidak tersedia.';
        break;
      case error.TIMEOUT:
        errorMessage += 'Permintaan lokasi timeout.';
        break;
      default:
        errorMessage += 'Terjadi kesalahan yang tidak diketahui.';
    }

    setLocationError(errorMessage);
    console.error('Geolocation error:', error);
  }, []);

  const hasLocationChangedSignificantly = useCallback(
    (newLoc: [number, number]) => {
      if (!lastCoordinate) return true;

      const [oldLat, oldLng] = lastCoordinate;
      const [newLat, newLng] = newLoc;

      return (
        Math.abs(oldLat - newLat) > LOCATION_THRESHOLD ||
        Math.abs(oldLng - newLng) > LOCATION_THRESHOLD
      );
    },
    [lastCoordinate],
  );

  const fetchStreetAddress = useCallback(async (lat: number, lng: number) => {
    try {
      setIsLoadingAddress(true);

      const response = await fetch(
        `/api/maptiles?path=/geocoding/${lng},${lat}.json`,
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const location = data.features[0];
        setStreetAddress(location.place_name || 'Lokasi tidak diketahui');
      } else {
        setStreetAddress('Lokasi tidak diketahui');
      }
    } catch (error: unknown) {
      console.error(
        'Error fetching address:',
        error instanceof Error ? error.message : 'Unknown error',
      );
      setStreetAddress('Tidak dapat memuat alamat');
    } finally {
      setIsLoadingAddress(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    let watchId: number | undefined;
    let debounceTimeoutId: NodeJS.Timeout | undefined;

    const handleSuccess = (position: GeolocationPosition) => {
      if (!mounted) return;

      const newLocation: [number, number] = [
        position.coords.latitude,
        position.coords.longitude,
      ];

      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId);
      }

      debounceTimeoutId = setTimeout(() => {
        if (hasLocationChangedSignificantly(newLocation)) {
          setUserLocation(newLocation);
          setLastCoordinate(newLocation);
          fetchStreetAddress(newLocation[0], newLocation[1]);
        }

        setGpsAccuracy(position.coords.accuracy);
        setLocationError(null);
        setRetryCount(0);
      }, UPDATE_DEBOUNCE);
    };

    const handleError = (error: GeolocationPositionError) => {
      if (!mounted) return;

      handleLocationError(error);

      if (error.code === error.PERMISSION_DENIED) {
        setUserLocation(DEFAULT_COORDINATES);
        fetchStreetAddress(DEFAULT_COORDINATES[0], DEFAULT_COORDINATES[1]);
        return;
      }

      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * 1.5 ** retryCount;
        setRetryCount((prev) => prev + 1);
        setTimeout(startLocationWatch, delay);
      } else {
        setUserLocation(DEFAULT_COORDINATES);
        fetchStreetAddress(DEFAULT_COORDINATES[0], DEFAULT_COORDINATES[1]);
      }
    };

    const startLocationWatch = () => {
      if (!mounted || !navigator.geolocation) {
        setLocationError('Geolokasi tidak didukung oleh browser Anda.');
        setUserLocation(DEFAULT_COORDINATES);
        return;
      }

      watchId = navigator.geolocation.watchPosition(
        handleSuccess,
        handleError,
        GEOLOCATION_OPTIONS,
      );
    };

    startLocationWatch();

    return () => {
      mounted = false;
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId);
      }
    };
  }, [
    retryCount,
    handleLocationError,
    hasLocationChangedSignificantly,
    fetchStreetAddress,
  ]);

  return {
    userLocation,
    locationError,
    streetAddress,
    isLoadingAddress,
    gpsAccuracy,
    fetchStreetAddress,
  };
};

interface MapViewProps {
  roads: Road[];
}

const MapView: FC<MapViewProps> = ({ roads }) => {
  const {
    userLocation,
    locationError,
    streetAddress,
    isLoadingAddress,
    gpsAccuracy,
    fetchStreetAddress,
  } = useLocation();

  const [simulationEnabled, setSimulationEnabled] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState(new Date());

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Add a small delay to ensure smooth transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update current time every minute
  useEffect(() => {
    if (simulationEnabled) {
      setCurrentTime(simulatedTime);
      return;
    }

    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, [simulationEnabled, simulatedTime]);

  // Add simulation controls
  const handleSimulationTimeChange = (
    hours: number,
    minutes: number,
    dayOffset = 0,
  ) => {
    const newTime = new Date();
    // Set to next Saturday if dayOffset is 6, or next Sunday if 7
    if (dayOffset === 6 || dayOffset === 7) {
      const currentDay = newTime.getDay();
      const daysUntilWeekend = dayOffset - currentDay;
      newTime.setDate(
        newTime.getDate() +
          (daysUntilWeekend > 0 ? daysUntilWeekend : daysUntilWeekend + 7),
      );
    }
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    setSimulatedTime(newTime);
  };

  if (isLoading) {
    return <MapLoadingScreen />;
  }

  return (
    <Suspense fallback={<MapLoadingScreen />}>
      <div className="h-screen w-screen">
        <h1 className="sr-only">Ganjil Genap Map Status</h1>

        {/* Map Content */}
        <article className="flex-1">
          <section className="absolute inset-0" aria-label="Map View">
            {userLocation ? (
              <figure className="h-full">
                <PreviewMap userLocation={userLocation} roads={roads} />
                <figcaption className="sr-only">
                  Interactive map showing current location
                </figcaption>
              </figure>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-600 dark:text-gray-400">
                  Memuat peta...
                </p>
              </div>
            )}
          </section>

          <MapFloatingInfoCard
            currentTime={currentTime}
            onFetchStreetAddress={fetchStreetAddress}
            isLoadingAddress={isLoadingAddress}
            userLocation={userLocation}
            streetAddress={streetAddress}
            gpsAccuracy={gpsAccuracy}
            locationError={locationError}
          />
        </article>

        {/* Add simulation controls */}
        {/* <div className="absolute bottom-24 left-2 right-2 md:right-auto md:left-4 md:w-[400px] bg-background/95 backdrop-blur p-4 rounded-lg border border-border dark:border-gray-800 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">Time Simulation</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSimulationEnabled(!simulationEnabled);
                setCurrentTime(simulationEnabled ? new Date() : simulatedTime);
              }}
            >
              {simulationEnabled ? 'Disable' : 'Enable'} Simulation
            </Button>
          </div>
          {simulationEnabled && (
            <MapSimulationCard
              handleTimeChange={handleSimulationTimeChange}
              currentTime={currentTime}
            />
          )}
        </div> */}
      </div>
    </Suspense>
  );
};

export default MapView;
