export const TIME_THRESHOLD = 60; // minutes

export const TIME_PERIODS = {
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
