import { DOMParser } from 'xmldom';

// Types
interface Road {
  name: string;
  coordinates: [number, number][];
}

// Utility Functions
function parseCoordinates(coordStr: string): [number, number][] {
  return coordStr
    .split(/\s+/)
    .map(coord => {
      const parts = coord.split(',');
      if (parts.length >= 2) {
        return [parseFloat(parts[0]), parseFloat(parts[1])] as [number, number];
      }
      return null;
    })
    .filter((coord): coord is [number, number] => coord !== null);
}

function extractDataFromPlacemark(placemark: Element): Road | null {
  const nameElement = placemark.getElementsByTagName('name')[0];
  const name = nameElement?.textContent?.trim() ?? '';

  const lineString = placemark.getElementsByTagName('LineString')[0];
  if (!lineString) return null;

  const coordinatesElement = lineString.getElementsByTagName('coordinates')[0];
  const coordinatesStr = coordinatesElement?.textContent?.trim() ?? '';
  if (!coordinatesStr) return null;

  const coordinates = parseCoordinates(coordinatesStr);
  return coordinates.length > 0 ? { name, coordinates } : null;
}

export async function processKml(): Promise<Road[]> {
  const kmlUrl = process.env.KML_URL;
  if (!kmlUrl) {
    throw new Error('KML_URL environment variable not set');
  }

  const oneMonthInSeconds = 2592000; // 30 days
  const response = await fetch(kmlUrl, { next: { revalidate: oneMonthInSeconds } });
  if (!response.ok) {
    throw new Error(`Failed to fetch KML data: ${response.statusText}`);
  }

  const kmlText = await response.text();
  const parser = new DOMParser();
  const kml = parser.parseFromString(kmlText, 'application/xml');
  const placemarks = Array.from(kml.getElementsByTagName('Placemark'));

  return placemarks
    .map(extractDataFromPlacemark)
    .filter((data): data is Road => data !== null);
}
