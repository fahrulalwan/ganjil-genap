import { AlertCircle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const MapFloatingInfoSheet = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 md:h-8 md:w-8 ml-auto border-border dark:border-gray-800"
        >
          <Info className="w-3 h-3 md:w-4 md:h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto bg-background text-foreground border-border dark:border-gray-800">
        <SheetHeader>
          <SheetTitle className="text-gray-900 dark:text-gray-100">
            Informasi Kebijakan
          </SheetTitle>
          <SheetDescription className="text-gray-600 dark:text-gray-400">
            Detail pemberlakuan ganjil genap di lokasi Anda
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          {/* Time Periods */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              Waktu Berlaku
            </h4>
            <div className="grid gap-4">
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Pagi
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  06:00 - 10:00
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Senin - Jumat (Hari Kerja)
                </div>
              </div>
              <div className="bg-muted p-3 rounded-lg space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    Sore
                  </span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  16:00 - 21:00
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  Senin - Jumat (Hari Kerja)
                </div>
              </div>
            </div>
          </div>

          {/* Important Notes */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Catatan Penting</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                <span>
                  Pelanggaran dikenakan denda maksimal Rp500.000 sesuai
                  Peraturan Gubernur DKI Jakarta
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>
                  Pengawasan dilakukan melalui:
                  <ul className="mt-1 ml-4 space-y-1">
                    <li>• Petugas Kepolisian di lapangan</li>
                    <li>• Tilang elektronik (ETLE)</li>
                    <li>• Kamera pengawas di persimpangan</li>
                  </ul>
                </span>
              </div>
              <div className="flex items-start gap-2 text-sm">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <span>
                  Kebijakan tidak berlaku pada hari libur nasional dan akhir
                  pekan
                </span>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MapFloatingInfoSheet;
