export const transformRequest = (url: string) => {
  if (url.startsWith('https://api.maptiler.com')) {
    try {
      const originalUrl = new URL(url);
      const path = originalUrl.pathname;
      const proxyUrl = new URL('/api/maptiles', window.location.origin);
      proxyUrl.searchParams.set('path', path);
      return {
        url: proxyUrl.toString(),
      };
    } catch {
      return { url };
    }
  }
  return { url };
}; 
