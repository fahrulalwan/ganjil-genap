'use client';

import { Car } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import SelectVehicleLicenseInput from './select-vehicle-license-input';
import SelectVehicleLicenseLocationInput from './select-vehicle-license-location-input';

const SelectVehicleLicenseForm = () => {
  const router = useRouter();

  const [plateType, setPlateType] = useState<'even' | 'odd' | null>(null);
  const [locationPermission, setLocationPermission] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (plateType && locationPermission) {
      router.push(`/map?plate=${plateType}`);
    } else {
      const message = plateType
        ? 'Mohon aktifkan layanan lokasi terlebih dahulu.'
        : 'Mohon pilih jenis plat nomor terlebih dahulu.';
      alert(message);
    }
  };

  let buttonAriaLabel: string;
  let buttonText: string;

  if (!plateType) {
    buttonAriaLabel = 'Pilih jenis plat nomor terlebih dahulu';
    buttonText = 'Pilih Jenis Plat Nomor';
  } else if (!locationPermission) {
    buttonAriaLabel = 'Aktifkan akses lokasi terlebih dahulu';
    buttonText = 'Aktifkan Akses Lokasi';
  } else {
    buttonAriaLabel = 'Lihat area yang dapat dilalui';
    buttonText = 'Lihat Area yang Dapat Dilalui';
  }

  return (
    <form
      className="max-w-2xl mx-auto w-full"
      onSubmit={handleSubmit}
      aria-label="Form pemilihan plat nomor"
      noValidate
    >
      <Card className="border-border transition-colors duration-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2.5 text-foreground">
            <Car
              className="w-5 h-5 shrink-0 text-blue-600"
              aria-hidden="true"
            />
            <span>Pilih Jenis Plat Nomor</span>
          </CardTitle>
          <CardDescription className="text-base">
            Pilih jenis plat nomor kendaraan Anda untuk melihat area yang dapat
            dilalui
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <fieldset
            className="grid grid-cols-2 gap-4"
            aria-label="Pilihan jenis plat nomor"
            aria-invalid={!plateType}
            aria-errormessage={!plateType ? 'plate-error' : undefined}
          >
            <legend className="sr-only">
              Pilih jenis plat nomor kendaraan
            </legend>
            {!plateType && (
              <div id="plate-error" className="sr-only" role="alert">
                Mohon pilih jenis plat nomor kendaraan Anda
              </div>
            )}
            <SelectVehicleLicenseInput
              value="odd"
              label="Ganjil"
              numbers="1, 3, 5, 7, 9"
              isSelected={plateType === 'odd'}
              onSelect={setPlateType}
            />
            <SelectVehicleLicenseInput
              value="even"
              label="Genap"
              numbers="2, 4, 6, 8, 0"
              isSelected={plateType === 'even'}
              onSelect={setPlateType}
            />
          </fieldset>

          <SelectVehicleLicenseLocationInput
            locationPermission={locationPermission}
            onPermissionChange={setLocationPermission}
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={!plateType || !locationPermission}
            aria-label={buttonAriaLabel}
          >
            {buttonText}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default SelectVehicleLicenseForm;
