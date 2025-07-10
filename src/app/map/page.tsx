import { type FC, Suspense } from 'react';
import MapLoadingScreen from '@/components/app/map/map-loading-screen';
import MapView from '@/components/app/map/map-view';
import type { Road } from '@/types/road';

/**
 * Fetches road data from the API endpoint.
 * This function is executed on the server.
 * @returns A promise that resolves to an array of Road objects.
 */
const getRoads = async (): Promise<Road[]> => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/roads`, {
      next: {
        revalidate: 2592000, // 1 month
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch roads:', response.statusText);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching roads:', error);
    return [];
  }
};

/**
 * The map page, rendered as a server component.
 * It fetches road data and passes it to the client-side MapView.
 */
const MapPage: FC = async () => {
  const roads = await getRoads();

  return (
    <Suspense fallback={<MapLoadingScreen />}>
      <MapView roads={roads} />
    </Suspense>
  );
};

export default MapPage;
