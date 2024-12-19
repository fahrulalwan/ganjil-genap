import { type NextRequest, NextResponse } from 'next/server';

// Allowed paths for the proxy
const ALLOWED_PATHS = ['/maps', '/data', '/tiles', '/fonts'];
const MAX_PATH_LENGTH = 256; // Maximum allowed path length

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

export async function GET(request: NextRequest) {
  const apiKey = process.env.MAPTILER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Internal server error' }, // Don't expose specific configuration issues
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
    const maptilerUrl = `https://api.maptiler.com${path}${path.includes('?') ? '&' : '?'}key=${apiKey}`;
    const response = await fetch(maptilerUrl, {
      headers: {
        'User-Agent': getUserAgent(),
      },
    });
    
    if (!response.ok) {
      throw new Error(`MapTiler API responded with status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type') ?? '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // For non-JSON responses (like images), return the raw response with proper content type
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'content-type': contentType,
        'cache-control': 'public, max-age=1209600', // Cache static assets for 2 weeks
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
