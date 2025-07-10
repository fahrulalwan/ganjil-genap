export const ALLOWED_PATHS = [
  '/maps',
  '/data',
  '/tiles',
  '/fonts',
  '/geocoding',
] as const;
export const MAX_PATH_LENGTH = 256; // Maximum allowed path length

export const CACHE_CONFIG = {
  TILES: {
    VECTOR: 60 * 60 * 24 * 14, // 14 days for vector tiles
    RASTER: 60 * 60 * 24 * 7, // 7 days for raster tiles
  },
  FONTS: 60 * 60 * 24 * 30, // 30 days for fonts (rarely change)
  MAPS: 60 * 60, // 1 hour for map data
  DATA: 60 * 5, // 5 minutes for dynamic data
  GEOCODING: 60 * 30, // 30 minutes for geocoding results
} as const;
