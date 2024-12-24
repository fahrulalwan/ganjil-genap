'use client';

import {
  useCallback,
  useEffect,
  useState,
  type FC,
  useRef,
  useMemo,
  Suspense,
} from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import PreviewMap from '@/components/PreviewMap';
import AdSensePlaceholder from '@/components/AdSensePlaceholder';
import {
  AlertCircle,
  AlertTriangle,
  Navigation,
  Info,
  RefreshCw,
  Signal,
  AlertOctagon,
  CircleCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Constants
const DEFAULT_LOCATION: [number, number] = [-6.2088, 106.8456]; // Jakarta coordinates
const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 10000,
};
const MAX_RETRIES = 5;
const RETRY_DELAY = 1000;
const LOCATION_THRESHOLD = 0.00025; // Approximately 25 meters
const TIME_THRESHOLD = 60; // minutes
const FALLBACK_TIMEOUT = 30000; // 30 seconds timeout for fallback mechanism
const PERIODIC_REFRESH = 300000; // Refresh location every 5 minutes
const UPDATE_DEBOUNCE = 100; // 100ms debounce for location updates

const TIME_PERIODS = {
  MORNING: {
    label: 'Pagi',
    time: '06:00 - 10:00',
    start: 6 * 60,
    end: 10 * 60,
    color: 'bg-amber-500',
  },
  EVENING: {
    label: 'Sore',
    time: '16:00 - 21:00',
    start: 16 * 60,
    end: 21 * 60,
    color: 'bg-blue-500',
  },
} as const;

// Types
type PlateType = 'odd' | 'even';

interface PolicyStatus {
  hours: number;
  minutes: number;
  nextPeriod: 'mulai' | 'selesai';
}

const LoadingScreen: FC = () => {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-white/95 dark:bg-gray-950/95 backdrop-blur-sm">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative w-20 h-20">
          {/* Static ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-blue-600/20 dark:border-blue-500/20" />
          {/* Spinning gradient ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-transparent dark:border-transparent [background:linear-gradient(white,white)_padding-box,linear-gradient(to_top,#2563eb_50%,transparent_0)_border-box] dark:[background:linear-gradient(#030712,#030712)_padding-box,linear-gradient(to_top,#3b82f6_50%,transparent_0)_border-box] animate-spin" />
          {/* Navigation icon */}
          <Navigation className="absolute inset-0 m-auto w-8 h-8 text-blue-600 dark:text-blue-500 animate-pulse" />
        </div>
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
            Memuat Peta
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Mohon tunggu sebentar...
          </p>
        </div>
      </div>
    </div>
  );
};

const MapContent: FC = () => {
  const searchParams = useSearchParams();
  const plateType = searchParams.get('plate') as PlateType;
  const [simulationEnabled, setSimulationEnabled] = useState(false);
  const [simulatedTime, setSimulatedTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null,
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [streetAddress, setStreetAddress] = useState<string>('Inisialisasi...');
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);
  const lastLocation = useRef<[number, number] | null>(null);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
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
  const handleTimeChange = (hours: number, minutes: number, dayOffset = 0) => {
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

  const simulationControls = (
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
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Morning Policy (06:00-10:00)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => handleTimeChange(8, 0)}>
                During (8:00)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(9, 45)}>
                Ending Soon (9:45)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(5, 15)}>
                Starting Soon (5:15)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(4, 0)}>
                Before (4:00)
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Between Policies
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => handleTimeChange(10, 15)}>
                After Morning (10:15)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(12, 0)}>
                Midday (12:00)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(14, 0)}>
                Before Evening (14:00)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(11, 30)}>
                Late Morning (11:30)
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Evening Policy (16:00-21:00)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => handleTimeChange(17, 0)}>
                During (17:00)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(20, 45)}>
                Ending Soon (20:45)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(15, 15)}>
                Starting Soon (15:15)
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(22, 0)}>
                After (22:00)
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground mb-1">
              Weekend (No Policy)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button size="sm" onClick={() => handleTimeChange(8, 0, 6)}>
                Saturday 8:00
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(17, 0, 6)}>
                Saturday 17:00
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(8, 0, 7)}>
                Sunday 8:00
              </Button>
              <Button size="sm" onClick={() => handleTimeChange(17, 0, 7)}>
                Sunday 17:00
              </Button>
            </div>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            Current Time:{' '}
            {currentTime.toLocaleDateString('id-ID', { weekday: 'long' })}{' '}
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );

  // Memoize plate type validation
  const isValidPlateType = useMemo(
    () => plateType && ['odd', 'even'].includes(plateType),
    [plateType],
  );

  // Memoize current time in minutes for calculations
  const currentTimeInMinutes = useMemo(() => {
    const hour = currentTime.getHours();
    const minute = currentTime.getMinutes();
    return hour * 60 + minute;
  }, [currentTime]);

  // Memoize policy active check
  const policyActive = useMemo(() => {
    const currentHour = currentTime.getHours();
    const isWeekday = currentTime.getDay() >= 1 && currentTime.getDay() <= 5;

    const morningActive =
      currentHour >= TIME_PERIODS.MORNING.start / 60 &&
      currentHour < TIME_PERIODS.MORNING.end / 60;
    const eveningActive =
      currentHour >= TIME_PERIODS.EVENING.start / 60 &&
      currentHour < TIME_PERIODS.EVENING.end / 60;

    return isWeekday && (morningActive || eveningActive);
  }, [currentTime]);

  // Memoize time until next change calculation
  const timeUntilChange = useMemo((): PolicyStatus => {
    let minutesUntilChange: number;
    let nextPeriod: 'mulai' | 'selesai' = 'mulai';

    if (currentTimeInMinutes < TIME_PERIODS.MORNING.start) {
      minutesUntilChange = TIME_PERIODS.MORNING.start - currentTimeInMinutes;
      nextPeriod = 'mulai';
    } else if (currentTimeInMinutes < TIME_PERIODS.MORNING.end) {
      minutesUntilChange = TIME_PERIODS.MORNING.end - currentTimeInMinutes;
      nextPeriod = 'selesai';
    } else if (currentTimeInMinutes < TIME_PERIODS.EVENING.start) {
      minutesUntilChange = TIME_PERIODS.EVENING.start - currentTimeInMinutes;
      nextPeriod = 'mulai';
    } else if (currentTimeInMinutes < TIME_PERIODS.EVENING.end) {
      minutesUntilChange = TIME_PERIODS.EVENING.end - currentTimeInMinutes;
      nextPeriod = 'selesai';
    } else {
      minutesUntilChange =
        24 * 60 - currentTimeInMinutes + TIME_PERIODS.MORNING.start;
      nextPeriod = 'mulai';
    }

    const hours = Math.floor(minutesUntilChange / 60);
    const minutes = minutesUntilChange % 60;

    return { hours, minutes, nextPeriod };
  }, [currentTimeInMinutes]);

  // Memoize time progress calculation
  const timeProgress = useMemo((): number => {
    if (currentTimeInMinutes < TIME_PERIODS.MORNING.start) {
      const totalMinutes =
        TIME_PERIODS.MORNING.start + (24 * 60 - TIME_PERIODS.EVENING.end);
      const elapsedMinutes =
        currentTimeInMinutes + (24 * 60 - TIME_PERIODS.EVENING.end);
      return (elapsedMinutes / totalMinutes) * 100;
    }

    if (currentTimeInMinutes < TIME_PERIODS.MORNING.end) {
      const totalMinutes =
        TIME_PERIODS.MORNING.end - TIME_PERIODS.MORNING.start;
      const elapsedMinutes = currentTimeInMinutes - TIME_PERIODS.MORNING.start;
      return (elapsedMinutes / totalMinutes) * 100;
    }

    if (currentTimeInMinutes < TIME_PERIODS.EVENING.start) {
      const totalMinutes =
        TIME_PERIODS.EVENING.start - TIME_PERIODS.MORNING.end;
      const elapsedMinutes = currentTimeInMinutes - TIME_PERIODS.MORNING.end;
      return (elapsedMinutes / totalMinutes) * 100;
    }

    if (currentTimeInMinutes < TIME_PERIODS.EVENING.end) {
      const totalMinutes =
        TIME_PERIODS.EVENING.end - TIME_PERIODS.EVENING.start;
      const elapsedMinutes = currentTimeInMinutes - TIME_PERIODS.EVENING.start;
      return (elapsedMinutes / totalMinutes) * 100;
    }

    const totalMinutes =
      TIME_PERIODS.MORNING.start + (24 * 60 - TIME_PERIODS.EVENING.end);
    const elapsedMinutes = currentTimeInMinutes - TIME_PERIODS.EVENING.end;
    return (elapsedMinutes / totalMinutes) * 100;
  }, [currentTimeInMinutes]);

  // Memoize current period
  const currentPeriod = useMemo(() => {
    const hour = currentTime.getHours();
    return hour < 10 ? TIME_PERIODS.MORNING : TIME_PERIODS.EVENING;
  }, [currentTime]);

  // Memoize status info calculation
  const statusInfo = useMemo(() => {
    // Invalid plate type check
    if (!isValidPlateType) {
      return {
        icon: <AlertOctagon className="w-4 h-4" />,
        message: 'Tipe plat tidak valid',
        type: 'error' as const,
      };
    }

    // Weekend check
    const isWeekend = [0, 6].includes(currentTime.getDay());
    if (isWeekend) {
      return {
        icon: <CircleCheck className="w-4 h-4" />,
        message: 'Bebas melintas',
        subMessage: 'Akhir pekan',
        type: 'success' as const,
      };
    }

    const isDayEven = currentTime.getDate() % 2 === 0;

    const isPlateAllowed = isDayEven
      ? plateType === 'even'
      : plateType === 'odd';

    // Active policy period
    if (policyActive) {
      // Policy ending soon
      if (
        timeUntilChange.hours === 0 &&
        timeUntilChange.minutes <= TIME_THRESHOLD
      ) {
        return {
          icon: isPlateAllowed ? (
            <CircleCheck className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          ),
          message: isPlateAllowed ? 'Bebas melintas' : 'Dilarang melintas',
          subMessage: `${timeUntilChange.minutes}m menuju periode bebas`,
          type: isPlateAllowed ? ('success' as const) : ('error' as const),
        };
      }

      // During active policy
      return {
        icon: isPlateAllowed ? (
          <CircleCheck className="w-4 h-4" />
        ) : (
          <AlertTriangle className="w-4 h-4" />
        ),
        message: isPlateAllowed ? 'Bebas melintas' : 'Dilarang melintas',
        subMessage: isPlateAllowed
          ? `Sesuai aturan plat ${plateType === 'even' ? 'genap' : 'ganjil'}`
          : 'Gunakan rute alternatif',
        type: isPlateAllowed ? ('success' as const) : ('error' as const),
      };
    }

    // Policy starting soon
    if (
      timeUntilChange.nextPeriod === 'mulai' &&
      timeUntilChange.hours === 0 &&
      timeUntilChange.minutes <= TIME_THRESHOLD
    ) {
      return {
        icon: isPlateAllowed ? (
          <CircleCheck className="w-4 h-4" />
        ) : (
          <AlertTriangle className="w-4 h-4" />
        ),
        message: 'Bebas melintas',
        subMessage: isPlateAllowed
          ? `Pembatasan plat ${plateType === 'even' ? 'ganjil' : 'genap'} dalam ${timeUntilChange.minutes}m`
          : `${timeUntilChange.minutes}m menuju pembatasan`,
        type: isPlateAllowed ? ('success' as const) : ('warning' as const),
      };
    }

    // Outside policy hours
    return {
      icon: <CircleCheck className="w-4 h-4" />,
      message: 'Bebas melintas',
      type: 'success' as const,
    };
  }, [isValidPlateType, currentTime, policyActive, timeUntilChange, plateType]);

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
          lastLocation.current = newLocation;
          updateStreetAddress(newLocation[0], newLocation[1]);
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
        setUserLocation(DEFAULT_LOCATION);
        lastLocation.current = DEFAULT_LOCATION;
        updateStreetAddress(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
        return;
      }

      // Implement progressive retry with backoff
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * 1.5 ** retryCount;
        setRetryCount((prev) => prev + 1);
        retryTimeoutId = setTimeout(startLocationWatch, delay);
      } else {
        setUserLocation(DEFAULT_LOCATION);
        lastLocation.current = DEFAULT_LOCATION;
        updateStreetAddress(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
      }
    };

    const startLocationWatch = () => {
      if (!mounted || !navigator.geolocation) {
        setLocationError('Geolokasi tidak didukung oleh browser Anda.');
        setUserLocation(DEFAULT_LOCATION);
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
          if (!userLocation || userLocation === DEFAULT_LOCATION) {
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
        setUserLocation(DEFAULT_LOCATION);
        lastLocation.current = DEFAULT_LOCATION;
        updateStreetAddress(DEFAULT_LOCATION[0], DEFAULT_LOCATION[1]);
      }
    };

    startLocationWatch();

    // Cleanup function
    return () => {
      mounted = false;
      if (watchId !== undefined) {
        navigator.geolocation.clearWatch(watchId);
      }
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
    updateStreetAddress,
    userLocation,
  ]);

  // Use destructured values from timeUntilChange
  const { hours, minutes, nextPeriod } = timeUntilChange;

  if (isLoading) {
    return <LoadingScreen />;
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

        {/* Floating Info Card */}
        <aside
          className="absolute top-2 left-2 right-2 md:right-auto md:left-4 md:top-4 md:w-[400px]"
          aria-label="Status Information"
        >
          <Card className="bg-background/95 backdrop-blur border-border dark:border-gray-800 shadow-lg">
            <CardContent className="p-2 space-y-2 md:p-4 md:space-y-4">
              {/* Status Row */}
              <div className="flex flex-col gap-1 md:gap-2">
                <nav
                  className="flex items-center gap-1.5"
                  aria-label="Quick Actions"
                >
                  <Badge
                    variant="secondary"
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-sm text-white font-medium',
                      'bg-neutral-900 hover:bg-neutral-900 dark:bg-neutral-800 dark:hover:bg-neutral-800',
                    )}
                  >
                    Plat {plateType === 'even' ? 'Genap' : 'Ganjil'}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={cn(
                      'rounded-full px-2.5 py-0.5 text-sm',
                      'bg-neutral-100 hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-800 dark:text-neutral-100',
                    )}
                  >
                    Tgl {currentTime.getDate()}{' '}
                    <span
                      className={cn(
                        'ml-1',
                        (currentTime.getDate() % 2 === 0 &&
                          plateType === 'even') ||
                          (currentTime.getDate() % 2 !== 0 &&
                            plateType === 'odd')
                          ? 'text-emerald-600 dark:text-emerald-500'
                          : 'text-red-600 dark:text-red-500',
                      )}
                    >
                      • {currentTime.getDate() % 2 === 0 ? 'Genap' : 'Ganjil'}
                    </span>
                  </Badge>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 w-6 p-0 md:h-8 md:w-8 ml-auto border-border dark:border-gray-800"
                      >
                        <Info className="w-3 h-3 md:w-4 md:h-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto bg-background text-foreground border-border dark:border-gray-800">
                      <SheetHeader>
                        <SheetTitle className="text-gray-900 dark:text-gray-100">
                          Informasi Kebijakan
                        </SheetTitle>
                        <SheetDescription className="text-gray-600 dark:text-gray-400">
                          Detail pemberlakuan ganjil genap di lokasi Anda
                        </SheetDescription>
                      </SheetHeader>
                      <div className="mt-6 space-y-6">
                        {/* Time Periods */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                            Waktu Berlaku
                          </h4>
                          <div className="grid gap-4">
                            <div className="bg-muted p-3 rounded-lg space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  Pagi
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                06:00 - 10:00
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Senin - Jumat (Hari Kerja)
                              </div>
                            </div>
                            <div className="bg-muted p-3 rounded-lg space-y-2">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500" />
                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                  Sore
                                </span>
                              </div>
                              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                16:00 - 21:00
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                Senin - Jumat (Hari Kerja)
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Important Notes */}
                        <div className="space-y-4">
                          <h4 className="text-sm font-semibold">
                            Catatan Penting
                          </h4>
                          <div className="space-y-3">
                            <div className="flex items-start gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                              <span>
                                Pelanggaran dikenakan denda maksimal Rp500.000
                                sesuai Peraturan Gubernur DKI Jakarta
                              </span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                              <span>
                                Pengawasan dilakukan melalui:
                                <ul className="mt-1 ml-4 space-y-1">
                                  <li>• Petugas Kepolisian di lapangan</li>
                                  <li>• Tilang elektronik (ETLE)</li>
                                  <li>• Kamera pengawas di persimpangan</li>
                                </ul>
                              </span>
                            </div>
                            <div className="flex items-start gap-2 text-sm">
                              <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                              <span>
                                Kebijakan tidak berlaku pada hari libur nasional
                                dan akhir pekan
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </nav>

                {/* Status Messages */}
                <output aria-label="Current Status">
                  {(() => {
                    const status = statusInfo;
                    return (
                      <div
                        className={cn(
                          'flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg md:gap-2 md:px-3 md:py-2',
                          {
                            'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400':
                              status.type === 'success',
                            'bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400':
                              status.type === 'warning',
                            'bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400':
                              status.type === 'error',
                          },
                        )}
                      >
                        <div className="shrink-0 mt-0.5">{status.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={cn(
                              'text-sm font-medium leading-none md:text-base md:leading-none',
                              'py-[.2rem] md:py-0.5',
                            )}
                          >
                            {status.message}
                          </div>
                          {status.subMessage && (
                            <div className="text-[10px] mt-1 opacity-90 md:text-xs">
                              {status.subMessage}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </output>
              </div>

              {/* Location Row */}
              <section aria-label="Location Information">
                <HoverCard>
                  <HoverCardTrigger asChild>
                    <div className="flex items-center gap-1.5 p-1.5 bg-muted/50 rounded-lg cursor-pointer md:gap-2 md:p-2">
                      <Navigation
                        className={cn(
                          'w-3.5 h-3.5 shrink-0 md:w-4 md:h-4',
                          isLoadingAddress
                            ? 'text-muted-foreground animate-pulse'
                            : 'text-blue-600 dark:text-blue-400',
                          userLocation === DEFAULT_LOCATION && 'text-amber-500',
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="truncate text-xs md:text-sm text-gray-900 dark:text-gray-100">
                          {isLoadingAddress ? (
                            <span className="text-muted-foreground">
                              Mencari alamat...
                            </span>
                          ) : (
                            streetAddress
                          )}
                        </div>
                        {gpsAccuracy !== null && !locationError && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <Signal
                              className={cn(
                                'w-2.5 h-2.5 md:w-3 md:h-3',
                                gpsAccuracy <= 10
                                  ? 'text-green-500 dark:text-green-400'
                                  : gpsAccuracy <= 30
                                    ? 'text-blue-500 dark:text-blue-400'
                                    : gpsAccuracy <= 50
                                      ? 'text-yellow-500 dark:text-yellow-400'
                                      : 'text-red-500 dark:text-red-400',
                              )}
                            />
                            <span className="text-[10px] text-muted-foreground md:text-xs">
                              Akurasi ±{Math.round(gpsAccuracy)}m
                            </span>
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleRefresh}
                        className="h-6 w-6 p-0 md:h-8 md:w-8"
                      >
                        <RefreshCw
                          className={cn(
                            'w-3 h-3 md:w-4 md:h-4',
                            isLoadingAddress && 'animate-spin',
                          )}
                        />
                      </Button>
                    </div>
                  </HoverCardTrigger>
                  <HoverCardContent className="bg-background text-foreground border-border dark:border-gray-800">
                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          Detail Lokasi
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {locationError || (
                            <>
                              GPS{' '}
                              {gpsAccuracy ? (
                                <>
                                  aktif dengan akurasi{' '}
                                  <span
                                    className={cn(
                                      'font-medium',
                                      gpsAccuracy <= 10
                                        ? 'text-green-500 dark:text-green-400'
                                        : gpsAccuracy <= 30
                                          ? 'text-blue-500 dark:text-blue-400'
                                          : gpsAccuracy <= 50
                                            ? 'text-yellow-500 dark:text-yellow-400'
                                            : 'text-red-500 dark:text-red-400',
                                    )}
                                  >
                                    ±{Math.round(gpsAccuracy)}m
                                  </span>
                                </>
                              ) : (
                                'aktif dan berfungsi dengan baik'
                              )}
                            </>
                          )}
                        </p>
                        {userLocation && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Koordinat: {userLocation[0].toFixed(6)},{' '}
                            {userLocation[1].toFixed(6)}
                          </div>
                        )}
                      </div>

                      {/* Accuracy Index - Better organized */}
                      <div className="border-t pt-2">
                        <h5 className="text-xs font-medium mb-2">
                          Indeks Akurasi GPS
                        </h5>
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Signal className="w-3 h-3 text-green-500" />
                              <span className="text-xs">Sangat Baik</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              ≤10m
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Signal className="w-3 h-3 text-blue-500" />
                              <span className="text-xs">Baik</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              11-30m
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Signal className="w-3 h-3 text-yellow-500" />
                              <span className="text-xs">Cukup</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              31-50m
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <Signal className="w-3 h-3 text-red-500" />
                              <span className="text-xs">Kurang Baik</span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {'>'}50m
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </section>

              {/* Time Status */}
              <section aria-label="Time Status">
                <div className="flex flex-col bg-muted/50 rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-1.5 md:p-2">
                    <div className="flex items-center gap-1.5">
                      <time
                        dateTime={currentPeriod.time}
                        className="flex items-center gap-1"
                      >
                        <div
                          className={cn(
                            'w-1.5 h-1.5 rounded-full',
                            currentPeriod.color,
                          )}
                        />
                        <span className="text-xs font-medium md:text-sm text-gray-900 dark:text-gray-100">
                          {currentPeriod.label}
                        </span>
                      </time>
                      <span className="text-xs text-gray-600 dark:text-gray-400 md:text-sm">
                        {currentPeriod.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-600 dark:text-gray-400 md:text-sm">
                        {nextPeriod === 'mulai' ? 'Mulai' : 'Selesai'}
                      </span>
                      <time
                        dateTime={`${hours}:${minutes}`}
                        className="text-xs tabular-nums font-medium md:text-sm text-gray-900 dark:text-gray-100"
                      >
                        {hours}j {minutes}m
                      </time>
                    </div>
                  </div>
                  <div className="h-0.5 md:h-1 bg-muted">
                    <div
                      className={cn(
                        'h-full transition-all duration-1000 ease-linear',
                        {
                          'bg-red-500 dark:bg-red-400': policyActive,
                          'bg-amber-500 dark:bg-amber-400':
                            !policyActive && nextPeriod === 'mulai',
                          'bg-emerald-500 dark:bg-emerald-400':
                            !policyActive && nextPeriod === 'selesai',
                        },
                      )}
                      style={{ width: `${timeProgress}%` }}
                    />
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </aside>
      </article>

      {/* Add simulation controls before AdSense Footer */}
      {simulationControls}

      {/* AdSense Footer */}
      <AdSensePlaceholder />
    </div>
  );
};

const MapPage: FC = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <MapContent />
    </Suspense>
  );
};

export default MapPage;
