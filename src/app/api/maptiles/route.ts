import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const apiKey = process.env.MAPTILER_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json(
      { error: 'MapTiler API key not configured' },
      { status: 500 }
    );
  }

  const { searchParams } = new URL(request.url);
  const path = searchParams.get('path');

  if (!path) {
    return NextResponse.json(
      { error: 'Path parameter is required' },
      { status: 400 }
    );
  }

  try {
    const maptilerUrl = `https://api.maptiler.com${path}${path.includes('?') ? '&' : '?'}key=${apiKey}`;
    const response = await fetch(maptilerUrl);
    
    const contentType = response.headers.get('content-type') ?? '';
    
    if (contentType.includes('application/json')) {
      const data = await response.json();
      return NextResponse.json(data);
    }
    
    // For non-JSON responses (like images), return the raw response
    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        'content-type': contentType,
      },
    });
  } catch (error) {
    console.error('MapTiler API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from MapTiler' },
      { status: 500 }
    );
  }
} 
