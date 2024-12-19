'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import PreviewMap from '@/components/PreviewMap';
import AdSensePlaceholder from '@/components/AdSensePlaceholder';

// Constants
const DEFAULT_LOCATION: [number, number] = [-6.2088, 106.8456]; // Jakarta coordinates
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000,
};
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export default function MapPage() {
  const searchParams = useSearchParams();
  const plateType = searchParams.get('plate');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [userHeading, setUserHeading] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

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

  const getLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocationError('Geolokasi tidak didukung oleh browser Anda.');
      setUserLocation(DEFAULT_LOCATION);
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            reject,
            GEOLOCATION_OPTIONS,
          );
        },
      );

      setUserLocation([position.coords.latitude, position.coords.longitude]);
      setUserHeading(position.coords.heading);
      setLocationError(null);
      setRetryCount(0);
    } catch (error) {
      if (error instanceof GeolocationPositionError) {
        handleLocationError(error);

        // Retry logic
        if (
          retryCount < MAX_RETRIES &&
          error.code !== error.PERMISSION_DENIED
        ) {
          setRetryCount((prev) => prev + 1);
          setTimeout(() => getLocation(), RETRY_DELAY);
        } else {
          setUserLocation(DEFAULT_LOCATION);
        }
      }
    }
  }, [handleLocationError, retryCount]);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Lokasi Anda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center">
            Jenis Plat: {plateType === 'even' ? 'Genap' : 'Ganjil'}
          </p>
          {locationError && (
            <p className="text-destructive text-center mt-2 text-sm">
              {locationError}
            </p>
          )}
          {userLocation === DEFAULT_LOCATION && (
            <p className="text-muted-foreground text-center mt-2 text-sm">
              Menggunakan lokasi default: Jakarta
            </p>
          )}
        </CardContent>
      </Card>

      <div className="h-[calc(100vh-300px)] w-full">
        {userLocation ? (
          <PreviewMap center={userLocation} heading={userHeading ?? 0} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p>Memuat peta...</p>
          </div>
        )}
      </div>

      <AdSensePlaceholder className="mt-8" />
    </div>
  );
}
