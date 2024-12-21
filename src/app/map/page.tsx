'use client';

import { useCallback, useEffect, useState, type FC, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PreviewMap from '@/components/PreviewMap';
import AdSensePlaceholder from '@/components/AdSensePlaceholder';
import {
  MapPin,
  AlertCircle,
  AlertTriangle,
  Navigation,
  Clock,
  Share,
  Info,
  RefreshCw,
} from 'lucide-react';

// Constants
const DEFAULT_LOCATION: [number, number] = [-6.2088, 106.8456]; // Jakarta coordinates
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
};
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;
const LOCATION_THRESHOLD = 0.00025; // Approximately 25 meters

// Policy time ranges in minutes from midnight
const POLICY_TIMES = {
  morning: { start: 6 * 60, end: 10 * 60 },
  evening: { start: 16 * 60, end: 21 * 60 },
} as const;

type PolicyStatus = {
  hours: number;
  minutes: number;
  nextPeriod: string;
};

const MapPage: FC = () => {
  const searchParams = useSearchParams();
  const plateType = searchParams.get('plate');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [streetAddress, setStreetAddress] =
    useState<string>('Mencari alamat...');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const lastLocation = useRef<[number, number] | null>(null);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Calculate time until next policy change
  const getTimeUntilNextChange = useCallback((): PolicyStatus => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinute;

    let minutesUntilChange: number;
    let nextPeriod = '';

    if (currentTimeInMinutes < POLICY_TIMES.morning.start) {
      minutesUntilChange = POLICY_TIMES.morning.start - currentTimeInMinutes;
      nextPeriod = 'mulai';
    } else if (currentTimeInMinutes < POLICY_TIMES.morning.end) {
      minutesUntilChange = POLICY_TIMES.morning.end - currentTimeInMinutes;
      nextPeriod = 'selesai';
    } else if (currentTimeInMinutes < POLICY_TIMES.evening.start) {
      minutesUntilChange = POLICY_TIMES.evening.start - currentTimeInMinutes;
      nextPeriod = 'mulai';
    } else if (currentTimeInMinutes < POLICY_TIMES.evening.end) {
      minutesUntilChange = POLICY_TIMES.evening.end - currentTimeInMinutes;
      nextPeriod = 'selesai';
    } else {
      minutesUntilChange =
        24 * 60 - currentTimeInMinutes + POLICY_TIMES.morning.start;
      nextPeriod = 'mulai';
    }

    const hours = Math.floor(minutesUntilChange / 60);
    const minutes = minutesUntilChange % 60;

    return { hours, minutes, nextPeriod };
  }, [currentTime]);

  const checkPolicyActive = useCallback((date: Date): boolean => {
    const currentHour = date.getHours();
    const isWeekday = date.getDay() >= 1 && date.getDay() <= 5;

    const morningActive =
      currentHour >= POLICY_TIMES.morning.start / 60 &&
      currentHour < POLICY_TIMES.morning.end / 60;
    const eveningActive =
      currentHour >= POLICY_TIMES.evening.start / 60 &&
      currentHour < POLICY_TIMES.evening.end / 60;

    return isWeekday && (morningActive || eveningActive);
  }, []);

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
      if (!lastLocation.current) return true;

      const [oldLat, oldLng] = lastLocation.current;
      const [newLat, newLng] = newLoc;

      return (
        Math.abs(oldLat - newLat) > LOCATION_THRESHOLD ||
        Math.abs(oldLng - newLng) > LOCATION_THRESHOLD
      );
    },
    [],
  );

  // Update reverse geocoding function to use maptiles proxy API
  const updateStreetAddress = useCallback(async (lat: number, lng: number) => {
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

  // Update the refresh button click handler
  const handleRefresh = useCallback(() => {
    if (lastLocation.current) {
      updateStreetAddress(lastLocation.current[0], lastLocation.current[1]);
    }
  }, [updateStreetAddress]);

  // Initialize location tracking
  useEffect(() => {
    let mounted = true;
    let watchId: number | undefined;
    let timeoutId: NodeJS.Timeout | undefined;

    const startLocationWatch = () => {
      if (!mounted || !navigator.geolocation) {
        setLocationError('Geolokasi tidak didukung oleh browser Anda.');
        setUserLocation(DEFAULT_LOCATION);
        return;
      }

      try {
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (!mounted) return;

            const newLocation: [number, number] = [
              position.coords.latitude,
              position.coords.longitude,
            ];

            if (hasLocationChangedSignificantly(newLocation)) {
              setUserLocation(newLocation);
              lastLocation.current = newLocation;
              updateStreetAddress(newLocation[0], newLocation[1]);
            }

            setUserHeading(position.coords.heading);
            setLocationError(null);
            setRetryCount(0);
          },
          (error) => {
            if (!mounted) return;

            handleLocationError(error);
            if (
              retryCount < MAX_RETRIES &&
              error.code !== error.PERMISSION_DENIED
            ) {
              setRetryCount((prev) => prev + 1);
              timeoutId = setTimeout(startLocationWatch, RETRY_DELAY);
            } else {
              setUserLocation(DEFAULT_LOCATION);
              lastLocation.current = DEFAULT_LOCATION;
              updateStreetAddress(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
            }
          },
          GEOLOCATION_OPTIONS,
        );
      } catch (error) {
        if (!mounted) return;

        if (error instanceof GeolocationPositionError) {
          handleLocationError(error);
          setUserLocation(DEFAULT_LOCATION);
          lastLocation.current = DEFAULT_LOCATION;
          updateStreetAddress(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
        }
      }
    };

    startLocationWatch();

    return () => {
      mounted = false;
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [
    hasLocationChangedSignificantly,
    handleLocationError,
    retryCount,
    updateStreetAddress,
  ]);

  const { hours, minutes, nextPeriod } = getTimeUntilNextChange();
  const policyActive = checkPolicyActive(currentTime);

  return (
    <div className="min-h-screen flex flex-col gap-4">
      <section className="h-screen w-full">
        {userLocation ? (
          <PreviewMap center={userLocation} heading={userHeading ?? 0} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Memuat peta...</p>
          </div>
        )}
      </section>

      <div className="p-4 absolute top-0 left-0 w-full max-w-md">
        <Card className="bg-white/95 backdrop-blur shadow-lg border-0">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full ${
                    plateType === 'even'
                      ? 'bg-blue-100 text-blue-700 border border-blue-200'
                      : 'bg-green-100 text-green-700 border border-green-200'
                  }`}
                >
                  <span className="font-semibold">
                    Plat {plateType === 'even' ? 'Genap' : 'Ganjil'}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    policyActive
                      ? 'bg-orange-100 text-orange-700 border border-orange-200'
                      : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  {policyActive ? 'Sedang Berlaku' : 'Tidak Berlaku'}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-200"
                onClick={handleRefresh}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Perbarui
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Location Information */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm text-blue-700 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Lokasi Anda
              </h3>
              {locationError ? (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500" />
                  <p className="text-sm text-red-700">{locationError}</p>
                </div>
              ) : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2 bg-white p-3 rounded-lg border border-blue-100">
                    {userLocation === DEFAULT_LOCATION ? (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Navigation className="w-4 h-4 text-blue-500 animate-pulse" />
                    )}
                    <p className="text-sm font-medium">
                      {isLoadingAddress ? (
                        <span className="animate-pulse">Mencari alamat...</span>
                      ) : (
                        streetAddress
                      )}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground px-1">
                    {userLocation === DEFAULT_LOCATION
                      ? 'Menggunakan lokasi default: Jakarta'
                      : 'GPS Aktif - Mengikuti Lokasi Anda'}
                  </p>
                </div>
              )}
            </div>

            {/* Next Change Timer */}
            <div className="bg-white p-3 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-sm font-medium">Perubahan Status</span>
                </div>
                <div className="text-sm font-semibold text-blue-700">
                  {hours}j {minutes}m
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {nextPeriod === 'mulai'
                  ? 'Hingga mulai berlaku'
                  : 'Hingga selesai berlaku'}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                size="sm"
              >
                <Share className="w-4 h-4 mr-2" />
                Bagikan
              </Button>
              <Button
                variant="outline"
                className="flex-1 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200"
                size="sm"
              >
                <Info className="w-4 h-4 mr-2" />
                Info
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <footer className="absolute bottom-0 left-0 w-full">
        <AdSensePlaceholder />
      </footer>
    </div>
  );
};

export default MapPage;
