'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import AdSensePlaceholder from '@/components/AdSensePlaceholder';

export default function VehicleSelectionPage() {
  const [plateType, setPlateType] = useState<'even' | 'odd' | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);
  const router = useRouter();

  const handlePlateSelection = (type: 'even' | 'odd') => {
    setPlateType(type);
  };

  const handleLocationPermission = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationPermission(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert(
            'Mohon aktifkan layanan lokasi untuk menggunakan aplikasi ini.',
          );
        },
      );
    } else {
      alert('Geolokasi tidak didukung oleh browser Anda.');
    }
  };

  const handleSubmit = () => {
    if (plateType && locationPermission) {
      router.push(`/map?plate=${plateType}`);
    } else {
      alert('Mohon pilih jenis plat nomor dan aktifkan layanan lokasi.');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Informasi Kendaraan
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Pilih jenis plat nomor Anda:
            </h2>
            <div className="flex justify-center space-x-4">
              <Button
                onClick={() => handlePlateSelection('even')}
                variant={plateType === 'even' ? 'default' : 'outline'}
              >
                Genap
              </Button>
              <Button
                onClick={() => handlePlateSelection('odd')}
                variant={plateType === 'odd' ? 'default' : 'outline'}
              >
                Ganjil
              </Button>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-4">
              Aktifkan layanan lokasi:
            </h2>
            <Button
              onClick={handleLocationPermission}
              className="w-full"
              variant={locationPermission ? 'default' : 'outline'}
            >
              {locationPermission ? 'Lokasi Diaktifkan' : 'Aktifkan Lokasi'}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!plateType || !locationPermission}
          >
            Lanjut ke Peta
          </Button>
        </CardFooter>
      </Card>
      <AdSensePlaceholder className="mt-8" />
    </div>
  );
}
