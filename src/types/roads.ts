// Region types
export type Region = 'pusat' | 'selatan' | 'timur' | 'barat';

// Coordinate types
export type Coordinate = [number, number];
export type LandmarkCoordinate = {
  name: string;
  coordinates: Coordinate;
};

// Road properties
export interface RoadProperties {
  name: string;
  region: Region;
  description: string;
  length: number;
  startPoint: string;
  endPoint: string;
  intersections: string[];
  restrictions: string[];
  landmarks: LandmarkCoordinate[];
}

// GeoJSON types
export interface RoadFeature {
  type: 'Feature';
  properties: RoadProperties;
  geometry: {
    type: 'LineString';
    coordinates: Coordinate[];
  };
}

export interface RoadCollection {
  type: 'FeatureCollection';
  features: RoadFeature[];
}

// Helper functions
export const isValidRegion = (region: string): region is Region => {
  return ['pusat', 'selatan', 'timur', 'barat'].includes(region);
};

// Color mapping for regions
export const REGION_COLORS: Record<Region, string> = {
  pusat: '#FF4B4B',    // Red
  selatan: '#4B83FF',  // Blue
  timur: '#4BFF4B',    // Green
  barat: '#FFB74B'     // Orange
}; 