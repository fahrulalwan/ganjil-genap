import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card';
import {
  AlertOctagon,
  AlertTriangle,
  CircleCheck,
  Navigation,
  RefreshCw,
  Signal,
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { type FC, useCallback, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DEFAULT_COORDINATES } from '@/constants/map';
import { TIME_PERIODS, TIME_THRESHOLD } from '@/constants/time';
import { cn } from '@/lib/utils';
import MapFloatingInfoSheet from './map-floating-info-sheet';

type PlateType = 'odd' | 'even';

interface PolicyStatus {
  hours: number;
  minutes: number;
  nextPeriod: 'mulai' | 'selesai';
}

const MapFloatingInfoCard: FC<{
  currentTime: Date;
  lastCoordinate: [number, number] | null;
  isLoadingAddress: boolean;
  streetAddress: string;
  userLocation: [number, number] | null;
  gpsAccuracy: number | null;
  locationError: string | null;
  onFetchStreetAddress: (lat: number, lng: number) => Promise<void>;
}> = ({
  currentTime,
  lastCoordinate,
  isLoadingAddress,
  streetAddress,
  userLocation,
  gpsAccuracy,
  locationError,
  onFetchStreetAddress,
}) => {
  const searchParams = useSearchParams();
  const plateType = searchParams.get('plate') as PlateType;

  // Memoize plate type validation
  const isValidPlateType = plateType && ['odd', 'even'].includes(plateType);

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

  // Memoize time progress calculation
  const timeProgress = useMemo<number>(() => {
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
  const currentPeriod =
    currentTime.getHours() < 10 ? TIME_PERIODS.MORNING : TIME_PERIODS.EVENING;

  // Memoize time until next change calculation
  const timeUntilChange = useMemo<PolicyStatus>(() => {
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

  const handleRefresh = useCallback(() => {
    if (lastCoordinate) {
      onFetchStreetAddress(lastCoordinate[0], lastCoordinate[1]);
    }
  }, [onFetchStreetAddress, lastCoordinate]);

  // Use destructured values from timeUntilChange
  const { hours, minutes, nextPeriod } = timeUntilChange;

  return (
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
                    (currentTime.getDate() % 2 === 0 && plateType === 'even') ||
                      (currentTime.getDate() % 2 !== 0 && plateType === 'odd')
                      ? 'text-emerald-600 dark:text-emerald-500'
                      : 'text-red-600 dark:text-red-500',
                  )}
                >
                  • {currentTime.getDate() % 2 === 0 ? 'Genap' : 'Ganjil'}
                </span>
              </Badge>
              <MapFloatingInfoSheet />
            </nav>

            {/* Status Messages */}
            <output aria-label="Current Status">
              <div
                className={cn(
                  'flex items-start gap-1.5 px-2.5 py-1.5 rounded-lg md:gap-2 md:px-3 md:py-2',
                  {
                    'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400':
                      statusInfo.type === 'success',
                    'bg-amber-500/15 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400':
                      statusInfo.type === 'warning',
                    'bg-red-500/15 text-red-700 dark:bg-red-500/10 dark:text-red-400':
                      statusInfo.type === 'error',
                  },
                )}
              >
                <div className="shrink-0 mt-0.5">{statusInfo.icon}</div>
                <div className="flex-1 min-w-0">
                  <div
                    className={cn(
                      'text-sm font-medium leading-none md:text-base md:leading-none',
                      'py-[.2rem] md:py-0.5',
                    )}
                  >
                    {statusInfo.message}
                  </div>
                  {statusInfo.subMessage && (
                    <div className="text-[10px] mt-1 opacity-90 md:text-xs">
                      {statusInfo.subMessage}
                    </div>
                  )}
                </div>
              </div>
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
                      userLocation === DEFAULT_COORDINATES && 'text-amber-500',
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
  );
};

export default MapFloatingInfoCard;
