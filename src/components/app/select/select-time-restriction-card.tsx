'use client';

import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { POLICY_TIMES, TIME_PERIODS } from '@/constants/policy';
import { EXEMPTED_VEHICLES } from '@/constants/vehicles';
import { cn } from '@/lib/utils';

const SelectTimeRestrictionCard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const oneMinute = 60000;

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, oneMinute);

    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const time = hour * 60 + minutes;

  let currentPeriod: 'morning' | 'evening' | null = null;

  if (time >= TIME_PERIODS.morning.start && time < TIME_PERIODS.morning.end) {
    currentPeriod = 'morning';
  } else if (
    time >= TIME_PERIODS.evening.start &&
    time < TIME_PERIODS.evening.end
  ) {
    currentPeriod = 'evening';
  }

  const formatTimeRemaining = (targetTime: number) => {
    const currentMinutes = time;
    const diff = targetTime - currentMinutes;

    if (diff <= 0) return null;

    const hours = Math.floor(diff / 60);
    const minutes = diff % 60;

    return `${hours}j ${minutes}m`;
  };

  const getNextPeriodInfo = () => {
    const currentMinutes = time;

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
  };

  const nextPeriodInfo = getNextPeriodInfo();

  return (
    <Card className="h-fit border-border/40 transition-colors duration-300 shadow-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2.5">
          <Clock
            className="w-5 h-5 text-blue-500 shrink-0"
            aria-hidden="true"
          />
          <span className="text-lg font-semibold text-foreground">
            Waktu Berlaku
          </span>
        </CardTitle>
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
                {POLICY_TIMES.morning.start} - {POLICY_TIMES.morning.end}
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
                {POLICY_TIMES.evening.start} - {POLICY_TIMES.evening.end}
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
              {Object.entries(EXEMPTED_VEHICLES).map(([key, category]) => (
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
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectTimeRestrictionCard;
