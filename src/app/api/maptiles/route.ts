import { RATE_LIMIT, isRateLimited } from '@/utils/rateLimit';
import { type NextRequest, NextResponse } from 'next/server';

// Allowed paths for the proxy
const ALLOWED_PATHS = ['/maps', '/data', '/tiles', '/fonts', '/geocoding'] as const;
const MAX_PATH_LENGTH = 256; // Maximum allowed path length

// Cache configuration based on content type
const CACHE_CONFIG = {
  TILES: {
    VECTOR: 60 * 60 * 24 * 14, // 14 days for vector tiles
    RASTER: 60 * 60 * 24 * 7,  // 7 days for raster tiles
  },
  FONTS: 60 * 60 * 24 * 30,    // 30 days for fonts (rarely change)
  MAPS: 60 * 60,               // 1 hour for map data
  DATA: 60 * 5,                // 5 minutes for dynamic data
  GEOCODING: 60 * 30,          // 30 minutes for geocoding results
} as const;

// Get User-Agent from npm environment variables
function getUserAgent(): string {
  const name = process.env.npm_package_name ?? 'unknown';
  const version = process.env.npm_package_version ?? '0.0.0';
  return `${name}/${version} MapTilerProxy`;
}

function isValidPath(path: string): boolean {
  // Check path length
  if (!path || path.length > MAX_PATH_LENGTH) {
    return false;
  }

  // Check if path starts with allowed prefixes
  if (!ALLOWED_PATHS.some(allowedPath => path.startsWith(allowedPath))) {
    return false;
  }

  // Prevent path traversal attempts
  if (path.includes('..') || path.includes('\\')) {
    return false;
  }

  return true;
}

function getClientIp(request: NextRequest): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
}

function getCacheDuration(path: string): number {
  // Determine cache duration based on path and content type
  if (path.startsWith('/fonts')) {
    return CACHE_CONFIG.FONTS;
  }
  
  if (path.startsWith('/tiles')) {
    // Vector tiles typically have pbf or mvt extension
    return path.endsWith('.pbf') || path.endsWith('.mvt')
      ? CACHE_CONFIG.TILES.VECTOR
      : CACHE_CONFIG.TILES.RASTER;
  }
  
  if (path.startsWith('/maps')) {
    return CACHE_CONFIG.MAPS;
  }
  
  if (path.startsWith('/data')) {
    return CACHE_CONFIG.DATA;
  }

  if (path.startsWith('/geocoding')) {
    return CACHE_CONFIG.GEOCODING;
  }
  
  // Default to short cache for unknown paths
  return CACHE_CONFIG.DATA;
}

export async function GET(request: NextRequest) {
  // Get client IP using the enhanced function
  const ip = getClientIp(request);

  // Check rate limit
  if (isRateLimited(ip, 300)) {
    console.warn(`[MapTilerProxy] Rate limit exceeded for IP: ${ip}`);
    return NextResponse.json(
      { error: 'Too many requests' },
      { 
        status: 429,
        headers: {
          'Retry-After': String(RATE_LIMIT.BLOCK_DURATION_MS / 1000),
        }
      }
    );
  }

  const apiKey = process.env.MAPTILER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path || !isValidPath(path)) {
    return NextResponse.json(
      { error: 'Invalid request' },
      { status: 400 }
    );
  }

  try {
    const userAgent = getUserAgent();

    console.log('[MapTilerProxy] User Agent:', userAgent);
    console.log('[MapTilerProxy] Origin:', {
      'VERCEL_BRANCH_URL': process.env.VERCEL_BRANCH_URL,
      'VERCEL_URL': process.env.VERCEL_URL,
    });

    const maptilerUrl = `https://api.maptiler.com${path}${path.includes('?') ? '&' : '?'}key=${apiKey}`;
    
    const response = await fetch(maptilerUrl, {
      headers: {
        'Origin': process.env.VERCEL_BRANCH_URL ?? process.env.VERCEL_URL as string,
        'User-Agent': userAgent,
      },
      // Use Next.js built-in caching with specific durations
      next: {
        revalidate: getCacheDuration(path)
      }
    });
    
    if (!response.ok) {
      console.error('[MapTilerProxy] Error:', response);
      throw new Error(`MapTiler API responded with status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    const cacheDuration = getCacheDuration(path);
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data, {
        headers: {
          'cache-control': `public, max-age=${cacheDuration}`,
        }
      });
    }
    
    // For non-JSON responses (like images), return the raw response with proper content type
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'content-type': contentType,
        'cache-control': `public, max-age=${cacheDuration}`,
      },
    });
  } catch (error) {
    console.error('[MapTilerProxy] Error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Service unavailable' },
      { status: 503 }
    );
  }
} 
