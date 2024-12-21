export const POLICY_TIMES = {
  morning: { start: '06:00', end: '10:00' },
  evening: { start: '16:00', end: '21:00' },
} as const;

export const TIME_PERIODS = {
  morning: {
    start: 6 * 60, // 06:00
    end: 10 * 60,  // 10:00
  },
  evening: {
    start: 16 * 60, // 16:00
    end: 21 * 60,   // 21:00
  },
} as const; 
