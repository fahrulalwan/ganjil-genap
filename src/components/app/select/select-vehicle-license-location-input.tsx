'use client';

import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Navigation,
  Signal,
} from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  FALLBACK_TIMEOUT,
  GEOLOCATION_OPTIONS,
  MAX_RETRIES,
  PERIODIC_REFRESH,
  RETRY_DELAY,
} from '@/constants/geolocation';
import { cn } from '@/lib/utils';

interface ComponentProps {
  onPermissionChange: (permission: boolean) => void;
  locationPermission: boolean;
}

const SelectVehicleLicenseLocationInput: FC<ComponentProps> = ({
  onPermissionChange,
  locationPermission,
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const locationButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (locationError && locationButtonRef.current) {
      locationButtonRef.current.focus();
    }
  }, [locationError]);

  const handleLocationSuccess = (position: GeolocationPosition) => {
    setLocationError(null);
    setGpsAccuracy(position.coords.accuracy);
    setRetryCount(0);
    onPermissionChange(true);
  };

  const handleLocationError = (error: GeolocationPositionError) => {
    console.error('Error getting location:', error);
    let errorMessage = '';

    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage =
          'Akses lokasi ditolak. Mohon izinkan akses lokasi di pengaturan browser Anda.';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Informasi lokasi tidak tersedia.';
        break;
      case error.TIMEOUT:
        errorMessage = 'Waktu permintaan akses lokasi habis.';
        break;
      default:
        errorMessage = 'Terjadi kesalahan saat mengakses lokasi.';
    }

    setLocationError(errorMessage);

    if (error.code !== error.PERMISSION_DENIED) {
      retryLocationAccess();
    }
  };

  const retryLocationAccess = () => {
    if (!isLoading && retryCount < MAX_RETRIES) {
      const delay = RETRY_DELAY * 1.5 ** retryCount;
      setRetryCount((prev) => prev + 1);
      setTimeout(() => {
        if (!isLoading) {
          handleLocationPermission();
        }
      }, delay);
    }
  };

  const handleLocationPermission = () => {
    if (isLoading) return;

    if (!navigator.geolocation) {
      setLocationError('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }

    setIsLoading(true);
    setLocationError(null);

    try {
      navigator.geolocation.getCurrentPosition(
        handleLocationSuccess,
        (error) => {
          console.warn('Initial position error:', error);
        },
        GEOLOCATION_OPTIONS,
      );

      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          handleLocationSuccess(position);
          setIsLoading(false);
        },
        (error) => {
          handleLocationError(error);
          setIsLoading(false);
        },
        GEOLOCATION_OPTIONS,
      );

      const fallbackTimeoutId = setTimeout(() => {
        if (!locationPermission) {
          console.warn('Location watch fallback triggered');
          navigator.geolocation.getCurrentPosition(
            (position) => {
              handleLocationSuccess(position);
              setIsLoading(false);
            },
            (error) => {
              handleLocationError(error);
              setIsLoading(false);
            },
            {
              enableHighAccuracy: false,
              timeout: 10000,
              maximumAge: 30000,
            },
          );
        }
      }, FALLBACK_TIMEOUT);

      const periodicRefreshId = setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          handleLocationSuccess,
          (error) => {
            console.warn('Periodic refresh error:', error);
          },
          GEOLOCATION_OPTIONS,
        );
      }, PERIODIC_REFRESH);

      return () => {
        navigator.geolocation.clearWatch(watchId);
        clearTimeout(fallbackTimeoutId);
        clearInterval(periodicRefreshId);
      };
    } catch (error) {
      console.error('Geolocation error:', error);
      if (error instanceof GeolocationPositionError) {
        handleLocationError(error);
      } else {
        setLocationError('Terjadi kesalahan yang tidak diketahui.');
      }
      setIsLoading(false);
    }
  };

  const getContainerClass = () => {
    if (locationError) {
      return 'border-destructive/50 bg-destructive/5';
    }
    if (locationPermission) {
      return 'border-emerald-500/20 bg-emerald-50/50 dark:border-emerald-500/30 dark:bg-emerald-500/5';
    }
    return 'border-border bg-muted/50';
  };

  const getGpsSignalClass = (accuracy: number) => {
    if (accuracy <= 10) return 'text-green-500';
    if (accuracy <= 30) return 'text-blue-500';
    if (accuracy <= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getSignalQualityClass = (accuracy: number) => {
    if (accuracy <= 10) return 'text-green-600 dark:text-green-400';
    if (accuracy <= 30) return 'text-blue-600 dark:text-blue-400';
    if (accuracy <= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getSignalQualityText = (accuracy: number) => {
    if (accuracy <= 10) return 'Sangat Baik';
    if (accuracy <= 30) return 'Baik';
    if (accuracy <= 50) return 'Cukup';
    return 'Kurang Baik';
  };

  const renderContent = () => {
    if (locationError) {
      return (
        <>
          <div className="flex items-start gap-3" role="alert">
            <AlertCircle
              className="w-5 h-5 text-destructive mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <div className="space-y-1">
              <p className="font-medium text-sm text-destructive">
                {locationError}
              </p>
              <p className="text-xs text-destructive/80">
                Coba aktifkan ulang atau periksa pengaturan lokasi di perangkat
                Anda
              </p>
            </div>
          </div>
          <Button
            ref={locationButtonRef}
            variant="destructive"
            size="sm"
            className="mt-3 w-full"
            onClick={handleLocationPermission}
            disabled={isLoading}
            aria-label={
              isLoading
                ? 'Sedang mencoba ulang...'
                : 'Coba aktifkan ulang akses lokasi'
            }
          >
            {isLoading ? (
              <>
                <Loader2
                  className="w-4 h-4 mr-2 animate-spin"
                  aria-hidden="true"
                />
                <span>Mencoba Ulang...</span>
              </>
            ) : (
              'Coba Lagi'
            )}
          </Button>
        </>
      );
    }

    if (locationPermission) {
      return (
        <>
          <div className="flex items-start gap-3">
            <CheckCircle2
              className="w-5 h-5 text-emerald-500 mt-0.5 shrink-0"
              aria-hidden="true"
            />
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium text-sm text-emerald-700 dark:text-emerald-400">
                  Akses lokasi aktif
                </p>
                {gpsAccuracy && (
                  <output
                    className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-background/80 dark:bg-background/50 border border-border"
                    aria-label={`Akurasi GPS: ${Math.round(gpsAccuracy)} meter`}
                  >
                    <Signal
                      className={cn(
                        'w-3.5 h-3.5',
                        getGpsSignalClass(gpsAccuracy),
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-xs font-medium text-foreground/80">
                      ±{Math.round(gpsAccuracy)}m
                    </span>
                  </output>
                )}
              </div>
              {gpsAccuracy && (
                <p className="text-xs text-emerald-600/90 dark:text-emerald-400/90 flex items-center gap-1.5">
                  Kualitas Sinyal:{' '}
                  <span
                    className={cn(
                      'font-medium',
                      getSignalQualityClass(gpsAccuracy),
                    )}
                  >
                    {getSignalQualityText(gpsAccuracy)}
                  </span>
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 mt-3">
            <div className="text-xs text-muted-foreground">
              <span className="block font-medium text-foreground/90">
                Mode GPS
              </span>
              {GEOLOCATION_OPTIONS.enableHighAccuracy
                ? 'Akurasi Tinggi'
                : 'Normal'}
            </div>
            <div className="text-xs text-muted-foreground">
              <span className="block font-medium text-foreground/90">
                Pembaruan
              </span>
              Setiap {GEOLOCATION_OPTIONS.maximumAge / 1000} detik
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <div className="flex items-start gap-3">
          <div className="space-y-1">
            <p className="font-medium text-sm">Izinkan akses lokasi</p>
            <p className="text-xs text-muted-foreground">
              Diperlukan untuk menampilkan peta dan navigasi yang akurat
            </p>
          </div>
        </div>
        <Button
          ref={locationButtonRef}
          variant="outline"
          className="mx-auto flex items-center gap-2 bg-background/80 px-4 min-w-[200px] mt-3"
          onClick={handleLocationPermission}
          disabled={isLoading}
          aria-label={
            isLoading ? 'Sedang meminta akses...' : 'Aktifkan akses lokasi'
          }
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
              <span>Meminta Akses...</span>
            </>
          ) : (
            <>
              <Navigation className="w-4 h-4" aria-hidden="true" />
              <span>Aktifkan Akses Lokasi</span>
            </>
          )}
        </Button>
      </>
    );
  };

  return (
    <section aria-label="Status Akses Lokasi">
      <div className="flex items-center gap-2">
        <Navigation className="w-4 h-4 text-blue-600" aria-hidden="true" />
        <span className="font-medium">Akses Lokasi</span>
      </div>

      <div
        className={cn(
          'rounded-lg border transition-all duration-300 p-4 mt-3',
          getContainerClass(),
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {renderContent()}
      </div>
    </section>
  );
};

export default SelectVehicleLicenseLocationInput;
