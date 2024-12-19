export const transformRequest = (url: string) => {
  if (!url.startsWith('https://api.maptiler.com')) {
    return { url };
  }

  try {
    const originalUrl = new URL(url);
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
