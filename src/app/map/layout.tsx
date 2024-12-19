import 'leaflet/dist/leaflet.css';
import type { ReactNode } from 'react';
// import L from 'leaflet';

// Fix for default marker icon
// delete (L.Icon.Default.prototype as any)._getIconUrl;

// L.Icon.Default.mergeOptions({
//   iconRetinaUrl: '/marker-icon-2x.png',
//   iconUrl: '/marker-icon.png',
//   shadowUrl: '/marker-shadow.png',
// });

export default function MapLayout({
  children,
}: { children: Readonly<ReactNode> }) {
  return children;
}
