export const transformRequest = (url: string) => {
  try {
    const originalUrl = new URL(url);
    const allowedHosts = ['api.maptiler.com'];
    
    if (!allowedHosts.includes(originalUrl.host)) {
      return { url };
    }

    const proxyUrl = new URL('/api/maptiles', window.location.origin);
    proxyUrl.searchParams.set('path', originalUrl.pathname);
    
    return {
      url: proxyUrl.toString(),
    };
  } catch (error) {
    console.warn('Error transforming URL:', error instanceof Error ? error.message : 'Unknown error');
    return { url };
  }
}; 
