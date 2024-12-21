'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AdSensePlaceholder from '@/components/AdSensePlaceholder';
import {
  Clock,
  MapPin,
  AlertCircle,
  Car,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { POLICY_TIMES, TIME_PERIODS } from '@/constants/policy';
import { MAJOR_ROADS } from '@/constants/roads';
import { EXEMPTED_VEHICLES } from '@/constants/vehicles';

const PlateTypeOption = ({
  value,
  label,
  numbers,
  isSelected,
  onSelect,
}: {
  value: 'even' | 'odd';
  label: string;
  numbers: string;
  isSelected: boolean;
  onSelect: (value: 'even' | 'odd') => void;
}) => (
  <label
    className={cn(
      'relative flex flex-col items-center p-6 rounded-lg border-2 transition-all duration-300 cursor-pointer',
      'hover:bg-accent/50 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2',
      isSelected
        ? value === 'even'
          ? 'bg-gradient-to-br from-blue-600 to-cyan-600 text-white border-transparent shadow-lg scale-[1.02]'
          : 'bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-transparent shadow-lg scale-[1.02]'
        : 'border-border hover:border-border/80 dark:hover:border-border/60',
    )}
  >
    <input
      type="radio"
      className="sr-only"
      name="plateType"
      value={value}
      checked={isSelected}
      onChange={() => onSelect(value)}
    />
    <div className="text-center space-y-2">
      <div className="text-3xl font-bold tracking-tight">{label}</div>
      <div
        className={cn(
          'text-sm font-medium',
          isSelected ? 'text-white/90' : 'text-foreground/80',
        )}
      >
        {numbers}
      </div>
      {isSelected && (
        <CheckCircle2 className="w-5 h-5 mx-auto mt-2 animate-in fade-in-50 zoom-in-50 duration-300 text-white" />
      )}
    </div>
  </label>
);

export default function VehicleSelectionPage() {
  const [plateType, setPlateType] = useState<'even' | 'odd' | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handlePlateSelection = (type: 'even' | 'odd') => {
    setPlateType(type);
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        () => {
          setLocationPermission(true);
          setLocationError(null);
          navigator.geolocation.clearWatch(watchId);
        },
        (error) => {
          console.error('Error getting location:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setLocationError(
                'Akses lokasi ditolak. Mohon izinkan akses lokasi di pengaturan browser Anda.',
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setLocationError('Informasi lokasi tidak tersedia.');
              break;
            case error.TIMEOUT:
              setLocationError('Waktu permintaan akses lokasi habis.');
              break;
            default:
              setLocationError('Terjadi kesalahan saat mengakses lokasi.');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000,
        },
      );
    } else {
      setLocationError('Geolokasi tidak didukung oleh browser Anda.');
    }
  };

  const handleSubmit = () => {
    if (plateType && locationPermission) {
      router.push(`/map?plate=${plateType}`);
    } else {
      alert('Mohon pilih jenis plat nomor dan aktifkan layanan lokasi.');
    }
  };

  const getCurrentPeriod = () => {
    const hour = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const time = hour * 60 + minutes;

    if (time >= TIME_PERIODS.morning.start && time < TIME_PERIODS.morning.end)
      return 'morning';
    if (time >= TIME_PERIODS.evening.start && time < TIME_PERIODS.evening.end)
      return 'evening';
    return null;
  };

  const formatTimeRemaining = (targetTime: number) => {
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();
    const diff = targetTime - currentMinutes;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}j ${minutes}m`;
  };

  const currentPeriod = getCurrentPeriod();

  const nextPeriodInfo = (() => {
    const currentMinutes =
      currentTime.getHours() * 60 + currentTime.getMinutes();

    if (currentPeriod === null) {
      if (currentMinutes < TIME_PERIODS.morning.start) {
        return {
          period: 'morning',
          timeRemaining: formatTimeRemaining(TIME_PERIODS.morning.start),
        };
      }
      if (currentMinutes < TIME_PERIODS.evening.start) {
        return {
          period: 'evening',
          timeRemaining: formatTimeRemaining(TIME_PERIODS.evening.start),
        };
      }
    }

    if (currentPeriod === 'morning') {
      return {
        period: 'evening',
        timeRemaining: formatTimeRemaining(TIME_PERIODS.evening.start),
      };
    }

    if (currentPeriod === 'evening') {
      return {
        period: 'morning',
        timeRemaining: formatTimeRemaining(
          TIME_PERIODS.morning.start + 24 * 60,
        ),
      };
    }

    return null;
  })();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-white via-blue-50/30 to-white dark:from-gray-900 dark:via-blue-950/30 dark:to-gray-900">
      <div className="w-full max-w-4xl space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl leading-tight font-bold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {' '}
            Ganjil Genap
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Navigasi sistem pembatasan lalu lintas Jakarta dengan mudah dan
            tepat waktu
          </p>
        </div>

        {/* Primary Action: Selection Card */}
        <div className="max-w-2xl mx-auto w-full">
          <Card className="border-border transition-colors duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2.5 text-foreground">
                <Car className="w-5 h-5 shrink-0 text-blue-600" />
                Pilih Jenis Plat Nomor
              </CardTitle>
              <CardDescription className="text-base">
                Pilih jenis plat nomor kendaraan Anda untuk melihat area yang
                dapat dilalui
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className="grid grid-cols-2 gap-4"
                role="radiogroup"
                aria-label="Pilihan jenis plat nomor"
              >
                <PlateTypeOption
                  value="odd"
                  label="Ganjil"
                  numbers="1, 3, 5, 7, 9"
                  isSelected={plateType === 'odd'}
                  onSelect={handlePlateSelection}
                />
                <PlateTypeOption
                  value="even"
                  label="Genap"
                  numbers="0, 2, 4, 6, 8"
                  isSelected={plateType === 'even'}
                  onSelect={handlePlateSelection}
                />
              </div>

              {!locationPermission && (
                <div
                  className={cn(
                    'bg-muted rounded-lg p-4 transition-all duration-300',
                    !plateType && 'ring-2 ring-blue-600/20',
                  )}
                >
                  <div className="flex items-center gap-2.5 text-sm text-foreground/80 bg-accent/50 dark:bg-accent/20 p-3 rounded-md">
                    <AlertCircle className="w-4 h-4 shrink-0 text-blue-600" />
                    <span>
                      {locationError ||
                        'Mohon izinkan akses lokasi untuk melanjutkan'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-3 hover:bg-accent hover:text-accent-foreground font-medium"
                    onClick={handleLocationPermission}
                  >
                    Izinkan Akses Lokasi
                  </Button>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className={cn(
                  'w-full transition-all duration-300 font-medium text-base py-6',
                  plateType && locationPermission
                    ? 'shadow-md'
                    : 'opacity-50 cursor-not-allowed hover:opacity-60',
                )}
                onClick={handleSubmit}
                disabled={!plateType || !locationPermission}
              >
                {!plateType
                  ? 'Pilih jenis plat nomor terlebih dahulu'
                  : !locationPermission
                    ? 'Izinkan akses lokasi terlebih dahulu'
                    : 'Lanjut ke Peta'}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Secondary Information */}
        <div className="space-y-6">
          <div className="relative flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
            <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/5 dark:to-purple-500/5 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200/20 dark:border-blue-500/10 text-sm font-medium text-muted-foreground">
              Informasi Kebijakan
            </div>
            <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Time Restriction Card */}
            <Card className="h-fit border-border/40 transition-colors duration-300 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-lg font-semibold text-foreground">
                    Waktu Berlaku
                  </span>
                </div>
                <CardDescription className="text-base">
                  Senin - Jumat, kecuali hari libur nasional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Morning Time Block */}
                  <div
                    className={cn(
                      'bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg p-4 transition-all duration-300',
                      currentPeriod === 'morning' &&
                        'ring-2 ring-amber-500 ring-offset-2',
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-amber-500" />
                        <span className="text-lg font-medium text-amber-900 dark:text-amber-100">
                          Pagi
                        </span>
                      </div>
                      {currentPeriod === 'morning' ? (
                        <div className="flex items-center gap-1.5 bg-amber-500/10 dark:bg-amber-500/20 px-2.5 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                            Sedang Berlaku
                          </span>
                        </div>
                      ) : (
                        nextPeriodInfo?.period === 'morning' && (
                          <div className="flex items-center gap-1.5 bg-accent/50 dark:bg-accent/20 px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-amber-500" />
                            <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                              {nextPeriodInfo.timeRemaining}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="bg-white/80 dark:bg-background/40 rounded-lg p-3 shadow-sm">
                      <p className="text-[38px] leading-none font-bold tracking-tight whitespace-nowrap text-amber-900 dark:text-amber-100">
                        {POLICY_TIMES.morning.start} -{' '}
                        {POLICY_TIMES.morning.end}
                      </p>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2 text-sm text-amber-700 dark:text-amber-300">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Berlaku selama 4 jam</span>
                    </div>
                  </div>

                  {/* Evening Time Block */}
                  <div
                    className={cn(
                      'bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-4 transition-all duration-300',
                      currentPeriod === 'evening' &&
                        'ring-2 ring-blue-500 ring-offset-2',
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-lg font-medium text-blue-900 dark:text-blue-100">
                          Sore
                        </span>
                      </div>
                      {currentPeriod === 'evening' ? (
                        <div className="flex items-center gap-1.5 bg-blue-500/10 dark:bg-blue-500/20 px-2.5 py-1 rounded-full">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                            Sedang Berlaku
                          </span>
                        </div>
                      ) : (
                        nextPeriodInfo?.period === 'evening' && (
                          <div className="flex items-center gap-1.5 bg-accent/50 dark:bg-accent/20 px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3 text-blue-500" />
                            <span className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {nextPeriodInfo.timeRemaining}
                            </span>
                          </div>
                        )
                      )}
                    </div>
                    <div className="bg-white/80 dark:bg-background/40 rounded-lg p-3 shadow-sm">
                      <p className="text-[38px] leading-none font-bold tracking-tight whitespace-nowrap text-blue-900 dark:text-blue-100">
                        {POLICY_TIMES.evening.start} -{' '}
                        {POLICY_TIMES.evening.end}
                      </p>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                      <Clock className="w-4 h-4 shrink-0" />
                      <span>Berlaku selama 5 jam</span>
                    </div>
                  </div>

                  {!currentPeriod && !nextPeriodInfo && (
                    <div className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300 bg-gray-100/50 dark:bg-gray-800/20 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-gray-500 shrink-0" />
                      <span>Kebijakan ganjil genap sedang tidak berlaku</span>
                    </div>
                  )}

                  {/* Exempted Vehicles */}
                  <div className="mt-6">
                    <p className="text-sm font-medium text-foreground mb-2.5">
                      Kendaraan yang dikecualikan:
                    </p>
                    <div className="bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg divide-y divide-border/60">
                      {Object.entries(EXEMPTED_VEHICLES).map(
                        ([key, category]) => (
                          <div key={key} className="p-2.5 space-y-1">
                            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
                              {category.title}
                            </p>
                            {category.items.map((item) => (
                              <div
                                key={item}
                                className="flex items-center gap-2 px-1.5 py-1 rounded-md hover:bg-white/60 dark:hover:bg-white/5 transition-colors group"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                <span className="text-sm text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Area Coverage Card */}
            <Card className="h-fit border-border/40 transition-colors duration-300 shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-5 h-5 text-blue-500 shrink-0" />
                  <span className="text-lg font-semibold text-foreground">
                    Area Berlaku
                  </span>
                </div>
                <CardDescription className="text-base">
                  Berdasarkan Pergub No. 88 Tahun 2019
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Road List */}
                <div className="bg-gradient-to-br from-gray-50/50 to-slate-50/50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg">
                  <div className="relative max-h-[600px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground/10 hover:scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
                    <div className="sticky top-0 right-0 z-10 flex justify-end p-2.5 bg-gradient-to-b from-gray-50/90 dark:from-gray-900/90">
                      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-500/20 dark:to-purple-500/20 backdrop-blur-sm text-xs font-medium text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-full border border-blue-200/20 dark:border-blue-500/10">
                        Scroll untuk melihat lebih banyak
                      </div>
                    </div>
                    <div className="p-4 pt-0 space-y-6">
                      {Object.entries(MAJOR_ROADS).map(([region, roads]) => (
                        <div key={region}>
                          <div className="flex items-center gap-2.5 mb-3">
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                              Jakarta{' '}
                              {region.charAt(0).toUpperCase() + region.slice(1)}
                            </p>
                            <div className="h-px flex-1 bg-gradient-to-r from-blue-200/60 to-purple-200/60 dark:from-blue-700/30 dark:to-purple-700/30" />
                          </div>
                          <div className="grid grid-cols-1 gap-2 pl-1.5">
                            {roads.map((road) => (
                              <div
                                key={road}
                                className="flex items-center gap-2.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
                              >
                                <ArrowRight className="w-4 h-4 text-primary shrink-0" />
                                <span>{road}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid gap-2.5">
                  <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20 p-3.5 rounded-lg group hover:bg-white/60 dark:hover:bg-white/5">
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                    <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      Pelanggaran dikenakan denda maksimal Rp500.000
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 p-3.5 rounded-lg group hover:bg-white/60 dark:hover:bg-white/5">
                    <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      Pengawasan dilakukan secara manual oleh Aparat Kepolisian
                      dan tilang elektronik (ETLE)
                    </span>
                  </div>
                  <div className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-300 bg-gradient-to-br from-purple-50/50 to-violet-50/50 dark:from-purple-950/20 dark:to-violet-950/20 p-3.5 rounded-lg group hover:bg-white/60 dark:hover:bg-white/5">
                    <AlertCircle className="w-4 h-4 text-purple-500 mt-0.5 shrink-0" />
                    <span className="group-hover:text-gray-900 dark:group-hover:text-gray-100">
                      Diatur dalam pasal 287 UU Nomor 12 Tahun 2009 tentang Lalu
                      Lintas dan Angkutan Jalan
                    </span>
                  </div>
                </div>

                {/* Official Link */}
                <div className="mt-6">
                  <a
                    href="https://www.jakarta.go.id/ganjil-genap"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline font-medium"
                  >
                    Informasi resmi
                    <ExternalLink className="w-4 h-4 shrink-0" />
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AdSensePlaceholder className="mt-12" />
    </div>
  );
}
