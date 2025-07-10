export const GEOLOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 5000,
  maximumAge: 10000,
};

export const MAX_RETRIES = 5;
export const RETRY_DELAY = 1000;
export const FALLBACK_TIMEOUT = 30000;
export const PERIODIC_REFRESH = 300000;
export const LOCATION_THRESHOLD = 0.00025; // Approximately 25 meters
export const UPDATE_DEBOUNCE = 100; // 100ms debounce for location updates
