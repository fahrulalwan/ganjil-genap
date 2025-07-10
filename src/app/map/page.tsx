'use client';

import { type FC, Suspense, useCallback, useEffect, useState } from 'react';
import AdSensePlaceholder from '@/components/AdSensePlaceholder';
import MapFloatingInfoCard from '@/components/app/map/map-floating-info-card';
import MapLoadingScreen from '@/components/app/map/map-loading-screen';
import MapSimulationCard from '@/components/app/map/map-simulation-card';
import PreviewMap from '@/components/PreviewMap';
import { Button } from '@/components/ui/button';
import {
  FALLBACK_TIMEOUT,
  GEOLOCATION_OPTIONS,
  LOCATION_THRESHOLD,
  MAX_RETRIES,
  PERIODIC_REFRESH,
  RETRY_DELAY,
  UPDATE_DEBOUNCE,
} from '@/constants/geolocation';
import { DEFAULT_COORDINATES } from '@/constants/map';

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

  // Initialize location tracking
  useEffect(() => {
    let mounted = true;
    let watchId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;
    let fallbackTimeoutId: NodeJS.Timeout | undefined;
    let retryTimeoutId: NodeJS.Timeout | undefined;
    let periodicRefreshId: NodeJS.Timeout | undefined;
    let debounceTimeoutId: NodeJS.Timeout | undefined;

    const handleSuccess = (position: GeolocationPosition) => {
      if (!mounted) return;

      const newLocation: [number, number] = [
        position.coords.latitude,
        position.coords.longitude,
      ];

      // Clear any existing debounce timeout
      if (debounceTimeoutId) {
        clearTimeout(debounceTimeoutId);
      }

      // Debounce location updates
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

      // Don't retry if permission is denied
      if (error.code === error.PERMISSION_DENIED) {
        setUserLocation(DEFAULT_COORDINATES);
        setLastCoordinate(DEFAULT_COORDINATES);
        fetchStreetAddress(DEFAULT_COORDINATES[0], DEFAULT_COORDINATES[1]);
        return;
      }

      // Implement progressive retry with backoff
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * 1.5 ** retryCount;
        setRetryCount((prev) => prev + 1);
        retryTimeoutId = setTimeout(startLocationWatch, delay);
      } else {
        setUserLocation(DEFAULT_COORDINATES);
        setLastCoordinate(DEFAULT_COORDINATES);
        fetchStreetAddress(DEFAULT_COORDINATES[0], DEFAULT_COORDINATES[1]);
      }
    };

    const startLocationWatch = () => {
      if (!mounted || !navigator.geolocation) {
        setLocationError('Geolokasi tidak didukung oleh browser Anda.');
        setUserLocation(DEFAULT_COORDINATES);
        return;
      }

      try {
        // First try to get current position for immediate feedback
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          (error) => {
            console.warn('Initial position error:', error);
            // If getCurrentPosition fails, we still continue with watchPosition
          },
          GEOLOCATION_OPTIONS,
        );

        // Then set up continuous watching
        watchId = navigator.geolocation.watchPosition(
          handleSuccess,
          handleError,
          GEOLOCATION_OPTIONS,
        );

        // Set up fallback mechanism
        fallbackTimeoutId = setTimeout(() => {
          if (!userLocation || userLocation === DEFAULT_COORDINATES) {
            console.warn('Location watch fallback triggered');
            // Try one more time with less strict options
            navigator.geolocation.getCurrentPosition(
              handleSuccess,
              handleError,
              {
                enableHighAccuracy: false,
                timeout: 10000,
                maximumAge: 30000,
              },
            );
          }
        }, FALLBACK_TIMEOUT);

        // Set up periodic refresh to ensure location stays accurate
        periodicRefreshId = setInterval(() => {
          navigator.geolocation.getCurrentPosition(
            handleSuccess,
            (error) => {
              console.warn('Periodic refresh error:', error);
            },
            GEOLOCATION_OPTIONS,
          );
        }, PERIODIC_REFRESH);
      } catch (error) {
        if (!mounted) return;

        console.error('Geolocation error:', error);
        if (error instanceof GeolocationPositionError) {
          handleError(error);
        }
        setUserLocation(DEFAULT_COORDINATES);
        setLastCoordinate(DEFAULT_COORDINATES);
        fetchStreetAddress(DEFAULT_COORDINATES[0], DEFAULT_COORDINATES[1]);
      }
    };

    startLocationWatch();

    // Cleanup function
    return () => {
      mounted = false;

      if (watchId !== undefined) navigator.geolocation.clearWatch(watchId);

      if (timeoutId) clearTimeout(timeoutId);
      if (fallbackTimeoutId) clearTimeout(fallbackTimeoutId);
      if (retryTimeoutId) clearTimeout(retryTimeoutId);
      if (periodicRefreshId) clearInterval(periodicRefreshId);
      if (debounceTimeoutId) clearTimeout(debounceTimeoutId);
    };
  }, [
    hasLocationChangedSignificantly,
    handleLocationError,
    retryCount,
    fetchStreetAddress,
    userLocation,
  ]);

  return {
    userLocation,
    locationError,
    retryCount,
    lastCoordinate,
    gpsAccuracy,
    isLoadingAddress,
    streetAddress,
    fetchStreetAddress,
  };
};

const MapContent: FC = () => {
  const [simulationEnabled, setSimulationEnabled] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState(new Date());

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  const {
    gpsAccuracy,
    isLoadingAddress,
    lastCoordinate,
    locationError,
    streetAddress,
    userLocation,
    fetchStreetAddress,
  } = useLocation();

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-950/30 dark:to-gray-900">
      <h1 className="sr-only">Ganjil Genap Map Status</h1>

      {/* Map Content */}
      <article className="flex-1 relative">
        <section className="absolute inset-0" aria-label="Map View">
          {userLocation ? (
            <figure className="h-full">
              <PreviewMap center={userLocation} />
              <figcaption className="sr-only">
                Interactive map showing current location
              </figcaption>
            </figure>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-600 dark:text-gray-400">Memuat peta...</p>
            </div>
          )}
        </section>

        <MapFloatingInfoCard
          currentTime={currentTime}
          lastCoordinate={lastCoordinate}
          onFetchStreetAddress={fetchStreetAddress}
          isLoadingAddress={isLoadingAddress}
          userLocation={userLocation}
          streetAddress={streetAddress}
          gpsAccuracy={gpsAccuracy}
          locationError={locationError}
        />
      </article>

      {/* Add simulation controls before AdSense Footer */}
      <div className="absolute bottom-24 left-2 right-2 md:right-auto md:left-4 md:w-[400px] bg-background/95 backdrop-blur p-4 rounded-lg border border-border dark:border-gray-800 shadow-lg space-y-4">
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
      </div>

      {/* AdSense Footer */}
      <AdSensePlaceholder />
    </div>
  );
};

const MapPage: FC = () => {
  return (
    <Suspense fallback={<MapLoadingScreen />}>
      <MapContent />
    </Suspense>
  );
};

export default MapPage;
