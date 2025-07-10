import type { LngLatBoundsLike } from '@maptiler/sdk';

export const DEFAULT_COORDINATES: [number, number] = [-6.2088, 106.8456]; // Jakarta coordinates
export const DEFAULT_ZOOM = 18;

export const JABODETABEK_BOUNDS: LngLatBoundsLike = [
  [106.4, -6.5],
  [107.2, -6.1],
];

export const ERROR_MESSAGES = {
  NO_LOCATION: 'Lokasi tidak ditemukan, silahkan coba lagi.',
  NO_ROAD: 'Tidak ada nama jalan yang ditemukan di lokasi Anda.',
  FETCH_FAILED: 'Gagal mengambil data, silahkan coba lagi.',
  UNKNOWN: 'Kesalahan tidak diketahui, silahkan coba lagi.',
  INITIALIZATION: 'Failed to initialize map',
  LOAD_ERROR: 'Failed to load map. Please try refreshing the page.',
  INVALID_COORDINATES: 'Invalid coordinates provided',
} as const;
