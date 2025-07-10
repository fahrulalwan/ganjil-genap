import { NextResponse } from 'next/server';
import { processKml } from '@/lib/kml-processor';

export async function GET() {
  try {
    const roads = await processKml();
    return NextResponse.json(roads);
  } catch (error) {
    console.error('Error processing KML data:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
